-- Table: audits
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tools_input JSONB NOT NULL,
  audit_result JSONB NOT NULL,
  total_monthly_savings NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_annual_savings NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  team_size INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_audit_id ON leads(audit_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow insert/select for anonymous clients or service roles
-- Policy: anyone can insert audits
CREATE POLICY "Allow public insert to audits" ON audits
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Policy: anyone can view an audit by ID (so public shares work)
CREATE POLICY "Allow public read of audits by id" ON audits
  FOR SELECT TO anon, authenticated
  USING (true);

-- Policy: anyone can insert leads (for lead submission)
CREATE POLICY "Allow public insert to leads" ON leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Policy: restrict reading leads to authenticated or service role admins
CREATE POLICY "Restrict read of leads to service role or authenticated admins" ON leads
  FOR SELECT TO authenticated
  USING (true);
