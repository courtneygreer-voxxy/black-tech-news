-- Quick setup script to create just the email_subscribers table
-- Run this if you want to test email signups before running the full schema.sql

-- Email subscribers table - stores newsletter signups
CREATE TABLE IF NOT EXISTS email_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',    -- 'active', 'unsubscribed', 'bounced'
  source VARCHAR(50) DEFAULT 'website',   -- Where they signed up (website, api, etc)
  referrer_url TEXT,                      -- Page they signed up from
  ip_address INET,                        -- IP for spam prevention
  user_agent TEXT,                        -- Browser info
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  last_email_sent_at TIMESTAMP,           -- Track when we last emailed them
  email_count INTEGER DEFAULT 0,          -- How many emails we've sent

  -- Future user account fields (not used yet, but ready)
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  user_id INTEGER,                        -- Will link to users table when we add it
  preferences JSONB,                      -- Email frequency, topics, etc.

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_created_at ON email_subscribers(created_at DESC);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_subscribers_updated_at
  BEFORE UPDATE ON email_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
