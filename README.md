# 🏆 TinkerHub Leaderboard Platform

A complete, production-ready, reusable web application for managing study jam and event leaderboards (including **Creative Week 2026**, **UI/UX Design Jam**, **Photography Challenge**, and any future TinkerHub programs).

---

## 🎨 Design & Architecture Highlights

- **Dominant Clean White Palette**: 70-80% clean `#FFFFFF` / `#FAF9F5` space with vibrant TinkerHub Red (`#D91E2E`), Retro Yellow (`#FFD43B`), Blue (`#8EC5FF`), Pink (`#FF9FA6`), and Green (`#A8D86E`) accents.
- **Retro Typography**: Heading display in *Bowlby One SC*, UI and numbers in *DM Sans*.
- **Vector Illustration Library**: Cassette tape, Game Boy handheld console, Retro Camera, Podium Trophy, Rocket, Pencil, Sparkles, Stars, and Dotted geometric stickers.
- **Zero Photographs / Avatars**: Strictly uses typography, ranking numbers, scores, and podium blocks.
- **Deterministic Theme Generator**: Derives coherent visual decorations from event slug.
- **Participant Access Codes**: Students access their personalized ranks via unique codes (e.g. `CW26-X7K4`) without passwords or account creation.
- **Spreadsheet Score Matrix**: Inline score editing with max score validation, auto-sum calculations, and 1-click round publishing.
- **Full Support for Ranks Outside Top 15**: If a student is ranked #16+ (e.g. #24), their position is separated below Top 15 with a `✦ YOUR POSITION ✦` ribbon using the exact same row structure.

---

## 🚀 Quick Start

The system starts empty. Create leaderboards and add participants only through the admin portal.

```bash
cd tinkerhub-leaderboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), select **Admin Portal**, and enter the configured admin code.

---

## 🗄️ Supabase PostgreSQL Setup & Production Deployment

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of [`supabase/schema.sql`](supabase/schema.sql) and run it to create tables, indexes, and Row Level Security (RLS) policies.
4. Do not run the seed file: it is intentionally empty.

### 2. Configure Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ADMIN_ACCESS_CODE=ADMIN2026
ADMIN_SESSION_SECRET=a-long-random-secret
```

`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_ACCESS_CODE`, and
`ADMIN_SESSION_SECRET` are server-only secrets. Do not prefix them with
`NEXT_PUBLIC_` and do not put them in client-side code.

### 3. Important security note
This project uses the server-side `ADMIN_ACCESS_CODE`; it does not use Supabase Auth users. Never expose `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_ACCESS_CODE`, or `ADMIN_SESSION_SECRET` in browser code or GitHub.

---

## 📦 Deploy to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the repository in [Vercel](https://vercel.com).
3. In **Settings → Environment Variables**, add all five variables above to
   **Production** (and Preview too if you test preview URLs). Use the exact
   names shown above, especially `SUPABASE_SERVICE_ROLE_KEY`.
4. Redeploy after saving the variables. Vercel applies environment-variable
   changes only to new deployments.
5. Open the deployed site, create one test leaderboard, refresh the admin
   dashboard and home page, and confirm the same board remains visible.

The production app deliberately refuses to use its development-only in-memory
store when Supabase credentials are missing. A configuration mistake will now
produce a visible server error rather than pretend to save data and lose it on
the next serverless request.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase PostgreSQL
- **Auth**: Signed admin-session cookie & participant access-code hashes
- **Icons**: Lucide React
- **Animations**: Canvas Confetti
