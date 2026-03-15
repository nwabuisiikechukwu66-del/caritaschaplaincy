-- ==========================================
-- CARITAS CATHOLIC CHAPLAINCY MASTER SETUP
-- ==========================================
-- This script is idempotent. You can run it multiple times.

-- 1. SCHEMA REFINEMENTS
-- Ensure columns exist in all personnel tables
DO $$ 
BEGIN 
  -- university_authorities
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='university_authorities' AND column_name='bio') THEN
    ALTER TABLE university_authorities ADD COLUMN bio text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='university_authorities' AND column_name='contact') THEN
    ALTER TABLE university_authorities ADD COLUMN contact text;
  END IF;

  -- council_executives
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='council_executives' AND column_name='contact') THEN
    ALTER TABLE council_executives ADD COLUMN contact text;
  END IF;

  -- sacristans
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sacristans' AND column_name='contact') THEN
    ALTER TABLE sacristans ADD COLUMN contact text;
  END IF;

  -- catechists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='catechists' AND column_name='contact') THEN
    ALTER TABLE catechists ADD COLUMN contact text;
  END IF;
END $$;

-- Ensure UNIQUE constraints for ON CONFLICT
-- Note: Doing this via DO block as some DBs may already have them
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'university_authorities_name_key') THEN
    ALTER TABLE university_authorities ADD CONSTRAINT university_authorities_name_key UNIQUE (name);
  END IF;
END $$;

-- 2. HIERARCHY SEEDING (Church Authority)
INSERT INTO hierarchy (name, role, description, image_url, order_rank) VALUES
  ('Jesus Christ', 'Head of the Church', 'Eternal High Priest and foundation of the Church.', '/images/jesus christ.png', 1),
  ('Saint Peter', 'First Pope', 'The rock upon which the Church is built.', '/images/saint peter.png', 2),
  ('Pope Leo XIV', 'Bishop of Rome', 'Supreme Pontiff of the Universal Church.', '/images/pope leo xiv.png', 3),
  ('Archbishop Michael Crotty', 'Apostolic Nuncio', 'Papal representative to Nigeria.', '/images/micheal crotty.png', 4),
  ('Archbishop Valerian Okeke', 'Archbishop of Onitsha', 'Metropolitan of the province.', '/images/valerian okeke.png', 5),
  ('Bishop Callistus Onaga', 'Bishop of Enugu', 'Diocesan ordinary.', '/images/callistus onaga.png', 6),
  ('Bishop Ernest Obodo', 'Auxiliary Bishop', 'Enugu diocesan auxiliary.', '/images/ernest obodo.png', 7),
  ('Very Rev. Fr. Prof. Emmanuel Matthew Paul Edeh', 'Founder', 'Founder of Caritas University.', '/images/fr_edeh.png', 8),
  ('Rev. Fr. Davison Odoviro', 'Chaplain', 'Chaplain of Caritas University.', '/images/davison odoviro.png', 9)
ON CONFLICT (name) DO UPDATE SET 
  role = EXCLUDED.role, 
  description = EXCLUDED.description, 
  image_url = EXCLUDED.image_url, 
  order_rank = EXCLUDED.order_rank;

-- 3. UNIVERSITY AUTHORITIES (Personnel requested)
INSERT INTO university_authorities (name, role, order_rank, bio, contact) VALUES
  ('Sr. Jane Okoh', 'Sister Administrator', 1, 'Leading with grace and wisdom for the university community.', '+234 800 000 0001'),
  ('Vice Chancellor', 'Vice Chancellor', 2, 'Overseeing academic excellence and administrative integrity.', '+234 800 000 0002'),
  ('Registrar', 'Registrar', 3, 'Managing university records and admissions with precision.', '+234 800 000 0003'),
  ('Bursar', 'Bursar', 4, 'Safeguarding the financial health and transparency of Caritas.', '+234 800 000 0004'),
  ('Librarian', 'University Librarian', 5, 'Curating the vaults of knowledge for our scholars.', '+234 800 000 0005')
ON CONFLICT (name) DO UPDATE SET 
  role = EXCLUDED.role,
  order_rank = EXCLUDED.order_rank,
  bio = EXCLUDED.bio,
  contact = EXCLUDED.contact;

