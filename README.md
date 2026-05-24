# AI Spend Audit Tool

A premium lead-generation engine that helps startups audit and optimize their AI subscription spending. Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Supabase**, **Anthropic Claude**, and **Resend**.

## ✨ Features

- **Interactive Spend Form** — Configure 8 AI tools (Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, Anthropic API, OpenAI API) with dynamic plan selection, seat counts, and real-time cost calculations
- **Deterministic Audit Engine** — Detects seat over-provisioning, license overlap, plan right-sizing opportunities, and API double-billing
- **AI-Powered Summaries** — Claude 3.5 Sonnet generates personalized optimization summaries
- **Lead Capture** — Email collection with Resend transactional emails
- **Persistent Storage** — Supabase stores audit results with shareable report URLs
- **Graceful Degradation** — Works fully without Supabase/Anthropic/Resend (uses fallbacks)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
git clone https://github.com/Ashmit990/AI-Spend-Audit-Tool.git
cd AI-Spend-Audit-Tool
npm install
```

### Environment Variables

Copy the example file and fill in your keys (all optional):

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role key |
| `ANTHROPIC_API_KEY` | No | Anthropic API key for AI summaries |
| `RESEND_API_KEY` | No | Resend API key for emails |
| `NEXT_PUBLIC_APP_URL` | No | Public app URL (defaults to localhost:3000) |

### Database Setup

If using Supabase, run the schema in the SQL editor:

```bash
# Copy contents of supabase/schema.sql into Supabase SQL Editor
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Testing

```bash
npm test
```

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── audit/
│   │   │   ├── route.ts          # POST — run audit
│   │   │   └── [id]/route.ts     # GET  — fetch audit by ID
│   │   └── leads/route.ts        # POST — capture lead
│   ├── audit/
│   │   ├── [id]/page.tsx         # Dynamic audit report page
│   │   └── preview/page.tsx      # Fallback preview (no Supabase)
│   ├── layout.tsx
│   └── page.tsx                  # Landing page with SpendForm
├── components/
│   ├── SpendForm.tsx             # Interactive tool config form
│   └── AuditReport.tsx           # Full audit report UI
├── lib/
│   ├── audit.ts                  # Core audit processing engine
│   ├── pricing.ts                # Pricing catalog for all 8 tools
│   ├── anthropic.ts              # Anthropic Claude wrapper
│   ├── supabase.ts               # Supabase client setup
│   ├── resend.ts                 # Resend email wrapper
│   └── __tests__/
│       ├── pricing.test.ts       # Pricing constant tests
│       └── audit.test.ts         # Audit engine tests
└── types/
    └── index.ts                  # TypeScript interfaces
supabase/
└── schema.sql                    # Database schema with RLS policies
```

## 🧪 Test Coverage

- **Pricing Tests** — Validates all 8 tool pricing plans and calculations
- **Audit Tests** — Seat over-provisioning, overlap detection, API double-billing, Credex bulk credits, upsell flags, optimal stack detection, small team downgrades, prompt text generation

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic Claude 3.5 Sonnet |
| Email | Resend |
| Icons | Lucide React |
| Testing | Jest + ts-jest |

## 📄 License

MIT
