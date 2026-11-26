import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

let pool = null;

export async function getDbPool() {
  if (pool) return pool;

  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    throw new Error('DATABASE_URL is not defined in environment');
  }

  try {
    const url = new URL(rawUrl);
    const hostname = url.hostname;
    const ips = await dns.resolve4(hostname);
    const resolvedIp = ips && ips.length > 0 ? ips[0] : hostname;

    pool = new Pool({
      host: resolvedIp,
      port: parseInt(url.port || '5432', 10),
      database: url.pathname.replace('/', '') || 'neondb',
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      ssl: {
        servername: hostname,
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
    });

    console.log(`[Neon DB] Connected to ${hostname} (${resolvedIp})`);
    return pool;
  } catch (err) {
    console.error('[Neon DB] Pool initialization failed:', err);
    throw err;
  }
}

export async function query(text, params) {
  const p = await getDbPool();
  return p.query(text, params);
}

export async function initSchema() {
  const p = await getDbPool();
  console.log('[Neon DB] Initializing tables if not exist...');

  await p.query(`
    CREATE TABLE IF NOT EXISTS admissions (
      id SERIAL PRIMARY KEY,
      receipt_no VARCHAR(50) UNIQUE NOT NULL,
      student_name VARCHAR(150) NOT NULL,
      student_dob VARCHAR(50),
      student_age VARCHAR(20),
      program VARCHAR(100) NOT NULL,
      parent_name VARCHAR(150) NOT NULL,
      parent_phone VARCHAR(30) NOT NULL,
      parent_email VARCHAR(150),
      address TEXT,
      amount NUMERIC(10, 2) NOT NULL,
      payment_mode VARCHAR(50) DEFAULT 'UPI',
      payment_date DATE NOT NULL,
      validity_start DATE NOT NULL,
      validity_end DATE NOT NULL,
      status VARCHAR(30) DEFAULT 'active',
      whatsapp_sent BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS whatsapp_sessions (
      id VARCHAR(50) PRIMARY KEY DEFAULT 'primary',
      status VARCHAR(50) DEFAULT 'disconnected',
      phone_number VARCHAR(50),
      qr_data TEXT,
      anti_ban_mode BOOLEAN DEFAULT true,
      last_connected_at TIMESTAMP WITH TIME ZONE,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS whatsapp_messages (
      id SERIAL PRIMARY KEY,
      admission_id INT REFERENCES admissions(id) ON DELETE SET NULL,
      type VARCHAR(50) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(30) DEFAULT 'sent',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS whatsapp_auth_keys (
      key_id TEXT PRIMARY KEY,
      key_data TEXT NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Safe non-breaking schema expansions for commercial CRM fields
    ALTER TABLE admissions ADD COLUMN IF NOT EXISTS admission_fee NUMERIC(10, 2) DEFAULT 0;
    ALTER TABLE admissions ADD COLUMN IF NOT EXISTS monthly_fee NUMERIC(10, 2) DEFAULT 0;
    ALTER TABLE admissions ADD COLUMN IF NOT EXISTS discount NUMERIC(10, 2) DEFAULT 0;
    ALTER TABLE admissions ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2) DEFAULT 0;
    ALTER TABLE admissions ADD COLUMN IF NOT EXISTS learning_mode VARCHAR(50) DEFAULT 'In-Person';
    ALTER TABLE admissions ADD COLUMN IF NOT EXISTS course_duration VARCHAR(50) DEFAULT '1 Month';
    ALTER TABLE admissions ADD COLUMN IF NOT EXISTS course_start_date DATE;

    CREATE TABLE IF NOT EXISTS crm_settings (
      id VARCHAR(50) PRIMARY KEY DEFAULT 'primary',
      academy_name VARCHAR(150) DEFAULT 'Little Flowers Academy',
      tagline VARCHAR(200) DEFAULT 'Joyful, World-Class Early Learning & Academic Excellence',
      contact_phone VARCHAR(50) DEFAULT '+91 94422 66789',
      contact_email VARCHAR(100) DEFAULT 'info@littleflowersacademy.edu',
      address TEXT DEFAULT '12/4 Academy Road, Anna Nagar, Chennai - 600040',
      currency_symbol VARCHAR(10) DEFAULT '₹',
      invoice_prefix VARCHAR(20) DEFAULT 'LFA',
      whatsapp_provider VARCHAR(50) DEFAULT 'Official WhatsApp Business Cloud API',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO crm_settings (id) VALUES ('primary') ON CONFLICT (id) DO NOTHING;
  `);

  // Ensure default primary session row exists
  await p.query(`
    INSERT INTO whatsapp_sessions (id, status, anti_ban_mode)
    VALUES ('primary', 'disconnected', true)
    ON CONFLICT (id) DO NOTHING;
  `);

  console.log('✅ [Neon DB] Database schema verified and ready!');
}
