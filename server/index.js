import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { initSchema, query } from './db.js';
import {
  loadWhatsAppSession,
  generateLinkingQR,
  confirmWhatsAppLink,
  disconnectWhatsApp,
  getWhatsAppStatus,
  formatAdmissionBillMessage,
  formatExpiryReminderMessage,
  sendWhatsAppMessage,
} from './whatsapp.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── HEALTH CHECK ──
app.get('/api/health', async (req, res) => {
  try {
    const dbTest = await query('SELECT NOW() as now, 1 as ok');
    res.json({
      status: 'ok',
      neon_db: 'connected',
      timestamp: dbTest.rows[0].now,
      whatsapp: getWhatsAppStatus().status,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// ── ADMIN AUTHENTICATION ──
app.post('/api/admin/login', (req, res) => {
  const { adminId, password } = req.body;
  const expectedId = process.env.ADMIN_ID || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'lfa@admin2026';

  if (adminId === expectedId && password === expectedPassword) {
    return res.json({
      success: true,
      token: 'lfa_admin_session_' + Date.now(),
      admin: { id: adminId, role: 'Super Admin' },
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid Admin ID or Password. Please try again.',
  });
});

// ── WHATSAPP AUTOMATION LINKING ──
app.get('/api/whatsapp/status', (req, res) => {
  res.json(getWhatsAppStatus());
});

app.post('/api/whatsapp/qr', async (req, res) => {
  try {
    const data = await generateLinkingQR();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/whatsapp/confirm', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const session = await confirmWhatsAppLink(phoneNumber || '+91 94422 66789');
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/whatsapp/disconnect', async (req, res) => {
  try {
    const session = await disconnectWhatsApp();
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMISSION & BILLING ──
app.get('/api/admissions', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id, receipt_no, student_name, student_dob, student_age,
        program, parent_name, parent_phone, parent_email, address,
        amount, payment_mode, payment_date, validity_start, validity_end,
        status, whatsapp_sent, created_at,
        CASE 
          WHEN validity_end < CURRENT_DATE THEN 'expired'
          WHEN validity_end <= CURRENT_DATE + INTERVAL '3 days' THEN 'expiring_soon'
          ELSE 'active'
        END as current_validity_status,
        (validity_end - CURRENT_DATE) as days_remaining
      FROM admissions
      ORDER BY created_at DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admissions', async (req, res) => {
  try {
    // 1. WhatsApp link enforcement rule
    const waStatus = getWhatsAppStatus();
    if (waStatus.status !== 'connected') {
      return res.status(400).json({
        error: 'WhatsApp is not linked. Please connect WhatsApp in the Linking tab first to enable automated bill dispatch.',
      });
    }

    const {
      studentName,
      studentDob,
      studentAge,
      program,
      parentName,
      parentPhone,
      parentEmail,
      address,
      amount,
      paymentMode,
      paymentDate,
      validityDays = 30,
    } = req.body;

    if (!studentName || !parentName || !parentPhone || !amount || !program) {
      return res.status(400).json({ error: 'Please fill all required admission details.' });
    }

    // Auto-calculate receipt number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const receiptNo = `LFA-${dateStr}-${randSuffix}`;

    // Auto-calculate validity start & end
    const startDate = paymentDate ? new Date(paymentDate) : new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + parseInt(validityDays, 10));

    // Save text metadata only to Neon PostgreSQL (no images stored in DB)
    const insertResult = await query(`
      INSERT INTO admissions (
        receipt_no, student_name, student_dob, student_age,
        program, parent_name, parent_phone, parent_email, address,
        amount, payment_mode, payment_date, validity_start, validity_end,
        status, whatsapp_sent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'active', false)
      RETURNING *;
    `, [
      receiptNo,
      studentName,
      studentDob || null,
      studentAge || null,
      program,
      parentName,
      parentPhone,
      parentEmail || null,
      address || null,
      amount,
      paymentMode || 'UPI',
      startDate.toISOString().slice(0, 10),
      startDate.toISOString().slice(0, 10),
      endDate.toISOString().slice(0, 10),
    ]);

    const createdAdmission = insertResult.rows[0];

    // 2. Automatically dispatch admission bill to parent's WhatsApp
    const billMessage = formatAdmissionBillMessage(createdAdmission);
    const waDispatch = await sendWhatsAppMessage({
      admissionId: createdAdmission.id,
      type: 'bill',
      phone: parentPhone,
      message: billMessage,
    });

    res.json({
      success: true,
      admission: createdAdmission,
      whatsappDispatch: waDispatch,
      billMessage,
    });
  } catch (err) {
    console.error('Error creating admission:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── 3-DAY EXPIRY REMINDERS ──
app.get('/api/reminders/due', async (req, res) => {
  try {
    // Records expiring within 3 days or already expired
    const result = await query(`
      SELECT 
        id, receipt_no, student_name, program, parent_name, parent_phone,
        amount, validity_start, validity_end,
        (validity_end - CURRENT_DATE) as days_remaining
      FROM admissions
      WHERE validity_end <= CURRENT_DATE + INTERVAL '3 days'
        AND validity_end >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY validity_end ASC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reminders/send', async (req, res) => {
  try {
    const waStatus = getWhatsAppStatus();
    if (waStatus.status !== 'connected') {
      return res.status(400).json({
        error: 'WhatsApp is not linked. Cannot send reminder.',
      });
    }

    const { admissionId } = req.body;
    const admissionRes = await query('SELECT * FROM admissions WHERE id = $1', [admissionId]);
    if (admissionRes.rows.length === 0) {
      return res.status(404).json({ error: 'Admission not found.' });
    }

    const admission = admissionRes.rows[0];
    const today = new Date();
    const expiry = new Date(admission.validity_end);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    const reminderMessage = formatExpiryReminderMessage(admission, Math.max(0, diffDays));
    const waDispatch = await sendWhatsAppMessage({
      admissionId: admission.id,
      type: 'reminder',
      phone: admission.parent_phone,
      message: reminderMessage,
    });

    res.json({
      success: true,
      message: 'Reminder sent to parent WhatsApp successfully!',
      dispatch: waDispatch,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── UPDATE STUDENT RECORD ──
app.put('/api/admissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      studentName,
      program,
      parentName,
      parentPhone,
      parentEmail,
      address,
      amount,
      status,
      validityEnd,
    } = req.body;

    const result = await query(`
      UPDATE admissions
      SET 
        student_name = COALESCE($1, student_name),
        program = COALESCE($2, program),
        parent_name = COALESCE($3, parent_name),
        parent_phone = COALESCE($4, parent_phone),
        parent_email = COALESCE($5, parent_email),
        address = COALESCE($6, address),
        amount = COALESCE($7, amount),
        status = COALESCE($8, status),
        validity_end = COALESCE($9, validity_end)
      WHERE id = $10
      RETURNING *;
    `, [
      studentName,
      program,
      parentName,
      parentPhone,
      parentEmail,
      address,
      amount,
      status,
      validityEnd,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student record not found.' });
    }

    res.json({ success: true, updated: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE STUDENT RECORD ──
app.delete('/api/admissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM admissions WHERE id = $1 RETURNING id, receipt_no, student_name', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student record not found.' });
    }
    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── REPORTS & ANALYTICS ──
app.get('/api/reports/analytics', async (req, res) => {
  try {
    const totalStudents = await query('SELECT count(*) as count FROM admissions');
    const totalRevenue = await query('SELECT COALESCE(SUM(amount), 0) as total FROM admissions');
    const activeStudents = await query(`
      SELECT count(*) as count FROM admissions WHERE validity_end >= CURRENT_DATE
    `);
    const expiredStudents = await query(`
      SELECT count(*) as count FROM admissions WHERE validity_end < CURRENT_DATE
    `);
    const expiringSoon = await query(`
      SELECT count(*) as count FROM admissions 
      WHERE validity_end >= CURRENT_DATE AND validity_end <= CURRENT_DATE + INTERVAL '3 days'
    `);
    const courseDistribution = await query(`
      SELECT program, count(*) as count, SUM(amount) as revenue
      FROM admissions
      GROUP BY program
      ORDER BY count DESC
    `);
    const monthlyTrends = await query(`
      SELECT 
        TO_CHAR(payment_date, 'Mon YYYY') as month,
        count(*) as admissions_count,
        SUM(amount) as revenue
      FROM admissions
      GROUP BY TO_CHAR(payment_date, 'Mon YYYY')
      ORDER BY MIN(payment_date) ASC
    `);

    res.json({
      totalStudents: parseInt(totalStudents.rows[0].count, 10),
      totalRevenue: parseFloat(totalRevenue.rows[0].total),
      activeStudents: parseInt(activeStudents.rows[0].count, 10),
      expiredStudents: parseInt(expiredStudents.rows[0].count, 10),
      expiringSoon: parseInt(expiringSoon.rows[0].count, 10),
      courseDistribution: courseDistribution.rows,
      monthlyTrends: monthlyTrends.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── WHATSAPP MESSAGE LOGS ──
app.get('/api/whatsapp/logs', async (req, res) => {
  try {
    const logs = await query(`
      SELECT wm.*, a.student_name, a.receipt_no
      FROM whatsapp_messages wm
      LEFT JOIN admissions a ON wm.admission_id = a.id
      ORDER BY wm.created_at DESC
      LIMIT 50;
    `);
    res.json(logs.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── TEST WHATSAPP MESSAGE ──
app.post('/api/whatsapp/test', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }
    const testMsg = `🌸 *Little Flowers Academy - Test Notification*\n\nThis is a verified test message from your Little Flowers Academy CRM system.\nTimestamp: ${new Date().toLocaleString('en-IN')}`;
    const dispatch = await sendWhatsAppMessage({
      type: 'test',
      phone,
      message: testMsg,
    });
    res.json({ success: true, dispatch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CRM SETTINGS ──
app.get('/api/settings', async (req, res) => {
  try {
    const result = await query('SELECT * FROM crm_settings WHERE id = $1', ['primary']);
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const {
      academyName,
      tagline,
      contactPhone,
      contactEmail,
      address,
      currencySymbol,
      invoicePrefix,
      whatsappProvider,
    } = req.body;

    const result = await query(`
      UPDATE crm_settings
      SET 
        academy_name = COALESCE($1, academy_name),
        tagline = COALESCE($2, tagline),
        contact_phone = COALESCE($3, contact_phone),
        contact_email = COALESCE($4, contact_email),
        address = COALESCE($5, address),
        currency_symbol = COALESCE($6, currency_symbol),
        invoice_prefix = COALESCE($7, invoice_prefix),
        whatsapp_provider = COALESCE($8, whatsapp_provider),
        updated_at = NOW()
      WHERE id = 'primary'
      RETURNING *;
    `, [
      academyName,
      tagline,
      contactPhone,
      contactEmail,
      address,
      currencySymbol,
      invoicePrefix,
      whatsappProvider,
    ]);

    res.json({ success: true, settings: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve built Vite frontend in production (Render)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server and initialize Neon schema
async function start() {
  try {
    await initSchema();
    await loadWhatsAppSession();

    app.listen(port, () => {
      console.log(`🚀 [Neon Backend Server] Running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
