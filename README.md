<p align="center">
	<img src="https://raw.githubusercontent.com/Omkraft/.github/main/assets/logo-primary-square.svg" alt="Omkraft Logo" width="250" />
</p>

<h1 align="center">app-ui</h1>

<p align="center">
	<strong>Frontend web application for the Omkraft platform</strong>
</p>

<p align="center">
	Systems, Crafted.
</p>

---

## 🧭 Overview

This repository contains the **frontend UI** for the Omkraft platform.  
It is a modern React + TypeScript application designed to consume the `app-api` backend and provide secure, authenticated, and scalable user experiences.

Built with clarity, structure, and long-term maintainability in mind.

---

## 🧱 Tech Stack

- **Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router
- **Authentication:** JWT (via `app-api`)
- **Linting:** ESLint (Flat Config)
- **Formatting:** Tabs-based indentation
- **CI:** GitHub Actions (Lint Check on PRs)

---

## 📁 Project Structure

```text
app-ui/
├── src/
│   ├── api/              # API client & backend integration
│   ├── auth/             # Auth context, guards, helpers
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-level pages (Login, Dashboard, etc.)
│   ├── routes/           # Public & protected routes
│   ├── styles/           # Global styles & theme tokens
│   ├── App.tsx           # Root application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── index.html
├── eslint.config.cjs
├── package.json
├── vite.config.ts
└── README.md
```

The structure is intentionally modular to support scaling, feature isolation, and future design-system extraction.

---

## 🚀 Getting Started
### Prerequisites
- Node.js **18+**
- npm (or pnpm)
- Running instance of app-api (local or deployed)

### Clone the repository
```bash
git clone https://github.com/Omkraft/app-ui.git
cd app-ui
```

### Install dependencies
```bash
npm install
```

### Environment variables
Create a `.env` file in the project root:
```env
VITE_API_BASE_URL=http://localhost:3000
```
Replace with the deployed API URL for production.

### Start the development server
```bash
npm run dev
```
The app will be available at:
```arduino
http://localhost:5173
```

---

## 🔐 Authentication & Protected Routes
- Authentication is handled using **JWT tokens** issued by `app-api`
- Tokens are attached to API requests automatically
- Protected routes are enforced at the router level
- Unauthorized users are redirected to login
The architecture mirrors production-ready auth flows and is designed to evolve (refresh tokens, RBAC, etc.).

---

## 🧪 Available Scripts
| Script            | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start local development server |
| `npm run build`   | Build production assets        |
| `npm run preview` | Preview production build       |
| `npm run lint`    | Run ESLint checks              |

---

## 🧹 Code Quality
- ESLint enforced locally and in CI
- Tabs preferred over spaces
- CI lint checks run on every pull request
- Pull requests cannot be merged unless lint passes (org-level ruleset)

---

## 🌐 Deployment
The UI is designed for deployment on platforms such as:
- **Vercel**
- **Netlify**
In production:
- API base URL is injected via environment variables
- The UI communicates securely with `app-api` over HTTPS

---

## 🔮 Roadmap
- Omkraft design system integration
- Token refresh handling
- Role-based access control (RBAC)
- Shared UI components package
- End-to-end testing

---

## 🏷️ License
MIT

---

<p align="center"> Built by<br/><strong>Omkraft Inc.</strong><br/>Systems, Crafted.</p>
<p align="center"><img src="https://raw.githubusercontent.com/Omkraft/.github/main/assets/logo-small.svg" alt="Omkraft Logo Small" width="300" height="300" /></p>

---
