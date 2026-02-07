# Fotball Lagval App

Ein mobilvenleg applikasjon for å la fotballspelare velge kven dei vil spele med på laget.

## Funksjonar

- ✅ Unik invitasjonslenke per spelar via SMS
- ✅ Mobilvenleg design
- ✅ Vel opptil 3 medspelare
- ✅ "Veit ikkje" alternativ
- ✅ **Kan endre svar når som helst** (gå inn på lenka på nytt)
- ✅ Lagrar alle val i database

## Teknologiar

- **Frontend**: Next.js 14 med TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Setup

### 1. Supabase Database Setup

1. Opprett ein ny Supabase-prosjekt på [supabase.com](https://supabase.com)
2. Gå til SQL Editor i Supabase-dashboardet
3. Køyr alt innholdet i `supabase-setup.sql`
4. Dette vil:
   - Opprette `players` og `responses` tabeller
   - Legge inn alle 45 spelare frå Excel-fila
   - Generere unike invite tokens for kvar spelar
   - Sette opp Row Level Security policies

### 2. Hent Invite Links

Køyr denne SQL-spørringa i Supabase SQL Editor for å få alle invite-lenker:

```sql
SELECT 
  first_name,
  last_name,
  phone_number,
  CONCAT('https://din-app-url.vercel.app/vote?token=', invite_token) as invite_link
FROM players
ORDER BY first_name;
```

Eksporter resultatet og send lenka via SMS til kvar spelar sitt telefonnummer.

### 3. Lokal Utvikling

1. Klon eller last ned prosjektet
2. Installer dependencies:
```bash
npm install
```

3. Kopier `.env.example` til `.env.local`:
```bash
cp .env.example .env.local
```

4. Fyll inn Supabase credentials i `.env.local`:
   - Gå til Supabase Project Settings → API
   - Kopier Project URL og anon public key

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

5. Start development server:
```bash
npm run dev
```

6. Opne [http://localhost:3000](http://localhost:3000)

### 4. Deploy til Vercel

1. Push koden til GitHub
2. Gå til [vercel.com](https://vercel.com)
3. Importer GitHub repository
4. Legg til Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

## Bruk

### Send Invitasjonar

1. Hent alle invite-lenker frå databasen (sjå SQL over)
2. Send SMS til kvar spelar med deira unike lenke
3. Lenkene ser slik ut: `https://din-app.vercel.app/vote?token=abc-123-def`

### Spelarar Stemmer

1. Spelar klikkar på lenka i SMS
2. Ser eige namn og liste over alle andre spelare
3. Vel opptil 3 spelare (eller "Veit ikkje")
4. Sender inn - kan berre stemme éin gong

### Sjå Resultat

Køyr denne SQL-spørringa i Supabase for å sjå resultata:

```sql
SELECT 
  p.first_name || ' ' || COALESCE(p.last_name, '') as voter,
  COALESCE(p1.first_name || ' ' || COALESCE(p1.last_name, ''), '-') as choice_1,
  COALESCE(p2.first_name || ' ' || COALESCE(p2.last_name, ''), '-') as choice_2,
  COALESCE(p3.first_name || ' ' || COALESCE(p3.last_name, ''), '-') as choice_3,
  r.no_preference,
  r.submitted_at
FROM responses r
JOIN players p ON r.player_id = p.id
LEFT JOIN players p1 ON r.choice_1 = p1.id
LEFT JOIN players p2 ON r.choice_2 = p2.id
LEFT JOIN players p3 ON r.choice_3 = p3.id
ORDER BY r.submitted_at DESC;
```

## Struktur

```
fotball-lag-app/
├── app/
│   ├── api/
│   │   ├── player/
│   │   │   └── route.ts      # Hent spelar basert på token
│   │   └── submit/
│   │       └── route.ts      # Send inn val
│   ├── vote/
│   │   └── page.tsx          # Valside
│   ├── layout.tsx
│   ├── page.tsx              # Hovudside (info)
│   └── globals.css
├── lib/
│   └── supabase.ts           # Supabase client
├── supabase-setup.sql        # Database setup script
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Sikkerhet

- ✅ Unike, tilfeldig genererte tokens
- ✅ Kan berre stemme éin gong (database constraint)
- ✅ Row Level Security aktivert i Supabase
- ✅ Ingen autentisering nødvendig (token er nok)
- ✅ Ingen personleg info blir vist til andre

## Support

For spørsmål eller problem, kontakt utviklaren.