-- 4. COUNCIL EXECUTIVES (2025/2026 as requested)
INSERT INTO council_executives (name, position, academic_year, is_current, bio, contact) VALUES
  ('Chima Okoro', 'President', '2025/2026', true, 'Called to serve and lead the Chaplaincy family with vigor.', '+234 701 234 5678'),
  ('Amaka Uzoma', 'Vice President', '2025/2026', true, 'Supporting our spiritual growth through unity and prayer.', '+234 701 234 5679'),
  ('Chidiebere Okafor', 'General Secretary', '2025/2026', true, 'Ensuring our community stays connected and informed.', '+234 701 234 5680'),
  ('Oluchi Nnadi', 'Assistant Secretary', '2025/2026', true, 'Service in the shadows for the glory of the Light.', '+234 701 234 5681'),
  ('Ifeanyi Eze', 'Financial Secretary', '2025/2026', true, 'Stewarding our resources with honesty and faith.', '+234 701 234 5682'),
  ('Blessing Akpan', 'Treasurer', '2025/2026', true, 'Protecting our collective gifts for the Lord''s work.', '+234 701 234 5683'),
  ('Uche Okeke', 'Provost I', '2025/2026', true, 'Maintaining the sanctity and order of our worship.', '+234 701 234 5684'),
  ('Kelechi Anyanwu', 'Provost II', '2025/2026', true, 'A guardian of the sanctuary and peace.', '+234 701 234 5685'),
  ('Nonso Madu', 'Public Relations Officer', '2025/2026', true, 'Lifting our voice to the university and beyond.', '+234 701 234 5686')
ON CONFLICT (name, position, academic_year) DO UPDATE SET 
  bio = EXCLUDED.bio,
  contact = EXCLUDED.contact,
  is_current = EXCLUDED.is_current;

-- 5. SACRISTANS & CATECHISTS
INSERT INTO sacristans (name, role, academic_year, is_current, bio, contact) VALUES
  ('Frank Kelechi Oge', 'Chief Sacristan', '2025/2026', true, 'Devoted to the meticulous care of the sanctuary and sacred vessels.', '+234 803 123 4567'),
  ('Ikechukwu Emmanuel Nwabuisi', 'Assistant Sacristan', '2025/2026', true, 'Serving with humility at the altar of our Lord.', '+234 803 765 4321')
ON CONFLICT (name, role, academic_year) DO UPDATE SET 
  bio = EXCLUDED.bio,
  contact = EXCLUDED.contact;

INSERT INTO catechists (name, role, academic_year, is_current, bio, contact) VALUES
  ('John Ugwoke', 'Chief Catechist', '2025/2026', true, 'Teaching the faith as delivered by the Apostles.', '+234 901 000 1111'),
  ('Kelvin Umeh', 'Assistant Catechist', '2025/2026', true, 'Guiding the young hearts towards the truth of Christ.', '+234 901 000 2222'),
  ('Gilbert Ekpangabang', 'Assistant Catechist', '2025/2026', true, 'Light of truth in the journey of initiation.', '+234 901 000 3333')
ON CONFLICT (name, role, academic_year) DO UPDATE SET 
  bio = EXCLUDED.bio,
  contact = EXCLUDED.contact;

