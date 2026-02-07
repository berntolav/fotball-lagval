-- Bruk denne SQL-spørringa i Supabase SQL Editor for å få alle invite-lenker
-- Erstatt 'din-app-url.vercel.app' med din faktiske Vercel URL etter deployment

SELECT 
  first_name,
  last_name,
  phone_number,
  CONCAT('https://din-app-url.vercel.app/vote?token=', invite_token) as invite_link
FROM players
ORDER BY first_name;

-- Eksempel på output:
-- Viyan | | 41686969 | https://din-app-url.vercel.app/vote?token=abc-123-def

-- Tips:
-- 1. Køyr denne spørringa etter du har køyrt supabase-setup.sql
-- 2. Eksporter resultatet til CSV
-- 3. Bruk ein SMS-teneste for å sende lenkene til kvar spelar
