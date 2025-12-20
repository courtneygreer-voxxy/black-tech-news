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

-- Insert default sources
INSERT INTO sources (id, name, url, type, is_active) VALUES
  ('black-enterprise', 'Black Enterprise', 'https://www.blackenterprise.com/category/technology/feed/', 'rss', true),
  ('techcrunch-diversity', 'TechCrunch Diversity', 'https://techcrunch.com/tag/diversity/feed/', 'rss', true),
  ('pocit', 'POCIT', 'https://peopleofcolorintech.com', 'scrape', true)
ON CONFLICT (id) DO NOTHING;
