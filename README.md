# Kindroots 🌱

A personalised parenting companion app for first-time parents. Covering pregnancy through age 3, powered by Claude AI.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native (Expo 51) + Expo Router |
| Styling | NativeWind (Tailwind for RN) + Nunito font |
| State | Zustand |
| Backend | Supabase (Auth, DB, Edge Functions, Storage) |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| Payments | Stripe |
| Notifications | Expo Push Notifications |

## Features

- **Kira** — 24/7 AI parenting companion with full family context
- **"Is This Normal?"** — Instant reassurance tool powered by Claude
- **Routine Builder** — AI-generated daily schedules (Gina Ford or gentle rhythm-based)
- **Milestone Tracker** — Visual timeline with Wonder Weeks integration
- **Stage Guide Library** — Framework-filtered content from 10 parenting books
- **Daily Log** — Feeds, sleeps, nappies with weekly summaries
- **Parental Wellbeing** — Mood tracking, EPDS signposting, Kira support
- **Partner Mode** (Premium) — Shared family profile and logs
- **Kindroots+** — Freemium via Stripe (7-day trial, £8.99/mo)

## Project Structure

```
kindroots/
├── app/
│   ├── (auth)/          # Welcome, Sign up, Sign in
│   ├── (onboarding)/    # 4-step family profile wizard
│   ├── (tabs)/          # Main app: Home, Guides, Routine, Tracker, Kira
│   ├── settings.tsx     # Profile, subscription, notifications
│   └── _layout.tsx      # Root layout with auth listener
├── components/
│   ├── ui/              # Card, Button, Input, OnboardingProgress
│   ├── kira/            # Kira-specific components
│   ├── milestone/       # Milestone components
│   └── routine/         # Routine components
├── stores/
│   ├── authStore.ts     # Auth state (Zustand)
│   ├── familyStore.ts   # Family/baby/logs state
│   └── kiraStore.ts     # Chat message state
├── lib/
│   ├── supabase.ts      # Supabase client
│   ├── types.ts         # TypeScript types + framework definitions
│   └── helpers.ts       # Age calc, leap detection, affiliate data
└── supabase/
    ├── functions/
    │   ├── kira-chat/         # Main Kira AI endpoint
    │   ├── is-this-normal/    # Reassurance tool endpoint
    │   ├── generate-routine/  # AI routine generator
    │   ├── content-engine/    # Daily tips & weekly insights
    │   └── stripe-webhook/    # Subscription lifecycle
    └── migrations/
        ├── 001_initial_schema.sql  # Full schema + RLS
        ├── 002_seed_data.sql       # Wonder Weeks, milestones, articles
        └── 003_demo_data.sql       # Demo account setup guide
```

## Getting Started

### 1. Clone and install

```bash
git clone <repo>
cd kindroots
npm install
```

### 2. Set up Supabase

```bash
npm install -g supabase
supabase start
supabase db push
```

### 3. Configure environment

```bash
cp .env.example .env
# Fill in EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

### 4. Set Edge Function secrets

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5. Deploy Edge Functions

```bash
supabase functions deploy kira-chat
supabase functions deploy is-this-normal
supabase functions deploy generate-routine
supabase functions deploy content-engine
supabase functions deploy stripe-webhook
```

### 6. Start the app

```bash
npx expo start
```

## Demo Account

- Email: `demo@kindroots.app` · Password: `Demo1234!`
- Family: Sarah + James · Baby: Mia (9 weeks, combination feeding)
- Frameworks: Wonder Weeks + Gentle Sleep Book · Premium active
- See `supabase/migrations/003_demo_data.sql` for setup instructions

## Freemium Limits

| Feature | Free | Kindroots+ (£8.99/mo) |
|---|---|---|
| Kira messages | 10/day | Unlimited |
| "Is This Normal?" | 5/day | Unlimited |
| Guide library | 2/category | Full library |
| Wonder Weeks leaps | Leaps 1–3 | All 10 leaps |
| Saved routines | View only | Unlimited |
| Partner mode | ✗ | ✓ |
| Growth charts & photos | ✗ | ✓ |

## Parenting Frameworks

Kindroots integrates guidance from 10 frameworks: Gina Ford, The Wonder Weeks, Harvey Karp, Brain Rules for Baby, No-Drama Discipline, The Gentle Sleep Book, The Baby Whisperer, The Whole-Brain Child, What to Expect the First Year, Peaceful Parent Happy Kids.

## Disclaimers

Kindroots is not a medical service. Always consult your GP, health visitor, or midwife for medical concerns. Kira is powered by AI and is not a substitute for professional medical or mental health support.