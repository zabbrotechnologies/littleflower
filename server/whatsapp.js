import QRCode from 'qrcode';
import pino from 'pino';
import makeWASocket, {
  DisconnectReason,
  initAuthCreds,
  BufferJSON,
  proto,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys';
import { query } from './db.js';
import { generateAdmissionPdfBuffer } from './pdfInvoice.js';

let sock = null;
let lastMessageAt = 0;

// In-memory session tracking synced with Neon DB
let currentSession = {
  status: 'disconnected', // 'disconnected' | 'qr_ready' | 'connected'
  phoneNumber: null,
  qrCodeDataUrl: null,
  antiBanProtection: true,
  lastConnected: null,
};

function formatPhoneFromJid(jid) {
  if (!jid) return null;
  const digits = jid.split(':')[0].split('@')[0].replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('91') && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return `+${digits}`;
}

function toWhatsAppJid(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 10) {
    digits = '91' + digits;
  }
  return `${digits}@s.whatsapp.net`;
}

/**
 * Neon PostgreSQL-backed Baileys Auth State.
 * Persists credentials across Render restarts/redeploys until explicit Disconnect Session.
 */
async function useNeonAuthState() {
  const readData = async (keyId) => {
    const res = await query('SELECT key_data FROM whatsapp_auth_keys WHERE key_id = $1', [keyId]);
    if (res.rows.length === 0) return null;
    return JSON.parse(res.rows[0].key_data, BufferJSON.reviver);
  };

  const writeData = async (keyId, data) => {
    const json = JSON.stringify(data, BufferJSON.replacer);
    await query(
      `INSERT INTO whatsapp_auth_keys (key_id, key_data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key_id) DO UPDATE SET key_data = EXCLUDED.key_data, updated_at = NOW()`,
      [keyId, json]
    );
  };

  const removeData = async (keyId) => {
    await query('DELETE FROM whatsapp_auth_keys WHERE key_id = $1', [keyId]);
  };

  const creds = (await readData('creds')) || initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data = {};
          await Promise.all(
            ids.map(async (id) => {
              let value = await readData(`${type}-${id}`);
              if (type === 'app-state-sync-key' && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }
              data[id] = value;
            })
          );
          return data;
        },
        set: async (data) => {
          const tasks = [];
          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id];
              const keyId = `${category}-${id}`;
              if (value) {
                tasks.push(writeData(keyId, value));
              } else {
                tasks.push(removeData(keyId));
              }
            }
          }
          await Promise.all(tasks);
        },
      },
    },
    saveCreds: async () => {
      await writeData('creds', creds);
    },
  };
}

async function clearNeonAuthState() {
  try {
    await query('DELETE FROM whatsapp_auth_keys');
  } catch (err) {
    console.error('[WhatsApp Engine] Error clearing Neon auth keys:', err.message);
  }
}

