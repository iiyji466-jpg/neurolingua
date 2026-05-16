# NeuroLingua AI 🧠

> The world's most advanced AI language، acquisition platform.
> A living AI tutor that evolves with the user — not a course, not a chatbot.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com)

---

## 🌍 Supported Languages

36 languages including English, Arabic, Spanish, French, German, Chinese, Japanese, Korean, Portuguese, Russian, Italian, Turkish, Hindi, Hebrew, Persian, Urdu, and more.

---

## 🏗️ Architecture

```
neurolingua-ai/               ← Turborepo monorepo
├── apps/
│   ├── web/                  ← Next.js 14 (App Router)
│   └── api/                  ← NestJS + PostgreSQL
├── packages/
│   ├── ui/                   ← Shared design system
│   ├── ai/                   ← AI abstraction layer
│   ├── types/                ← Shared TypeScript types
│   ├── utils/                ← Shared utilities
│   └── config/               ← Global config
└── infrastructure/
    └── docker/               ← Docker + Compose
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/neurolingua-ai.git
cd neurolingua-ai
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
# Fill in your values in .env.local
```

### 3. Database Setup

```bash
# Start PostgreSQL + Redis with Docker
docker compose -f infrastructure/docker/docker-compose.yml up -d postgres redis

# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

### 4. Run Development

```bash
npm run dev
# Web:  http://localhost:3000
# API:  http://localhost:4000
# Docs: http://localhost:4000/api/docs
```

---

## 🚀 Deploy to Production

### Frontend → Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd apps/web
vercel --prod
```

**Required Vercel environment variables:**
```
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
OPENAI_API_KEY=
```

### Backend → Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

### GitHub Actions (Auto Deploy)

Add these secrets to your GitHub repository:
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
RAILWAY_TOKEN
DATABASE_URL
```

---

## 🔑 Auth Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add callback: `https://yourdomain.com/api/auth/callback/google`

### GitHub OAuth
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Add callback: `https://yourdomain.com/api/auth/callback/github`

### Apple OAuth
1. Go to [Apple Developer](https://developer.apple.com)
2. Create App ID + Service ID
3. Add callback: `https://yourdomain.com/api/auth/callback/apple`

---

## 🧠 Core Systems

| System | Description |
|--------|-------------|
| **Auth** | OAuth 2.0, JWT rotation, HttpOnly cookies |
| **AI Core** | GPT-4o with memory injection, streaming |
| **Learning Engine** | Skill tracking, SRS, adaptive difficulty |
| **Voice** | STT/TTS, pronunciation scoring |
| **Immersion** | Real-life scenario conversations |
| **Memory** | Short + long term AI memory per user |
| **Billing** | Stripe subscriptions, Free/Pro/Ultra |

---

## 🛡️ Security

- JWT Access tokens: 15 minutes
- Refresh tokens: 30 days, rotated on use, bcrypt-hashed
- HttpOnly + Secure + SameSite cookies
- Rate limiting: 5 req/min on auth endpoints
- Input validation with Zod + class-validator
- Helmet.js security headers

---

## 📦 Tech Stack

**Frontend:** Next.js 14, TypeScript, TailwindCSS, Framer Motion, Zustand, TanStack Query, Lucide Icons

**Backend:** NestJS, TypeScript, PostgreSQL, Prisma ORM, Redis, Passport.js

**AI:** OpenAI GPT-4o (streaming), memory extraction, pronunciation scoring

**Payments:** Stripe

**Deploy:** Vercel (web) + Railway (API)

**CI/CD:** GitHub Actions

---

## 📄 License

MIT © NeuroLingua AI Team
