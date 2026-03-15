-- Run this in your Supabase SQL editor

-- Users table (admin auth only, simple approach)
create table if not exists admin_sessions (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  expires_at timestamp not null,
  created_at timestamp default now()
);

-- Announcements
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author text default 'Chaplaincy Admin',
  is_approved boolean default false,
  submitted_by text,
  image_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Events
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  event_time text,
  location text,
  image_url text,
  is_approved boolean default false,
  submitted_by text,
  created_at timestamp default now()
);

-- Mass Intentions
create table if not exists mass_intentions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_anonymous boolean default false,
  intention text not null,
  intention_date date not null,
  type text default 'intention', -- 'intention' or 'thanksgiving'
  amount integer not null,
  payment_status text default 'pending', -- 'pending','paid','verified'
  payment_reference text,
  is_approved boolean default false,
  is_called boolean default false,
  created_at timestamp default now()
);

-- Petitions
create table if not exists petitions (
  id uuid primary key default gen_random_uuid(),
  name text,
  is_anonymous boolean default false,
  petition text not null,
  is_approved boolean default false,
  is_printed boolean default false,
  created_at timestamp default now()
);

-- Donations
create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  donor_name text not null,
  email text,
  item_id text,
  item_name text,
  amount integer not null,
  payment_status text default 'pending',
  payment_reference text,
  is_charity boolean default false,
  message text,
  created_at timestamp default now()
);

-- Donation items (things the chaplaincy needs)
create table if not exists donation_items (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  target_amount integer,
  raised_amount integer default 0,
  image_url text,
  category text default 'liturgical',
  is_active boolean default true,
  bible_verse text,
  created_at timestamp default now()
);

-- Church Hierarchy
create table if not exists hierarchy (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  role text not null,
  description text,
  image_url text,
  order_rank integer not null,
  is_active boolean default true
);

-- University Sisters/Authorities
create table if not exists university_authorities (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  role text not null,
  description text,
  image_url text,
  order_rank integer default 0
);

-- Council Executives (current & archived)
create table if not exists council_executives (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  photo_url text,
  bio text,
  contact text,
  academic_year text not null,
  is_current boolean default false,
  unique(name, position, academic_year)
);

-- Sacristans
create table if not exists sacristans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  photo_url text,
  bio text,
  academic_year text,
  is_current boolean default false,
  unique(name, role, academic_year)
);

-- Catechists
create table if not exists catechists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  photo_url text,
  bio text,
  academic_year text,
  is_current boolean default false,
  unique(name, role, academic_year)
);

-- Societies & Associations
create table if not exists societies (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  type text not null, -- 'association' or 'society'
  short_description text,
  history text,
  about text,
  why_join text,
  fun_facts text,
  meeting_time text,
  patron_saint text,
  image_url text,
  banner_url text,
  color_code text,
  order_rank integer default 0
);

-- Society Leaders (current & archived)
create table if not exists society_leaders (
  id uuid primary key default gen_random_uuid(),
  society_id uuid references societies(id),
  name text not null,
  role text not null,
  photo_url text,
  bio text,
  contact text,
  academic_year text,
  is_current boolean default false
);

-- Catholic Doctrine (stored as JSONB for speed)
create table if not exists doctrines (
  id serial primary key,
  category text not null,
  question text not null,
  answer text not null,
  source text,
  tags text[],
  search_vector tsvector generated always as (to_tsvector('english', question || ' ' || answer)) stored
);

create index if not exists doctrines_search_idx on doctrines using gin(search_vector);

