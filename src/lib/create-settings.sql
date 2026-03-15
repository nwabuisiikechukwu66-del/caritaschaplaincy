-- Chaplaincy Settings Table
CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Seed defaults
INSERT INTO app_settings (key, value) VALUES
  ('bank_details', '{
    "bank_name": "...",
    "account_number": "...",
    "account_name": "Caritas Catholic Chaplaincy"
  }'),
  ('chaplaincy_info', '{
    "name": "Caritas Catholic Chaplaincy",
    "founded_by": "Very Rev. Fr. Prof. Emmanuel Matthew Paul Edeh",
    "chaplain": "Rev. Fr. Davison Odoviro",
    "address": "Caritas University, Amorji-Nike, Enugu State, Nigeria",
    "motto": "Jesus is the Saviour of every human person"
  }'),
  ('mass_schedule', '[
    {"title": "Lauds", "time": "5:30 AM", "venue": "School Podium", "days": "Daily"},
    {"title": "Morning Mass", "time": "6:00 AM", "venue": "School Podium", "days": "Daily"},
    {"title": "Sunday Mass", "time": "8:00 AM", "venue": "School Auditorium", "days": "Sundays"},
    {"title": "Afternoon Mass", "time": "3:00 PM", "venue": "Fathers Chapel", "days": "Daily"},
    {"title": "Rosary & Vespers", "time": "6:00 PM", "venue": "School Podium", "days": "Daily"}
  ]')
ON CONFLICT (key) DO NOTHING;
