-- Black Tech News Database Schema
-- Google Cloud SQL (PostgreSQL)

-- Articles table - stores all fetched articles
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  external_id VARCHAR(500) UNIQUE NOT NULL, -- Unique identifier from source
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  url TEXT NOT NULL UNIQUE,
  image_url TEXT,
  author VARCHAR(255),
  published_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Source information
  source_id VARCHAR(100) NOT NULL,
  source_name VARCHAR(255) NOT NULL,

  -- Categorization
  category VARCHAR(50) DEFAULT 'general',
  tags TEXT[], -- PostgreSQL array type

  -- Metadata
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  -- Indexes
  CONSTRAINT articles_url_key UNIQUE (url)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_source_id ON articles(source_id);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_articles_is_active ON articles(is_active);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);

-- Sources table - tracks news sources
CREATE TABLE IF NOT EXISTS sources (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'rss' or 'scrape'
  logo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_fetched_at TIMESTAMP,
  fetch_error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Article views table - track article views (optional for analytics)
CREATE TABLE IF NOT EXISTS article_views (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  referrer TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_article_views_viewed_at ON article_views(viewed_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Hidden articles table - admin-managed article visibility
CREATE TABLE IF NOT EXISTS hidden_articles (
  article_id VARCHAR(500) PRIMARY KEY,
  hidden_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  hidden_by VARCHAR(255) -- Admin email who hid the article
);

CREATE INDEX IF NOT EXISTS idx_hidden_articles_hidden_at ON hidden_articles(hidden_at DESC);

-- Keywords table - admin-managed keyword filters for Wolf Studio
CREATE TABLE IF NOT EXISTS keywords (
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  list_type VARCHAR(20) NOT NULL, -- 'whitelist' or 'blacklist'
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(keyword, list_type)
);

CREATE INDEX IF NOT EXISTS idx_keywords_list_type ON keywords(list_type);
CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON keywords(keyword);

-- Weekly summaries table - stores weekly digest archives
CREATE TABLE IF NOT EXISTS weekly_summaries (
  id SERIAL PRIMARY KEY,
  week_start DATE NOT NULL,           -- Sunday of the week
  week_end DATE NOT NULL,             -- Saturday of the week
  publication_date DATE NOT NULL,     -- Monday (when it's published)
  title VARCHAR(255) NOT NULL,
  theme TEXT,                         -- AI-generated theme/analysis
  article_ids TEXT[],                 -- Array of article external_ids (top 10)
  article_count INTEGER DEFAULT 0,    -- Total articles in that week
  is_published BOOLEAN DEFAULT false, -- Admin controls visibility
  created_by VARCHAR(255),            -- Admin email who created it
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,             -- When admin published it
  UNIQUE(publication_date)
);

CREATE INDEX IF NOT EXISTS idx_weekly_summaries_publication_date ON weekly_summaries(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_is_published ON weekly_summaries(is_published);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_created_at ON weekly_summaries(created_at DESC);

-- Monthly summaries table - stores monthly report archives
CREATE TABLE IF NOT EXISTS monthly_summaries (
  id SERIAL PRIMARY KEY,
  month_start DATE NOT NULL,          -- First day of month
  month_end DATE NOT NULL,            -- Last day of month
  publication_date DATE NOT NULL,     -- First Monday of next month
  title VARCHAR(255) NOT NULL,
  theme TEXT,                         -- AI-generated executive summary
  article_ids TEXT[],                 -- Array of article external_ids (top 10)
  article_count INTEGER DEFAULT 0,    -- Total articles in that month
  is_published BOOLEAN DEFAULT false,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  UNIQUE(publication_date)
);

CREATE INDEX IF NOT EXISTS idx_monthly_summaries_publication_date ON monthly_summaries(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_monthly_summaries_is_published ON monthly_summaries(is_published);
CREATE INDEX IF NOT EXISTS idx_monthly_summaries_created_at ON monthly_summaries(created_at DESC);

-- Triggers for summary tables
CREATE TRIGGER update_weekly_summaries_updated_at BEFORE UPDATE ON weekly_summaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_summaries_updated_at BEFORE UPDATE ON monthly_summaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default sources
INSERT INTO sources (id, name, url, type, is_active) VALUES
  ('black-enterprise', 'Black Enterprise', 'https://www.blackenterprise.com/category/technology/feed/', 'rss', true),
  ('techcrunch-diversity', 'TechCrunch Diversity', 'https://techcrunch.com/tag/diversity/feed/', 'rss', true),
  ('pocit', 'POCIT', 'https://peopleofcolorintech.com', 'scrape', true)
ON CONFLICT (id) DO NOTHING;
