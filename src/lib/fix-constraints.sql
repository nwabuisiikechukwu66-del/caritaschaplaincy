-- ========================================================
-- CARITAS CATHOLIC CHAPLAINCY UNIQUE CONSTRAINT FIXES
-- ========================================================
-- Run this script in the Supabase SQL Editor to enable 
-- idempotent updates (ON CONFLICT) for all personnel and societies.

-- 1. SOCIETIES
ALTER TABLE societies DROP CONSTRAINT IF EXISTS societies_name_key;
ALTER TABLE societies ADD CONSTRAINT societies_name_key UNIQUE (name);

-- 2. UNIVERSITY AUTHORITIES
ALTER TABLE university_authorities DROP CONSTRAINT IF EXISTS university_authorities_name_key;
ALTER TABLE university_authorities ADD CONSTRAINT university_authorities_name_key UNIQUE (name);

-- 3. COUNCIL EXECUTIVES
-- For council, we usually want uniqueness per name and position per academic year
ALTER TABLE council_executives DROP CONSTRAINT IF EXISTS council_executives_name_position_academic_year_key;
ALTER TABLE council_executives ADD CONSTRAINT council_executives_name_position_academic_year_key UNIQUE (name, position, academic_year);

-- 4. SACRISTANS
ALTER TABLE sacristans DROP CONSTRAINT IF EXISTS sacristans_name_role_academic_year_key;
ALTER TABLE sacristans ADD CONSTRAINT sacristans_name_role_academic_year_key UNIQUE (name, role, academic_year);

-- 5. CATECHISTS
ALTER TABLE catechists DROP CONSTRAINT IF EXISTS catechists_name_role_academic_year_key;
ALTER TABLE catechists ADD CONSTRAINT catechists_name_role_academic_year_key UNIQUE (name, role, academic_year);

-- 6. DOCTRINES
ALTER TABLE doctrines DROP CONSTRAINT IF EXISTS doctrines_question_key;
ALTER TABLE doctrines ADD CONSTRAINT doctrines_question_key UNIQUE (question);

-- 7. HIERARCHY
ALTER TABLE hierarchy DROP CONSTRAINT IF EXISTS hierarchy_name_key;
ALTER TABLE hierarchy ADD CONSTRAINT hierarchy_name_key UNIQUE (name);

-- SUCCESS: You can now safely run seeding scripts using ON CONFLICT blocks.
