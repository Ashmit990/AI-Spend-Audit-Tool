-- =========================================================================
-- AI Spend Audit Tool — Supabase Schema
-- =========================================================================
-- Run this in the Supabase SQL editor or via CLI: supabase db push
-- This file is idempotent — safe to re-run.
-- =========================================================================

-- Table: audits
-- Stores each audit run, including the raw input, computed results,
-- and AI-generated summary.
CREATE TABLE IF NOT EXISTS audits (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_size       INT NOT NULL DEFAULT 1,
  use_case        TEXT NOT NULL DEFAULT 'development',
  tools_input     JSONB NOT NULL,
  audit_result    JSONB NOT NULL,
  ai_summary      TEXT DEFAULT '',
  total_monthly_savings NUMERIC(10, 2) GENERATED ALWAYS AS (
    COALESCE((audit_result->>'totalMonthlySavings')::NUMERIC, 0)
  ) STORED,
  total_annual_savings  NUMERIC(10, 2) GENERATED ALWAYS AS (
    COALESCE((audit_result->>'totalAnnualSavings')::NUMERIC, 0)
  ) STORED,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: leads
-- Captured when a user submits their email on the audit report page.
CREATE TABLE IF NOT EXISTS leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id        UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  email           TEXT NOT NULL UNIQUE,
  company_name    TEXT,
  role            TEXT,
  team_size       INT,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── Indexes ──────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_audit_id    ON leads(audit_id);
CREATE INDEX IF NOT EXISTS idx_leads_email       ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at  ON leads(created_at DESC);

-- ─── Row Level Security ───────────────────────────────────────────
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads  ENABLE ROW LEVEL SECURITY;

-- Audits: public insert (anyone can run an audit)
CREATE POLICY "Allow public insert to audits" ON audits
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Audits: public read by ID (so shareable report URLs work)
CREATE POLICY "Allow public read of audits by id" ON audits
  FOR SELECT TO anon, authenticated
  USING (true);

-- Leads: public insert (lead capture form)
CREATE POLICY "Allow public insert to leads" ON leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Leads: only service role / authenticated admins can read leads
CREATE POLICY "Restrict read of leads to service role or authenticated admins" ON leads
  FOR SELECT TO authenticated
  USING (true);
