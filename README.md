# ArchOpt — Intelligent Architectural Space & Circulation Optimizer

Production-quality **frontend** for ArchOpt, a software system that converts an architectural
brief into structured spatial requirements and searches for feasible, circulation-aware
floor-plan layouts. Architecture is the application domain; computational geometry, graph
algorithms and optimization are the product.

This repository contains the **Next.js + TypeScript + Tailwind CSS** frontend only. The FastAPI
backend and the C++20 optimization engine described in the project proposal are **not** included
or connected; every number shown in the interface comes from clearly separated sample data
(`src/lib/mock`) and is labelled as illustrative.

---

## Contents

1. [Prerequisites](#1-prerequisites)
2. [Step-by-step setup in VS Code](#2-step-by-step-setup-in-vs-code)
3. [Terminal commands](#3-terminal-commands)
4. [What is in the app](#4-what-is-in-the-app)
5. [Project structure](#5-project-structure)
6. [Design system](#6-design-system)
7. [Mock data vs. application logic](#7-mock-data-vs-application-logic)
8. [Connecting a real backend](#8-connecting-a-real-backend)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

| Tool | Version | Check |
| --- | --- | --- |
| **Node.js** | 20.9 or newer (22 LTS recommended) | `node -v` |
| **npm** | 10 or newer (bundled with Node) | `npm -v` |
| **Git** | optional, for version control | `git --version` |
| **VS Code** | latest | — |

Download Node.js from <https://nodejs.org> (choose the LTS installer). No other global tools are
required — Next.js, TypeScript, Tailwind and ESLint are installed locally by `npm install`.

Recommended VS Code extensions (optional but useful):

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **Prettier** (`esbenp.prettier-vscode`)

---

## 2. Step-by-step setup in VS Code

1. **Unzip** `archopt-frontend.zip` to a folder of your choice, e.g. `C:\Projects\archopt` or
   `~/Projects/archopt`.
2. **Open VS Code** → *File → Open Folder…* → select the unzipped `archopt` folder.
3. **Open the integrated terminal**: *Terminal → New Terminal* (or `` Ctrl+` ``).
   Make sure the prompt is inside the `archopt` folder (it should show `package.json` in the
   Explorer).
4. **Install dependencies** — in the terminal run:
   ```bash
   npm install
   ```
   This downloads Next.js, React, Tailwind CSS, Lucide icons and the dev tooling into
   `node_modules/` (1–3 minutes on first run).
5. **Start the development server**:
   ```bash
   npm run dev
   ```
   Wait for `✓ Ready` and open <http://localhost:3000> in your browser. The landing page loads;
   click **Explore Workspace** (or **Sign In**) to enter the application.
6. **Edit and see changes live** — any file saved under `src/` hot-reloads in the browser.
7. **Stop the server** with `Ctrl+C` in the terminal.

---

## 3. Terminal commands

Run these from the project root (the folder containing `package.json`).

```bash
# 1. Install dependencies (first time only, or after pulling changes)
npm install

# 2. Run the development server with hot reload → http://localhost:3000
npm run dev

# 3. Type-check the whole project (no output = success)
npm run type-check

# 4. Lint with ESLint (Next.js + React Compiler rules)
npm run lint

# 5. Create an optimized production build (outputs to .next/)
npm run build

# 6. Serve the production build → http://localhost:3000
npm run start
```

To use a different port: `npm run dev -- -p 4000` or `npm run start -- -p 4000`.

---

## 4. What is in the app

### Landing / marketing (`/`, `/features`, `/workflow`, `/technology`, `/about`)

- Top navigation with Features · Workflow · Technology · About, **Sign In** and **Get Started**
  buttons, and a structured footer (© 2026 ArtCohort).
- **Sign In** and **Get Started** open fully interactive dialogs: validation, password visibility
  toggles, remember-me, forgot-password flow, terms acceptance, loading / error / success states and
  a link to switch between the two. Authentication is simulated in the browser
  (`src/components/providers/AuthProvider.tsx`) — no auth service is connected.
- Content follows the project proposal: the seven-stage pipeline (Requirements → Graph Model →
  Candidate Generation → Constraint Checking → Optimization → Evaluation → Visualization), the
  weighted cost function, the Next.js → REST API → FastAPI → C++20 → PostgreSQL/Redis architecture,
  the MVP scope and the roadmap. Planned items (simulated annealing, genetic algorithm, parallel
  evaluation, Redis jobs, LLM requirement parser, accessibility/daylight modules) are labelled as
  planned, not implemented.

### Application (`/dashboard` … `/settings`)

Fixed sidebar + sticky top bar (global search with keyboard navigation, notifications, user menu).
Each page has its own layout and working interactions:

| Route | Highlights |
| --- | --- |
| `/dashboard` | KPI tiles, efficiency trend, space-utilization donut, live-updating optimization jobs, filtered recent projects, weekly timeline, quick actions |
| `/projects` | Search, type/status filters, sorting, grid/list views, pagination, **New Project** modal with validation, row actions (duplicate, archive, delete with confirmation) |
| `/space-planner` | Planning settings form, adjacency weights, simulated layout generation, Layout / Zoning / Circulation views, client-side constraint checking (overlap, boundary, minimum dimensions), import JSON plan |
| `/optimization` | Goals, configurable cost weights, algorithm selection with honest availability labels, simulated job progress, before/after floor plans, results and insights |
| `/layouts` | Candidate layout cards with filters, detail modal, comparison table with best-value highlighting, per-layout space distribution |
| `/analytics` | Trend, distribution and comparison charts, sortable performance table, CSV export |
| `/workspace` | Floor-plan editor: select rooms, edit properties, add/delete rooms, undo/redo (Ctrl+Z / Shift+Ctrl+Z), live constraint validation, save to local storage, export SVG/JSON |
| `/workspace/collaborate` | Members and access roles, share/invite dialogs, comments, activity, versions |
| `/workspace/versions` | Version history, side-by-side comparison with added/removed/modified tinting, restore/download/delete |
| `/design-lab` | Design board with reactive elevation illustration, materials, isometric 3D preview from layout geometry, render queue, lighting and facade composers |
| `/team` | Members, roles & permissions matrix, project assignment, workload chart, activity |
| `/settings` | Account, preferences, workspace defaults, team access, integrations (honest "not connected" states), notifications, appearance with live accent colour |

All charts and floor plans are dependency-free SVG components (`src/components/charts`,
`src/components/floorplan`).

---

## 5. Project structure

```
archopt/
├─ src/
│  ├─ app/                      # Next.js App Router
│  │  ├─ layout.tsx             # root layout, fonts, providers
│  │  ├─ globals.css            # Tailwind v4 + design tokens
│  │  ├─ (marketing)/           # landing, features, workflow, technology, about
│  │  └─ (app)/                 # authenticated-style workspace pages (sidebar + top bar)
│  ├─ components/
│  │  ├─ ui/                    # Button, Card, Input, Modal, Tabs, Dropdown, Badge, Table…
│  │  ├─ charts/                # LineChart, BarChart, DonutChart, Sparkline, HBarList
│  │  ├─ floorplan/             # FloorPlan SVG renderer + ZoneLegend
│  │  ├─ layout/                # AppShell, Sidebar, Topbar, PageHeader
│  │  ├─ marketing/             # MarketingNav, Footer, landing sections
│  │  ├─ auth/                  # Sign In / Get Started dialogs
│  │  ├─ providers/             # Auth, Projects, Toast, AuthDialog contexts
│  │  └─ pages/                 # page-level client components
│  └─ lib/
│     ├─ types.ts               # domain types (Room, Plot, Layout, Project…)
│     ├─ geometry.ts            # rectangle intersection, boundary & dimension checks
│     ├─ validation.ts          # form validators
│     ├─ navigation.ts          # sidebar / nav configuration
│     ├─ utils.ts               # cn(), formatters
│     └─ mock/                  # sample data (clearly separated from logic)
├─ public/
├─ next.config.ts
├─ postcss.config.mjs
├─ tsconfig.json
├─ eslint.config.mjs
└─ package.json
```

---

## 6. Design system

- **Palette** — background `#F7F9FD`, cards `#FFFFFF`, primary `#1649D8`, secondary `#3769E8`,
  highlight `#EAF1FF`, primary text `#101B3C`, secondary text `#596780`, borders `#D7E0F0`.
  Tokens are declared once in `src/app/globals.css` (`@theme`) and used as Tailwind classes
  (`bg-bg`, `bg-surface`, `text-ink`, `text-muted`, `border-line`, `bg-highlight`, …).
- **Geometry** — rectangular components: visible 1 px borders, 2–4 px radii
  (`rounded-xs|sm|md`), flat fills, subtle shadows. No pills, glassmorphism or gradients.
- **Typography** — Inter (loaded at runtime from Google Fonts with a system-font fallback so the
  build never depends on network access).
- **Icons** — Lucide React at consistent 16–20 px sizes.
- **Accessibility** — keyboard-operable tabs, menus, dialogs (focus trap, Escape, focus
  restoration), labelled icon buttons, visible focus rings, `aria-*` state on toggles and sort
  headers.

---

## 7. Mock data vs. application logic

- Everything under `src/lib/mock/` is **sample data** (projects, layouts, team, activity, versions,
  analytics, design-lab content). The UI labels it as *sample project data — illustrative values,
  not measured results*. The example metrics from the proposal (87 % / 92 % / 89 % / 94 %) are
  shown only as illustrative values.
- State that users change in the session (new projects, comments, versions, settings, editor
  layouts) lives in React context / component state; a few things persist to `localStorage`
  (session, workspace layout, settings) so they survive a refresh.
- `src/lib/geometry.ts` implements the simplest checks (rectangle intersection, plot boundary,
  minimum dimensions, usable/built area, adjacency satisfaction) so the editor can validate
  edits immediately. The authoritative constraint checking, graph analysis and optimization belong
  to the C++20 engine behind the FastAPI backend.

---

## 8. Connecting a real backend

1. Create `src/lib/api/` with typed fetch helpers (`getProjects`, `createProject`,
   `runOptimization`, …) pointing at the FastAPI base URL (e.g. `NEXT_PUBLIC_API_URL` in
   `.env.local`).
2. Replace the seed data in `ProjectsProvider` and the simulated timers in the Space Planner /
   Optimization pages with those calls.
3. Replace `signIn` / `signUp` in `AuthProvider` with real auth requests and store the returned
   token securely.
4. Keep the components unchanged — they only depend on the types in `src/lib/types.ts`.

---

## 9. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `'next' is not recognized` / `next: not found` | `npm install` has not completed. Run it again from the project root. |
| Port 3000 already in use | `npm run dev -- -p 4000` |
| Blank page after upgrading Node | Delete `node_modules` and `.next`, then `npm install` again. |
| Fonts look different | Inter is fetched from Google Fonts at runtime; offline, the system font stack is used. Nothing else changes. |
| `Bus error` or crash on `npm run build` (Linux) | The native SWC binary was corrupted during install: `rm -rf node_modules/@next && npm install`. |

---

© 2026 ArtCohort. All rights reserved.