-- Seed default donation items
insert into donation_items (name, description, target_amount, category, bible_verse) values
  ('Altar Candles (Monthly Supply)', 'Keep the sanctuary illuminated for worship', 15000, 'liturgical', 'Your word is a lamp to my feet — Psalm 119:105'),
  ('Missals & Hymnals', 'Provide prayer books for the congregation', 50000, 'liturgical', 'Let the word of Christ dwell in you richly — Col 3:16'),
  ('Priest Vestments', 'Sacred garments for liturgical celebrations', 120000, 'liturgical', 'Clothe yourselves with love — Col 3:14'),
  ('Sound System Maintenance', 'Ensure clear proclamation of the Word', 80000, 'infrastructure', 'Cry aloud, spare not, lift up your voice — Is 58:1'),
  ('Charity Outreach Fund', 'Support the poor and vulnerable in our community', 200000, 'charity', 'Whoever is kind to the poor lends to the LORD — Prov 19:17'),
  ('Chapel Renovation', 'Restore and beautify our place of worship', 500000, 'infrastructure', 'How lovely is your dwelling place, O LORD — Psalm 84:1'),
  ('Student Welfare Fund', 'Support indigent Catholic students', 100000, 'charity', 'Whatever you did for the least of these — Matt 25:40')
ON CONFLICT (name) DO NOTHING;

-- Seed Church Hierarchy
insert into hierarchy (name, role, description, image_url, order_rank) values
  ('Jesus Christ', 'Head of the Church', 'The King of Kings, Lord of Lords, the eternal High Priest and founder of the Holy Catholic Church through His apostles.', '/images/jesus christ.png', 1),
  ('Saint Peter', 'First Pope & Prince of Apostles', 'Chosen by Christ as the rock upon which the Church is built. The first Bishop of Rome and supreme authority of the early Church.', '/images/saint peter.png', 2),
  ('Pope Leo XIV', 'Supreme Pontiff, Bishop of Rome', 'The 267th Pope of the Catholic Church and Vicar of Christ on Earth, leading the universal Church with spiritual authority.', '/images/pope leo xiv.png', 3),
  ('Archbishop Michael Crotty', 'Apostolic Nuncio to Nigeria', 'The official diplomatic representative of the Holy See to Nigeria, bridging the Vatican and the Nigerian Catholic Church.', '/images/micheal crotty.png', 4),
  ('Archbishop Valerian Okeke', 'Metropolitan Archbishop of Onitsha', 'Head of the Metropolitan Province of Onitsha, which encompasses the Diocese of Enugu and surrounding dioceses.', '/images/valerian okeke.png', 5),
  ('Bishop Callistus Onaga', 'Bishop of Enugu Diocese', 'The diocesan Bishop of Enugu, under whose pastoral care Caritas University Chaplaincy operates.', '/images/callistus onaga.png', 6),
  ('Bishop Ernest Obodo', 'Auxiliary Bishop of Enugu', 'The Auxiliary Bishop of the Diocese of Enugu, assisting in the pastoral governance of the diocese.', '/images/ernest obodo.png', 7),
  ('Very Rev. Fr. Prof. Emmanuel Matthew Paul Edeh', 'Founder - Jesus the Saviour Congregation', 'Nigerian Catholic priest, philosopher, theologian, and founder of Caritas University, Madonna University, OSISATECH Polytechnic, and the Jesus the Saviour Congregation. His spirituality centers on Jesus the Saviour as the foundation of all human dignity.', '/images/fr_edeh.png', 8),
  ('Rev. Fr. Davison Odoviro', 'Chaplain, Caritas University', 'The current chaplain of Caritas Catholic Chaplaincy, responsible for the spiritual welfare of students, staff, and the entire university community.', '/images/davison odoviro.png', 9)
ON CONFLICT (name) DO NOTHING;

-- Seed University Authorities  
insert into university_authorities (name, role, order_rank) values
  ('Sr. Jane Okoh', 'Sister Administrator, Caritas University', 1),
  ('Vice Chancellor', 'Vice Chancellor, Caritas University', 2),
  ('Registrar', 'Registrar, Caritas University', 3),
  ('Librarian', 'University Librarian', 4)
ON CONFLICT (name) DO NOTHING;

-- Seed Current Council
insert into council_executives (name, position, academic_year, is_current) values
  ('President', 'President', '2024/2025', true),
  ('Vice President', 'Vice President', '2024/2025', true),
  ('General Secretary', 'General Secretary', '2024/2025', true),
  ('Assistant Secretary', 'Assistant Secretary', '2024/2025', true),
  ('Financial Secretary', 'Financial Secretary', '2024/2025', true),
  ('Treasurer', 'Treasurer', '2024/2025', true),
  ('Provost I', 'Provost I', '2024/2025', true),
  ('Provost II', 'Provost II', '2024/2025', true),
  ('PRO', 'Public Relations Officer', '2024/2025', true)