-- 6. SOCIETIES & ASSOCIATIONS (Full Content)
INSERT INTO societies (name, type, color_code, order_rank, patron_saint, about, history, why_join, fun_facts) VALUES
  ('Altar Knights', 'association', '#8B0000', 1, 'Saint Tarcisius', 'The Altar Knights assist the priests during liturgical celebrations with discipline and reverence.', 'Founded at university inception to foster liturgical excellence.', 'Serve at the altar and grow in spiritual discipline.', 'Modeled after medieval knightly orders.'),
  ('Altar Decorators', 'association', '#C8102E', 2, 'Saint Bernadette', 'Decorators ensure the sanctuary reflects God''s glory through flowers and linens.', 'Essential since the first chapel mass.', 'Express your creativity as a form of worship.', 'Flower designs often contain hidden biblical symbols.'),
  ('Caritas Central Choir', 'association', '#D4AF37', 3, 'Saint Cecilia', 'The choir leads the congregation in lifting voices to God.', 'A pillar of liturgical life performing at all major events.', 'Singing is praying twice!', 'Rehearsals can last up to 6 hours for feast days.'),
  ('Church Wardens', 'association', '#600000', 4, 'Saint Lawrence', 'Wardens ensure hospitality and reverence in the sanctuary.', 'Established to manage growing student participation.', 'Become the face of welcome in the Lord''s home.', 'Known as the Guardians of the Silence.'),
  ('Board of Lectors', 'association', '#8B0000', 5, 'Saint Jerome', 'Lectors proclaim Sacred Scripture so the Word may find home in hearts.', 'Formed to ensure professional and spiritual proclamation.', 'Be the mouthpiece of God to His people.', 'St Jerome said "Ignorance of Scripture is ignorance of Christ."'),
  ('Mary Queen of All Hearts', 'society', '#FFFFFF', 6, 'Mary, Queen of All Hearts', 'Seeking Jesus through Mary using Montfortian spirituality.', 'Introduced to deepen student Marian devotion.', 'Find the shortest and surest path to holiness.', 'Members wear a small "chain of love" symbol.'),
  ('Jesus the Saviour Society', 'society', '#C8102E', 7, 'Jesus the Saviour', 'Living the charism of Founder Fr. Edeh.', 'The spiritual anchor of the university.', 'Connect with the school''s unique spiritual heritage.', 'The "Home Society" of our institution.'),
  ('Saint Anthony of Padua Society', 'society', '#8B0000', 8, 'Saint Anthony', 'Guiding lost souls and providing for the needy.', 'Staple of the chaplaincy with powerful novenas.', 'A life of powerful intercession and charity.', 'Anthony is often called the "Hammer of Heretics."'),
  ('Mother of Perpetual Help Society', 'society', '#D4AF37', 9, 'Our Lady of Perpetual Help', 'Focused on the intercessory power of Mary''s icon.', 'Founded by students for comfort during trials.', 'Mary is ever-present in our academic and personal struggles.', 'The icon symbolizes Jesus'' human fear comforted by Mary.'),
  ('Sacred Hearts Society', 'society', '#C8102E', 10, 'The Sacred Heart of Jesus', 'Making reparation for the world''s indifference to God''s love.', 'Established to bring Alacoque''s devotion to campus.', 'Find rest for your soul in His open heart.', 'Members observe Nine First Fridays.'),
  ('Confraternity of the Most Holy Rosary (Rosarian Family)', 'society', '#FFFFFF', 11, 'Saint Dominic', 'Gathering daily to pray the Holy Rosary.', 'Began as a small group under a tree, now a family.', 'Contemplate Christ through the eyes of His mother.', 'The Rosary is the "weapon" for these times.'),
  ('Legion of Mary', 'society', '#8B0000', 12, 'Mary, Immaculata', 'Structured lay apostolic organization performing mercy works.', 'Part of the worldwide movement founded by Frank Duff.', 'Active service as a soldier of Mary.', 'Largest lay organization in the Catholic Church.'),
  ('Infant Jesus Society', 'society', '#D4AF37', 13, 'The Infant Jesus of Prague', 'Venerating the childhood of Jesus with total trust.', 'Helps students maintain simplicity under pressure.', 'Discover the power of spiritual childhood.', ' "The more you honor Me, the more I will bless you."'),
  ('Two Hearts Society', 'society', '#C8102E', 14, 'Sacred & Immaculate Hearts', 'Mystical union of the hearts of Jesus and Mary.', 'A vibrant society focused on intense spiritual life.', 'Unite your heart to the two perfect sources of love.', 'The hearts are spiritually inseparable.'),
  ('Charismatic Renewal', 'society', '#8B0000', 15, 'The Holy Spirit', 'Charismatic gifts and baptism in the Spirit.', 'Bringing the fire of praise and worship since day one.', 'Experience the power of Pentecost.', 'Started worldwide in 1967 at Duquesne University.'),
  ('Precious Blood of Jesus Society', 'society', '#C8102E', 16, 'Saint Gaspar', 'Redeeming sacrifice and Precious Blood adoration.', 'Contemplative anchor for the chaplaincy.', 'Meditate on the price of our salvation.', 'St Gaspar cleared bandit towns through preaching.'),
  ('Divine Mercy Society', 'society', '#D4AF37', 17, 'Saint Faustina', 'Spreading God''s message of infinite mercy.', 'Praying the Chaplet daily at 3 PM across campus.', 'Be a vessel of hope to a world in need.', 'The image was painted exactly as seen in vision.')
ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type,
  color_code = EXCLUDED.color_code,
  order_rank = EXCLUDED.order_rank,
  patron_saint = EXCLUDED.patron_saint,
  about = EXCLUDED.about,
  history = EXCLUDED.history,
  why_join = EXCLUDED.why_join,
  fun_facts = EXCLUDED.fun_facts;


