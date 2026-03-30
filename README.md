<p align="center">
	<img src="https://raw.githubusercontent.com/Omkraft/.github/main/assets/logo-primary-square.svg" alt="Omkraft Logo" width="250" />
</p>

<h1 align="center">app-ui</h1>

<p align="center">
	<strong>Frontend web application for the Omkraft platform</strong>
</p>

<p align="center">
  <em>Systems, Crafted.</em>
</p>

---

## 🧭 Overview

`app-ui` is the React + TypeScript frontend for Omkraft.

It includes:
- Auth flows (register, login, forgot/reset password, email verification)
- Protected app routes (Dashboard, Utility Hub, Subscription Tracker)
- Daily Panchang with date-based panchang details and lazy-loaded daily horoscope
- Admin dashboard for user/subscription management with sortable tables
- PWA support (install/update prompts, offline-friendly caching)
- Push notification registration
- Real-time notification updates via Socket.IO
- Build-version surfaced in footer and update toast

---

## 🧱 Tech Stack

- React 19
- TypeScript
- Vite 7
- React Router 7
- Tailwind CSS + SCSS
- Radix UI primitives + custom UI components
- Lucide icons
- Recharts (analytics charts)
- Socket.IO client
- vite-plugin-pwa (Workbox)

---

## 📁 Project Structure

```text
app-ui/
|-- public/                    # Static files (including version.json, sw-push.js)
|-- scripts/
|   `-- write-build-version.mjs
|-- src/
|   |-- api/                   # API layer
|   |-- components/            # Reusable UI + feature components
|   |-- context/               # Auth + notifications context
|   |-- hooks/                 # App hooks (PWA update/version, etc.)
|   |-- lib/                   # Shared utilities (version, toast, sync queue, etc.)
|   |-- pages/                 # Route pages
|   |-- routes/                # Route guards
|   |-- services/              # Push and other services
|   |-- styles/                # Global styles + variables
|   |-- utils/                 # Helpers
|   |-- App.tsx
|   `-- main.tsx
|-- package.json
|-- vite.config.ts
`-- README.md
```

---

## 🛣️ Routes

Public routes:
- `/welcome`
- `/login`
- `/register`
- `/forgot-password`
- `/verify-email`

Protected routes:
- `/dashboard`
- `/utility`
- `/subscription`

Utility routes:
- `/maintenance`

---

## 🔐 Environment Variables

Create `.env` in `app-ui/`.

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_VAPID_PUBLIC_KEY=<your_web_push_vapid_public_key>
```

Build/deploy-time variable (in CI/platform env):

```env
APP_RELEASE_VERSION=<github_release_tag>
```

Notes:
- `APP_RELEASE_VERSION` is injected at build time and written to `public/version.json`.
- If not set, version falls back to commit SHA (if available), then package version, then `dev`.

---

## 🏷️ Versioning Behavior

Version resolution source of truth:
1. `APP_RELEASE_VERSION`
2. `VERCEL_GIT_COMMIT_SHA` or `GITHUB_SHA`
3. `npm_package_version` (if not `0.0.0`)
4. `dev`

Where version is used:
- Footer (public + app)
- Update toast (`PWAUpdateToast` compares current build vs latest `/version.json`)

---

## 📲 PWA and Push

PWA setup:
- Managed by `vite-plugin-pwa`
- `registerType: 'prompt'`
- Runtime caching configured for Omkraft API endpoints
- Push SW handlers are loaded via `public/sw-push.js` through Workbox `importScripts`

Push setup:
- Browser subscribes with `VITE_VAPID_PUBLIC_KEY`
- Subscription payload is sent to `POST /api/push/subscribe`

---

## 🧪 Scripts

```bash
npm run dev        # predev runs write-build-version, then starts Vite
npm run build      # prebuild runs write-build-version, then typecheck + Vite build
npm run preview    # preview production build
npm run lint       # ESLint
npm run lint:fix   # ESLint auto-fix
```

---

## 🚀 Local Development

```bash
git clone https://github.com/Omkraft/app-ui.git
cd app-ui
npm install
npm run dev
```

Default dev URL:
- `http://localhost:5173`

---

## 🌐 Deployment Notes

- Designed for Vercel deployment
- `APP_RELEASE_VERSION` should be set in deploy environment to display exact release tag in UI
- Ensure `VITE_API_BASE_URL` points to deployed `app-api`
- Ensure `VITE_VAPID_PUBLIC_KEY` is set for push registration

---

## ✅ Quality Checks

Recommended before merge/deploy:

```bash
npm run lint
npm run build
```

---

## 🏷️ License

MIT

---

<p align="center">Built by<br/><span style="font-weight:500;">Omkraft</span> Inc.<br/><em>Systems, Crafted.</em></p>
<p align="center"><img src="https://raw.githubusercontent.com/Omkraft/.github/main/assets/logo-small.svg" alt="Omkraft Logo Small" width="48" height="48" /></p>


---

## PR Review Automation

Pull requests are automatically reviewed by a local Ollama model on:
- PR open
- PR reopen
- PR ready-for-review
- Each subsequent push to the PR branch (`synchronize`)

Current review model:
- `qwen2.5-coder:1.5b`

No external LLM API key is required for PR review in this setup.
