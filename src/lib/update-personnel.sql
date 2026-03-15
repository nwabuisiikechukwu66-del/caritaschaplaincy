-- Add contact column to sacristans and catechists
ALTER TABLE sacristans ADD COLUMN IF NOT EXISTS contact text;
ALTER TABLE catechists ADD COLUMN IF NOT EXISTS contact text;

-- Add description, bio, contact to university_authorities just in case
ALTER TABLE university_authorities ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE university_authorities ADD COLUMN IF NOT EXISTS contact text;

-- Ensure university authorities are populated
INSERT INTO university_authorities (name, role, order_rank)
VALUES 
  ('Sister Administrator', 'Sister Administrator', 1),
  ('Vice Chancellor', 'Vice Chancellor', 2),
  ('Registrar', 'Registrar', 3),
  ('Bursar', 'Bursar', 4)
ON CONFLICT (name) DO UPDATE SET 
  role = EXCLUDED.role,
  order_rank = EXCLUDED.order_rank;