ON CONFLICT (name, position, academic_year) DO NOTHING;

-- Seed Current Sacristans  
insert into sacristans (name, role, academic_year, is_current) values
  ('Frank Kelechi Oge', 'Chief Sacristan', '2024/2025', true),
  ('Ikechukwu Emmanuel Nwabuisi', 'Assistant Sacristan', '2024/2025', true)
ON CONFLICT (name, role, academic_year) DO NOTHING;

-- Seed Current Catechists
insert into catechists (name, role, academic_year, is_current) values
  ('John Ugwoke', 'Chief Catechist', '2024/2025', true),
  ('Kelvin Umeh', 'Assistant Catechist', '2024/2025', true),
  ('Gilbert Ekpangabang', 'Assistant Catechist', '2024/2025', true)
ON CONFLICT (name, role, academic_year) DO NOTHING;

-- Seed Societies
insert into societies (name, type, short_description, order_rank, color_code) values
  ('Altar Knights', 'association', 'Serving the altar with devotion and discipline in the sacred liturgy.', 1, '#8B0000'),
  ('Altar Decorators', 'association', 'Beautifying the sanctuary with flowers and sacred arrangements for liturgical celebrations.', 2, '#C8102E'),
  ('Caritas Central Choir', 'association', 'Lifting hearts to God through sacred music and liturgical chant.', 3, '#D4AF37'),
  ('Church Wardens', 'association', 'Maintaining order, reverence and hospitality within the sacred space.', 4, '#600000'),
  ('Board of Lectors', 'association', 'Proclaiming the living Word of God during the liturgy with clarity and faith.', 5, '#8B0000'),
  ('Mary Queen of All Hearts', 'society', 'Devoted to Our Lady under the title given by Saint Louis de Montfort, consecrating hearts to Jesus through Mary.', 6, '#FFFFFF'),
  ('Jesus the Saviour Society', 'society', 'Living the charism of Fr. Edeh by proclaiming Jesus as the Saviour of all humanity.', 7, '#C8102E'),
  ('Saint Anthony of Padua Society', 'society', 'Under the patronage of the Hammer of Heretics, devoted to prayer, charity and evangelization.', 8, '#8B0000'),
  ('Mother of Perpetual Help Society', 'society', 'Entrusted to our Lady of Perpetual Help, seeking her intercession in every need.', 9, '#D4AF37'),
  ('Sacred Hearts Society', 'society', 'Devoted to the Sacred Heart of Jesus and the Immaculate Heart of Mary as one act of love.', 10, '#C8102E'),
  ('Confraternity of the Most Holy Rosary (Rosarian Family)', 'society', 'Praying the Rosary as a weapon of spiritual warfare and a school of contemplation.', 11, '#FFFFFF'),
  ('Legion of Mary', 'society', 'The largest apostolic organization in the Church, serving Mary in the active apostolate.', 12, '#8B0000'),
  ('Infant Jesus Society', 'society', 'Venerating the Child Jesus with childlike faith, trust and simplicity of heart.', 13, '#D4AF37'),
  ('Two Hearts Society', 'society', 'Devoted to the Sacred Heart of Jesus and Immaculate Heart of Mary in united devotion.', 14, '#C8102E'),
  ('Charismatic Renewal', 'society', 'Experiencing the gifts of the Holy Spirit and renewing the Church through praise, healing and evangelization.', 15, '#8B0000'),
  ('Precious Blood of Jesus Society', 'society', 'Meditating on the redeeming Blood of Christ, the price of our salvation.', 16, '#C8102E'),
  ('Divine Mercy Society', 'society', 'Spreading the message of God''s infinite mercy as revealed to Saint Faustina Kowalska.', 17, '#D4AF37')
ON CONFLICT (name) DO NOTHING;
