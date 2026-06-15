/**
 * CLOUDFLARE D1 (SQLITE) SCHEMA FOR EMMACOM DIGITAL AFFILIATE SYS
 * 
 * Cloudflare D1 runs on standard SQLite which has slightly different SQL dialect 
 * than PostgreSQL (e.g. INTEGER PRIMARY KEY AUTOINCREMENT, TEXT, REAL/NUMERIC).
 */

export const CLOUDFLARE_D1_SQL_SCHEMA = `-- ====================================================================
-- EMMACOM DIGITAL AFFILIATE SYS - CLOUDFLARE D1 DATABASE MIGRATE SQL
-- INSTRUCTIONS: Run 'wrangler d1 execute <db-name> --local' or upload to CF Dashboard under D1 console
-- ====================================================================

-- 1. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS users_profile (
  user_id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_admin INTEGER DEFAULT 0, -- 0 for false, 1 for true
  registration_fee_paid INTEGER DEFAULT 0,
  plan TEXT DEFAULT 'free',
  joined_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 2. AFFILIATE PROFILES TABLE
CREATE TABLE IF NOT EXISTS affiliates (
  affiliate_id TEXT PRIMARY KEY, -- e.g. EMM1001
  user_id TEXT REFERENCES users_profile(user_id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  sponsor_id TEXT, -- Sponsoring Affiliate Code
  status TEXT DEFAULT 'active', -- active, expired, suspended
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 3. REFERRALS RELATIONSHIPS TABLE
CREATE TABLE IF NOT EXISTS referrals (
  referral_id TEXT PRIMARY KEY,
  sponsor_id TEXT REFERENCES affiliates(affiliate_id) ON DELETE CASCADE,
  referred_user_id TEXT REFERENCES users_profile(user_id) ON DELETE CASCADE,
  join_date TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 4. DONATIONS / COMPLIANCE RENEWALS TABLE
CREATE TABLE IF NOT EXISTS donations (
  donation_id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users_profile(user_id) ON DELETE CASCADE,
  amount REAL NOT NULL,
  payment_date TEXT DEFAULT CURRENT_TIMESTAMP,
  due_date TEXT NOT NULL,
  status TEXT DEFAULT 'paid', -- paid, overdue
  payment_reference TEXT NOT NULL
);

-- 5. COMMISSIONS LOGS TABLE
CREATE TABLE IF NOT EXISTS commissions (
  commission_id TEXT PRIMARY KEY,
  affiliate_id TEXT REFERENCES affiliates(affiliate_id) ON DELETE CASCADE,
  source_user_id TEXT REFERENCES users_profile(user_id) ON DELETE CASCADE,
  commission_type TEXT NOT NULL, -- registration, recurring
  amount REAL NOT NULL,
  status TEXT DEFAULT 'withdrawable', -- pending, withdrawable, withdrawn
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 6. WITHDRAWALS DISBURSEMENT TABLE
CREATE TABLE IF NOT EXISTS withdrawals (
  withdrawal_id TEXT PRIMARY KEY,
  affiliate_id TEXT REFERENCES affiliates(affiliate_id) ON DELETE CASCADE,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  notes TEXT,
  account_number TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT
);

-- 7. ADMIN CONFIG PARAMETERS TABLE
CREATE TABLE IF NOT EXISTS admin_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  commission_mode TEXT DEFAULT 'percentage',
  registration_rate REAL DEFAULT 20.0,
  recurring_rate REAL DEFAULT 20.0,
  registration_fee REAL DEFAULT 10000.0,
  monthly_donation_amount REAL DEFAULT 5000.0,
  minimum_withdrawal REAL DEFAULT 2000.0,
  flutterwave_bank_name TEXT,
  flutterwave_account_number TEXT,
  flutterwave_account_name TEXT
);

-- INITIAL SEED CONFIGURATION
INSERT OR IGNORE INTO admin_config (id, commission_mode, registration_rate, recurring_rate, registration_fee, monthly_donation_amount, minimum_withdrawal, flutterwave_bank_name, flutterwave_account_number, flutterwave_account_name)
VALUES (1, 'percentage', 20.0, 20.0, 10000.0, 5000.0, 2000.0, 'Wema Bank (FW)', '0048127392', 'Emmacom Digital Hub / Flutterwave');
`;

export const CLOUDFLARE_BINDING_GUIDE = `### HOW TO SECURELY BIND CLOUDFLARE PAGES & D1

Configure Wrangler properties to integrate the serverless pipeline automatically.

#### 1. Create a D1 Database Instance via Wrangler CLI
\`\`\`bash
npx wrangler d1 create emmacom-affiliate-db
\`\`\`

#### 2. Bind in your \`wrangler.toml\` or Pages console:
\`\`\`toml
[[d1_databases]]
binding = "DB"
database_name = "emmacom-affiliate-db"
database_id = "your-database-id-string"
\`\`\`

#### 3. Push SQL migrations directly to D1:
\`\`\`bash
npx wrangler d1 execute emmacom-affiliate-db --file=./d1-migration.sql
\`\`\`
`;

export function simulateCloudflareD1Query(sqlStatement: string, localData: any): { success: boolean; rows?: any[]; error?: string; affectedRows?: number } {
  const normalizedSql = sqlStatement.trim().toLowerCase();
  
  if (normalizedSql.startsWith("select * from users_profile") || normalizedSql.startsWith("select * from users")) {
    return { success: true, rows: localData.users };
  }
  if (normalizedSql.startsWith("select * from affiliates")) {
    return { success: true, rows: localData.affiliates };
  }
  if (normalizedSql.startsWith("select * from commissions")) {
    return { success: true, rows: localData.commissions };
  }
  if (normalizedSql.startsWith("select * from withdrawals")) {
    return { success: true, rows: localData.withdrawals };
  }
  if (normalizedSql.startsWith("select * from admin_config")) {
    return { success: true, rows: [localData.config] };
  }
  
  // Custom execution sandbox simulator response
  return { 
    success: true, 
    affectedRows: 1, 
    rows: [{ message: "SQL executed successfully inside Simulated Cloudflare D1 Sandbox!" }] 
  };
}
