CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  picture TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS user_history (
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  item_id TEXT NOT NULL,
  data TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, kind, item_id)
);

CREATE INDEX IF NOT EXISTS idx_user_history_updated
  ON user_history (user_id, kind, updated_at DESC);

CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  video_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  original_url TEXT NOT NULL,
  added_by TEXT,
  channel_id TEXT,
  created_at INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'youtube_link'
);

CREATE INDEX IF NOT EXISTS idx_videos_created_at
  ON videos (created_at DESC);

CREATE TABLE IF NOT EXISTS video_stats (
  video_id TEXT PRIMARY KEY,
  creator_id TEXT,
  channel_id TEXT,
  alphatekx_likes INTEGER DEFAULT 0,
  alphatekx_comments INTEGER DEFAULT 0,
  alphatekx_views INTEGER DEFAULT 0,
  total_watch_seconds INTEGER DEFAULT 0,
  avg_watch_percent INTEGER DEFAULT 0,
  score REAL DEFAULT 5,
  is_pro_creator INTEGER DEFAULT 0,
  created_at INTEGER,
  updated_at INTEGER
);
CREATE TABLE IF NOT EXISTS video_impressions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  video_id TEXT,
  shown_at INTEGER
);
CREATE TABLE IF NOT EXISTS video_views_log (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  video_id TEXT,
  watch_percent INTEGER,
  viewed_at INTEGER
);
CREATE TABLE IF NOT EXISTS video_views (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  video_id TEXT,
  watch_percent INTEGER,
  viewed_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_video_stats_score ON video_stats(score DESC);
CREATE INDEX IF NOT EXISTS idx_video_stats_created ON video_stats(created_at DESC);

CREATE TABLE IF NOT EXISTS community_messages (
  id TEXT PRIMARY KEY,
  video_id TEXT NOT NULL,
  channel TEXT NOT NULL,
  user_id TEXT,
  user_name TEXT NOT NULL,
  avatar_initials TEXT,
  message TEXT NOT NULL,
  timestamp_in_video TEXT,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_community_messages_channel ON community_messages (channel, created_at DESC);

CREATE TABLE IF NOT EXISTS video_likes (
  user_id TEXT NOT NULL,
  video_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS watch_later (
  user_id TEXT NOT NULL,
  video_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, video_id)
);
CREATE INDEX IF NOT EXISTS idx_watch_later_user ON watch_later (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS channel_subscriptions (
  user_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, channel_id)
);

CREATE TABLE IF NOT EXISTS marketplace_products (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS marketplace_sales (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_usage (
  user_id TEXT NOT NULL,
  feature TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  last_used INTEGER,
  window_start INTEGER,
  used_in_window INTEGER NOT NULL DEFAULT 0,
  weekly_used INTEGER NOT NULL DEFAULT 0,
  week_start INTEGER,
  plan TEXT DEFAULT 'free',
  PRIMARY KEY (user_id, feature)
);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_window ON ai_usage (user_id, feature, window_start, week_start);

CREATE TABLE IF NOT EXISTS market_usage (
  user_id TEXT PRIMARY KEY,
  product_count INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS subscriptions (
  user_id TEXT PRIMARY KEY,
  plan TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',
  expires_at INTEGER,
  current_period_start INTEGER,
  current_period_end INTEGER,
  paystack_ref TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS user_api_keys (
  user_id TEXT PRIMARY KEY,
  openai_key TEXT,
  gemini_key TEXT,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS ads_campaigns (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  destination_url TEXT NOT NULL,
  company_name TEXT,
  duration_seconds INTEGER NOT NULL,
  days INTEGER NOT NULL,
  daily_budget_ngn INTEGER NOT NULL DEFAULT 3000,
  total_amount_kobo INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  paystack_reference TEXT UNIQUE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  start_at INTEGER,
  end_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_ads_campaigns_user_created
  ON ads_campaigns (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ads_campaigns_status
  ON ads_campaigns (status, start_at, end_at);

CREATE TABLE IF NOT EXISTS ads_queue (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL UNIQUE,
  scheduled_at INTEGER NOT NULL,
  started_at INTEGER,
  ended_at INTEGER,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at INTEGER NOT NULL,
  FOREIGN KEY (campaign_id) REFERENCES ads_campaigns(id)
);

CREATE INDEX IF NOT EXISTS idx_ads_queue_status_schedule
  ON ads_queue (status, scheduled_at, ended_at);