async function startSocket({ waitForQr = false } = {}) {
  if (sock) {
    try {
      sock.end(undefined);
    } catch {}
    sock = null;
  }

  const { state, saveCreds } = await useNeonAuthState();
  const { version } = await fetchLatestBaileysVersion();

  return new Promise((resolve, reject) => {
    let settled = false;
    const timeout = waitForQr
      ? setTimeout(() => {
          if (!settled) {
            settled = true;
            reject(new Error('Timed out waiting for WhatsApp QR code. Please try again.'));
          }
        }, 20000)
      : null;

    sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: 'silent' }),
      browser: ['Little Flowers Academy', 'Chrome', '120.0.0'],
      printQRInTerminal: false,
      connectTimeoutMs: 25000,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        try {
          const qrCodeDataUrl = await QRCode.toDataURL(qr, {
            errorCorrectionLevel: 'M',
            margin: 2,
            color: { dark: '#1E293B', light: '#FFFFFF' },
            width: 280,
          });

          currentSession.status = 'qr_ready';
          currentSession.qrCodeDataUrl = qrCodeDataUrl;

          await query(`
            UPDATE whatsapp_sessions
            SET status = 'qr_ready', qr_data = $1, updated_at = NOW()
            WHERE id = 'primary'
          `, [qrCodeDataUrl]).catch(() => {});

          if (waitForQr && !settled) {
            settled = true;
            clearTimeout(timeout);
            resolve({
              status: 'qr_ready',
              qrCodeDataUrl,
              message: 'Scan this real WhatsApp QR code with WhatsApp > Linked Devices.',
            });
          }
        } catch (err) {
          if (waitForQr && !settled) {
            settled = true;
            clearTimeout(timeout);
            reject(err);
          }
        }
      }

      if (connection === 'open') {
        const realPhone = formatPhoneFromJid(sock?.user?.id);
        currentSession.status = 'connected';
        currentSession.phoneNumber = realPhone || 'Connected';
        currentSession.qrCodeDataUrl = null;
        currentSession.lastConnected = new Date().toISOString();

        await query(`
          UPDATE whatsapp_sessions
          SET status = 'connected', phone_number = $1, qr_data = NULL, last_connected_at = NOW(), updated_at = NOW()
          WHERE id = 'primary'
        `, [currentSession.phoneNumber]).catch(() => {});

        console.log(`[WhatsApp Engine] Real WhatsApp connected & persisted in Neon: ${currentSession.phoneNumber}`);

        if (waitForQr && !settled) {
          settled = true;
          clearTimeout(timeout);
          resolve({
            status: 'connected',
            phoneNumber: currentSession.phoneNumber,
            qrCodeDataUrl: null,
          });
        }
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const loggedOut = statusCode === DisconnectReason.loggedOut;

        if (loggedOut) {
          console.log('[WhatsApp Engine] Logged out from mobile device.');
          await clearNeonAuthState();
          currentSession.status = 'disconnected';
          currentSession.phoneNumber = null;
          currentSession.qrCodeDataUrl = null;
          await query(`
            UPDATE whatsapp_sessions
            SET status = 'disconnected', phone_number = NULL, qr_data = NULL, updated_at = NOW()
            WHERE id = 'primary'
          `).catch(() => {});
        } else {
          // Always auto-reconnect on network drop / Render restart until Disconnect Session is clicked
          const hasCreds = await query("SELECT 1 FROM whatsapp_auth_keys WHERE key_id = 'creds'");
          if (hasCreds.rows.length > 0) {
            console.log('[WhatsApp Engine] Connection interrupted, auto-reconnecting...');
            setTimeout(() => {
              startSocket({ waitForQr: false }).catch((e) =>
                console.error('[WhatsApp Engine] Reconnect error:', e.message)
              );
            }, 3000);
          }
        }
      }
    });

    if (!waitForQr) {
      settled = true;
      resolve(currentSession);
    }
  });
}

// Initialize session state on server startup
export async function loadWhatsAppSession() {
  try {
    const res = await query('SELECT * FROM whatsapp_sessions WHERE id = $1', ['primary']);
    if (res.rows.length > 0) {
      const row = res.rows[0];
      currentSession.antiBanProtection = row.anti_ban_mode ?? true;
      if (row.status === 'connected' && row.phone_number) {
        currentSession.status = 'connected';
        currentSession.phoneNumber = row.phone_number;
        currentSession.lastConnected = row.last_connected_at;
      }
    }

    const credsRes = await query("SELECT 1 FROM whatsapp_auth_keys WHERE key_id = 'creds'");
    if (credsRes.rows.length > 0) {
      console.log('[WhatsApp Engine] Found Neon-persisted WhatsApp credentials, restoring session...');
      await startSocket({ waitForQr: false });
    } else {
      currentSession.status = 'disconnected';
      currentSession.phoneNumber = null;
      currentSession.qrCodeDataUrl = null;
      await query(`
        UPDATE whatsapp_sessions
        SET status = 'disconnected', phone_number = NULL, qr_data = NULL, updated_at = NOW()
        WHERE id = 'primary'
      `).catch(() => {});
      console.log('[WhatsApp Engine] No paired device yet. Waiting for real QR scan.');
    }
  } catch (err) {
    console.error('[WhatsApp Engine] Error loading session:', err.message);
  }
}

// Generate REAL WhatsApp Web pairing QR Code
export async function generateLinkingQR() {
  if (currentSession.status !== 'connected') {
    await clearNeonAuthState();
  }
  return await startSocket({ waitForQr: true });
}

// Confirm device link (returns live status; real pairing happens automatically on QR scan)
export async function confirmWhatsAppLink() {
  return currentSession;
}