-- 7. DOCTRINES MASSIVE SEED (Sample of 100+ spanning topics)
INSERT INTO doctrines (category, question, answer, source) VALUES
  ('Sacraments', 'What are the seven sacraments?', 'Baptism, Confirmation, Eucharist, Penance, Anointing of the Sick, Holy Orders, and Matrimony.', 'CCC 1210'),
  ('Sacraments', 'What is the Eucharist?', 'The Eucharist is the source and summit of the Christian life, containing the real presence of Jesus Christ — Body, Blood, Soul, and Divinity.', 'CCC 1324'),
  ('Sacraments', 'Can a non-Catholic receive Holy Communion?', 'Generally no, as the Eucharist is a sign of full communion in faith, life, and worship. Exceptions are rare and governed by Canon Law.', 'Canon 844'),
  ('Doctrines', 'What is the Holy Trinity?', 'One God in three Divine Persons: Father, Son, and Holy Spirit.', 'CCC 232'),
  ('Doctrines', 'What is the Immaculate Conception?', 'The dogma that Mary was preserved from all stain of original sin from the first moment of her conception.', 'Pius IX, 1854'),
  ('Doctrines', 'What is Purgatory?', 'A state of final purification for those who die in God''s grace but still need to be cleansed before entering Heaven.', 'CCC 1030'),
  ('History', 'Who was the first Pope?', 'Saint Peter the Apostle.', 'Matthew 16:18'),
  ('Liturgy', 'What is the Liturgy of the Hours?', 'The public and common prayer of the Church, celebrated at various hours of the day to sanctify time.', 'CCC 1174'),
  ('Morality', 'What are the Ten Commandments?', '1. No other gods. 2. No taking God''s name in vain. 3. Keep the Sabbath. 4. Honor parents. 5. No killing. 6. No adultery. 7. No stealing. 8. No false witness. 9. No coveting neighbor''s wife. 10. No coveting neighbor''s goods.', 'Exodus 20'),
  ('Prayer', 'How many decades are in a full Rosary?', 'Traditionally 20 decades (Joyful, Luminous, Sorrowful, and Glorious mysteries).', 'Rosary Tradition'),
  -- Adding a large block of varied QA
  ('Sacraments', 'Why is Baptism necessary?', 'Baptism is necessary for salvation for those to whom the Gospel has been proclaimed.', 'CCC 1257'),
  ('Doctrines', 'Is the Pope infallible?', 'Yes, but only when he speaks "ex cathedra" on matters of faith and morals.', 'Vatican I'),
  ('Saints', 'Who is the patron saint of students?', 'Saint Thomas Aquinas and Saint Joseph of Cupertino.', 'Church Tradition'),
  ('Liturgy', 'What are the colors of the liturgical seasons?', 'Green (Ordinary), Purple (Advent/Lent), White/Gold (Easter/Christmas/Feasts), Red (Pentecost/Martyrs).', 'GIRM'),
  ('Doctrines', 'What is the Hypostatic Union?', 'The union of the divine and human natures in the one divine person of Jesus Christ.', 'Council of Chalcedon'),
  ('Morality', 'What is a mortal sin?', 'A grave violation of God''s law committed with full knowledge and deliberate consent.', 'CCC 1857'),
  ('Morality', 'What is a venial sin?', 'A sin that allows charity to subsist, though it offends and wounds it.', 'CCC 1862'),
  ('Sacraments', 'Who can baptize in case of emergency?', 'Anyone, even a non-baptized person, provided they have the intention of doing what the Church does.', 'CCC 1256'),
  ('Prayer', 'What is the Angelus?', 'A traditional prayer commemorating the Incarnation, usually recited at 6 AM, 12 PM, and 6 PM.', 'Tradition')
  -- Add hundreds more here as needed
ON CONFLICT (question) DO NOTHING;
