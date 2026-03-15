# ✝ Caritas Catholic Chaplaincy Website

**The digital spiritual home of Caritas University Chaplaincy, Amorji-Nike, Enugu.**
Built on the spirituality of *Jesus the Saviour* — the charism of Fr. Emmanuel Matthew Paul Edeh.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (see Setup section below)
cp .env.local.example .env.local
# Edit .env.local and fill in your keys

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
```

---

## 📋 Required Setup

### Step 1 — Supabase Database (FREE)
1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Go to **SQL Editor** → paste the full content of `src/lib/supabase-schema.sql` → **Run**
3. Copy your **Project URL** and **Anon Key** from Settings → API → paste into `.env.local`

### Step 2 — Daily Readings & Saints (NO KEY NEEDED)
Readings come from **Universalis.com** (no API key required).
Saints come from **Universalis + VaticanNews + Catholic.org** (no API key required).

### Step 3 — "Ask a Padre" AI Chatbot
The chatbot has **4-tier fallback** — at minimum it always works offline:

| Tier | Service | Key Needed | Notes |
|------|---------|-----------|-------|
| 1st | **Magisterium AI** | `MAGISTERIUM_API_KEY` | Best — purpose-built Catholic AI |
| 2nd | **Google Gemini** | `GEMINI_API_KEY` | FREE at aistudio.google.com |
| 3rd | **OpenAI** | `OPENAI_API_KEY` | Optional extra fallback |
| 4th | **Local JSON** | None | Always works — 100+ Catholic Q&A |

**Minimum:** Just add your `GEMINI_API_KEY` (free) for a good experience.

### Step 4 — Paystack Payments (Optional)
For online payment of Mass intentions & thanksgiving:
1. Register at [paystack.com](https://paystack.com)
2. Get public & secret keys from Dashboard → Settings → API Keys
3. Add to `.env.local`

> Bank transfer always works without Paystack.

---

## 🗂️ Pages

| Route | Page |
|-------|------|
| `/` | Home (all 12 sections) |
| `/about` | About the chaplaincy & Fr. Edeh |
| `/hierarchy` | Church hierarchy (Christ → Chaplain) |
| `/council` | Current council executives |
| `/officials` | Sacristans & catechists |
| `/societies` | All 17 associations & societies |
| `/societies/[id]` | Individual society detail pages |
| `/mass-intentions` | View & book Mass intentions (₦100) |
| `/thanksgiving` | Thanksgiving Mass (₦2,500) |
| `/petitions` | Community prayer petitions (FREE) |
| `/announcements` | Chaplaincy announcements |
| `/events` | Events calendar |
| `/readings` | Daily liturgical readings |
| `/saints` | Saint of the Day |
| `/doctrines` | 100+ Catholic Q&A searchable |
| `/order-of-mass` | Full Mass — English, Latin, Tridentine |
| `/donations` | Donate to chaplaincy needs |
| `/archives` | Historical records |
| `/admin` | Admin dashboard |

---

## 🔑 Admin Dashboard

**URL:** `/admin`

| Field | Value |
|-------|-------|
| Username | `caritasadminchap` |
| Password | `carit@$do-not-tell_2004` |

**Admin capabilities:**
- ✅ Approve / reject Mass intentions
- ✅ Approve / reject petitions
- ✅ Approve / reject announcements & events
- ✅ View all pending submissions
- ✅ Manage hierarchy, council, societies directly via Supabase

---

## 💰 Pricing

| Service | Amount |
|---------|--------|
| Mass Intention | ₦100 |
| Thanksgiving Mass | ₦2,500 |
| Petitions | FREE |

**Bank details (update in `.env.local`):**
- Bank: First Bank Nigeria
- Account No: 3012345678
- Account Name: Caritas Catholic Chaplaincy

---

## 🤖 "Ask a Padre" — AI Chatbot

The chatbot knows about:
- Catholic doctrine, sacraments, Bible
- Mass times, booking, chaplaincy services
- Saints, prayers, devotions
- Church history, papal teaching
- The specific charism of Fr. Edeh / the Saviourites

Fallback chain:
```
Magisterium AI → Google Gemini → OpenAI → Local doctrine JSON
```

The local JSON always works — even with no internet connection.

---

## 📖 API Architecture

| Feature | Source |
|---------|--------|
| Daily Readings | Universalis.com (primary) → Catholic.io API (fallback) |
| Saint of the Day | Universalis + VaticanNews + Catholic.org → AI enrichment |
| Ask a Padre | Magisterium AI → Gemini → OpenAI → Local JSON |
| Payments | Paystack online OR Bank Transfer (manual) |
| Database | Supabase (PostgreSQL) |

---

## 🚢 Deploy (Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Then in **Vercel Dashboard → Settings → Environment Variables**, add all your `.env.local` values.

---

## 🎨 Design

- **Colors:** Deep Red `#8B0000` · Crimson `#C8102E` · Gold `#D4AF37` · Cream `#FAF8F5`
- **Fonts:** Cinzel (headings) · Playfair Display (scripture quotes) · EB Garamond (body)
- **Style:** Sacred, elegant, mature — distinct from Caritas University's official site

---

*In Nomine Patris et Filii et Spiritus Sancti* ✝

*Caritas Catholic Chaplaincy · Caritas University · Amorji-Nike, Enugu*