// Disconnect / Unlink session (ONLY way to disconnect from CRM)
export async function disconnectWhatsApp() {
  try {
    if (sock) {
      await sock.logout().catch(() => {});
      sock.end(undefined);
      sock = null;
    }
  } catch {}

  await clearNeonAuthState();
  currentSession.status = 'disconnected';
  currentSession.phoneNumber = null;
  currentSession.qrCodeDataUrl = null;

  await query(`
    UPDATE whatsapp_sessions
    SET status = 'disconnected', phone_number = NULL, qr_data = NULL, updated_at = NOW()
    WHERE id = 'primary'
  `);

  console.log('[WhatsApp Engine] Session disconnected.');
  return currentSession;
}

// Get current live status
export function getWhatsAppStatus() {
  return currentSession;
}

// Format Official Admission Bill Message
export function formatAdmissionBillMessage(admission) {
  return `🎓 *LITTLE FLOWERS ACADEMY*
━━━━━━━━━━━━━━━━━━━━━━
📄 *OFFICIAL ADMISSION & FEE RECEIPT*
━━━━━━━━━━━━━━━━━━━━━━
*Receipt No:* ${admission.receipt_no}
*Date:* ${new Date(admission.payment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}

👤 *Student Details:*
• Name: *${admission.student_name}*
• Program: *${admission.program}*

💳 *Payment & Validity:*
• Amount Paid: *₹${Number(admission.amount).toLocaleString('en-IN')}*
• Mode: ${admission.payment_mode || 'UPI'}
• Validity: *${new Date(admission.validity_start).toLocaleDateString('en-IN')}* to *${new Date(admission.validity_end).toLocaleDateString('en-IN')}*

📎 *Your official PDF receipt is attached above.*
📞 Support: +91 94422 66789`;
}

// Format 3-Day Expiry Reminder Message
export function formatExpiryReminderMessage(admission, daysRemaining = 3) {
  return `🔔 *FEES RENEWAL REMINDER*
*Little Flowers Academy*
━━━━━━━━━━━━━━━━━━━━━━
Dear *${admission.parent_name}*,

Warm greetings from Little Flowers Academy! 🌸

This is a gentle reminder that the monthly academy fee validity for your child *${admission.student_name}* (${admission.program}) is due to expire in *${daysRemaining} days* on *${new Date(admission.validity_end).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}*.

📌 *Renewal Details:*
• Student: *${admission.student_name}*
• Course: ${admission.program}
• Monthly Fee: *₹${Number(admission.amount).toLocaleString('en-IN')}*
• Expiry Date: *${new Date(admission.validity_end).toLocaleDateString('en-IN')}*

Kindly complete the renewal on or before the due date to ensure uninterrupted classes.

━━━━━━━━━━━━━━━━━━━━━━
💳 Pay via GPay / PhonePe / Cash at Academy Desk
📞 Queries? Call/WhatsApp: +91 94422 66789`;
}

// Send REAL WhatsApp message (with Professional PDF attachment for bills)
export async function sendWhatsAppMessage({ admissionId, type, phone, message, admission }) {
  if (currentSession.status !== 'connected' || !sock) {
    throw new Error('WhatsApp is not linked. Please scan the QR code in WhatsApp Settings first.');
  }

  // Anti-ban humanized pacing: minimum 2.5s between messages
  const now = Date.now();
  const elapsed = now - lastMessageAt;
  if (elapsed < 2500) {
    await new Promise((r) => setTimeout(r, 2500 - elapsed));
  }

  const jid = toWhatsAppJid(phone);
  console.log(`[WhatsApp Anti-Ban Engine] Sending real ${type} to ${jid}...`);

  if (type === 'bill' && admission) {
    const pdfBuffer = await generateAdmissionPdfBuffer(admission);
    await sock.sendMessage(jid, {
      document: pdfBuffer,
      mimetype: 'application/pdf',
      fileName: `LFA-Receipt-${admission.receipt_no}.pdf`,
      caption: message,
    });
  } else {
    await sock.sendMessage(jid, { text: message });
  }

  lastMessageAt = Date.now();

  // Record dispatch in Neon DB
  const result = await query(`
    INSERT INTO whatsapp_messages (admission_id, type, phone, message, status)
    VALUES ($1, $2, $3, $4, 'sent')
    RETURNING *;
  `, [admissionId || null, type, phone, message]);

  if (admissionId) {
    await query(`
      UPDATE admissions SET whatsapp_sent = true WHERE id = $1
    `, [admissionId]);
  }

  return {
    success: true,
    messageId: result.rows[0].id,
    phone,
    type,
    pdfAttached: Boolean(type === 'bill' && admission),
    dispatchedAt: new Date().toISOString(),
    antiBanVerified: true,
  };
}
