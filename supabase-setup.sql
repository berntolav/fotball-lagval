-- Tabell for spillere
CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  invite_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabell for svar/valg
CREATE TABLE responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES players(id),
  choice_1 UUID REFERENCES players(id),
  choice_2 UUID REFERENCES players(id),
  choice_3 UUID REFERENCES players(id),
  no_preference BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_response UNIQUE(player_id)
);

-- Index for raskare oppslag
CREATE INDEX idx_invite_token ON players(invite_token);
CREATE INDEX idx_player_responses ON responses(player_id);

-- Legg inn spillere frå Excel-fila
INSERT INTO players (first_name, last_name, phone_number, email) VALUES
('Viyan', '', '41686969', 'afandyviyan@gmail.com'),
('Sofia Amina', '', '41323177', 'sofiaaminaahabchane@icloud.com'),
('Sham', '', '41454033', 'Shaalj@skulenh.com'),
('Silva', '', '45993995', 'silvaalmahmoud11@gmail.com'),
('Hailey', '', '90960969', 'gtitland50@hotmail.com'),
('Lilian', '', '41655333', 'lilianbadra@icloud.com'),
('Linnea Rosendahl', '', '41670770', 'mette_r.bergaas@outlook.com'),
('Leah Alexandra', '', '94848549', 'rag_sor@live.no'),
('Louise', '', '97732313', 'louise.braseth@icloud.com'),
('Leah', '', '40834340', 'lene.christensen@alver.kommune.no'),
('Emma', '', '41430990', 'frode.gronnevik@alver.kommune.no'),
('Sara', '', '92858787', 'sara-emilie-21@hotmail.com'),
('Amelia', '', '99796662', 'olavdijkstra@gmail.com'),
('Maja', '', '94186660', 'stinelindaas@gmail.com'),
('Sara Emilie', '', '40467744', 'karinytre@gmail.com'),
('Emma', '', '40016760', 'marianne.molde@alver.kommune.no'),
('Caroline', '', '97581811', 'magnethaugen@outlook.com'),
('Hedda', '', '99409559', 'vnikolai@online.no'),
('Jenny', '', '99572960', 'gunnar_olsnes@hotmail.com'),
('Oline', '', '92418878', 'olineonarheim@icloud.com'),
('Alva', '', '99736686', 'cecmelseth@gmail.com'),
('Ylva', '', '41323142', 'helenes1986@gmail.com'),
('Malin', '', '99429030', 'Thereseschou@hotmail.com'),
('Victoria', '', '97990906', 'Karinw79@hotmail.com'),
('Filippa', '', '95881188', 'tonjekristoffersen1@gmail.com'),
('Mille', '', '91591393', 'karisolli@gmail.com'),
('Hanna', '', '94186661', 'morten_amundsen_lindaas@hotmail.com'),
('Elina', '', '91156444', 'Tormod.Tveit@gmail.com'),
('Vilde', '', '40866363', 'stine.tveita1@gmail.com'),
('Iselin', '', '97503888', 'Katrine-osnes@hotmail.com'),
('Ella', '', '94470990', 'marie.titland@alver.kommune.no'),
('Mina', '', '99736669', 'hjordisgulbrandsen11@gmail.com'),
('Sofia', '', '41455530', 'mf.flatoy@gmail.com'),
('Silje', '', '95212131', 'silje.s.myking@hotmail.com'),
('Nora', '', '99011660', 'Ingebjorgfl@hotmail.com'),
('Thea', '', '99518880', 'Cecilie.flatoy@gmail.com'),
('Norunn', '', '40491833', 'margit.mjelde@alver.kommune.no'),
('Vilde', '', '48289499', 'vigleik@stalsberghagen.no'),
('Linnea', '', '41438838', 'linn.elin.glomnes@gmail.com'),
('Tuva', '', '99254626', 'anakp93@gmail.com'),
('Mia', '', '46808110', 'mirjam_ro@hotmail.com'),
('Iben', '', '91580808', 'sofie.torsvik@gmail.com'),
('Benedicte', '', '92818044', 'geirulv@hotmail.com'),
('Sunniva Naomi', '', '41305933', 'Rebeckavartdal@gmail.com'),
('Amanda Irene', '', '40429942', 'oydis.westvik@gmail.com');

-- RLS (Row Level Security) policies
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Alle kan lese spillere
CREATE POLICY "Spillere er synlige for alle"
  ON players FOR SELECT
  USING (true);

-- Berre autentiserte kan skrive responses
CREATE POLICY "Alle kan sende inn svar"
  ON responses FOR INSERT
  WITH CHECK (true);

-- Alle kan lese eigne svar
CREATE POLICY "Alle kan lese svar"
  ON responses FOR SELECT
  USING (true);
