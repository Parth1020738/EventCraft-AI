# EventCraft AI — Celebration & Event Planner
> **PromptWars Virtual Challenge 05: Celebration & Event Planner**  
> An agentic, GenAI-driven event coordination and budget optimization application built with React 19, Tailwind CSS v4, and Google Gemini API.

---

## 1. Project Overview & Challenge Alignment

**EventCraft AI** transforms fragmented, stressful event organization into an intuitive, AI-orchestrated experience. Designed for individuals and community organizers planning weddings, milestone birthdays, anniversaries, and corporate galas, the application accepts user constraints (guest count, budget, location type, theme) and produces:

- **Smart Budget Allocations** with interactive dynamic recalculation sliders.
- **Master Countdowns & Multi-Phase Itineraries** tracking months-out, weeks-out, and day-of execution.
- **Actionable Vendor Checklists** with three-state status tracking and custom task additions.
- **Personalized Creative Themes** featuring interactive HEX color swatches and invitation phrasing copy utilities.

---

## 2. Core Architecture & GenAI Approach

### System Architecture Diagram
```
┌────────────────────────────────────────────────────────┐
│                   User Interface                       │
│    (3-Step Accessible Event Wizard / Interactive UI)   │
└──────────────────────────┬─────────────────────────────┘
                           │ (Validated Parameters)
                           ▼
┌────────────────────────────────────────────────────────┐
│               Client-Side Validation                   │
│         (src/utils/validators.js: Date, Guest, Budget) │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                  EventContext Store                    │
│      (src/context/EventContext.jsx + LocalStorage)     │
└──────────────┬──────────────────────────▲──────────────┘
               │                          │
        (Generate Request)          (Cached State)
               ▼                          │
┌───────────────────────────┐      ┌──────┴──────────────┐
│       gemini.js           │      │ Interactive         │
│  @google/generative-ai    │      │ Dashboard Widgets   │
│  - JSON Schema Mode       ├─────►│  • Budget Sliders   │
│  - Context Engineering    │      │  • Live Countdown   │
│  - Fail-Safe Fallback     │      │  • Vendor Checklist │
└───────────────────────────┘      │  • Theme Showcase   │
                                   └─────────────────────┘
```

### Structured JSON Schema Enforcement
To eliminate raw markdown regex parsing failures, the Gemini integration wrapper (`src/services/gemini.js`) leverages the native Gemini SDK JSON mode:
```javascript
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
  },
  systemInstruction: `You are EventCraft AI, an expert event planner and financial coordinator...`
});
```

### Deterministic Fail-Safe Resilience
Adhering to strict hackathon reliability standards, EventCraft AI guarantees zero downtime:
1. **Unconfigured Key Graceful Degradation:** If `VITE_GEMINI_API_KEY` is omitted, the engine automatically routes to `getFallbackEventPlan()` with deterministic, high-fidelity data tailored to the user's input.
2. **Network/Rate Limit Recovery:** If API quotas are exceeded or network connectivity drops, the user is presented with an accessible recovery card offering **"Retry with AI"** or **"Use Offline Blueprint"**.

---

## 3. Key Feature Walkthrough

### 1. Multi-Step Accessible Event Wizard (`EventWizard.jsx`)
- **Step 1 (Celebration Essentials):** Interactive radio cards for Wedding, Birthday, Anniversary, Community Event, and Corporate Gala; validated date picker (rejects past dates); guest count input with quick presets (`+25`, `+50`, `+100`, `+250`).
- **Step 2 (Budget & Venue Dynamics):** Currency selector (`USD $`, `INR ₹`, `EUR €`, `GBP £`), budget input, and venue type selectors (Indoor Hall, Outdoor Garden, Hybrid).
- **Step 3 (Aesthetics & Atmosphere):** Curated theme tags (*Royal Elegance*, *Rustic Botanical*, *Sunset Bohemian*, *Modern Monochrome*), custom theme input, and special dietary/audio notes.
- **Accessibility:** `aria-current="step"`, semantic `<label htmlFor="...">`, explicit IDs, and full keyboard navigation.

### 2. Smart Budget Breakdown (`BudgetBreakdown.jsx`)
- **Live Interactive Sliders:** Move category sliders (Venue, Catering, Decor, Entertainment, Logistics) to dynamically rebalance funds.
- **Real-Time Percentage Normalization:** Powered by pure mathematical utilities (`src/utils/budgetCalculator.js`).
- **Multi-Segment Distribution Bar:** Color-coded visualization showing the relative proportion of each budget category.
- **Coordinator Advice Tooltips:** Actionable advice on vendor negotiation and cost-saving opportunities.

### 3. Master Countdown & Itinerary (`CountdownTimeline.jsx`)
- **Live Countdown Clock:** Real-time ticking countdown showing Days, Hours, Minutes, and Seconds until the target date.
- **Phase Filtering:** Segment schedule by preparation phases (e.g. Phase 1: 2-3 Months Out, Phase 2: 1 Month Out, Phase 3: Day-Of).
- **Milestone Checkmarks:** Toggleable completion checkmarks on individual schedule milestones.

### 4. Actionable Vendor & Task Checklist (`VendorChecklist.jsx`)
- **Search & Filter:** Instant search query filter and priority toggles (All, High, Medium, Low).
- **Three-State Progressions:** Click any task to cycle: `To Do` → `In Progress` → `Completed`.
- **Inline Custom Task Creation:** Add custom tasks directly with category, priority, and estimated cost.
- **Readiness Metric:** Visual progress bar tracking completed vs. remaining tasks.

### 5. Creative Themes & Export Tools (`ThemeShowcase.jsx`)
- **Click-to-Copy HEX Palette:** Instant clipboard copy for aesthetic color swatches with visual confirmation.
- **Invitation Phrasing:** Curated wording suggestions with one-click copy buttons.
- **Plan Export Options:** Download formatted `.json` event plan or trigger browser print styling.

---

## 4. Key Assumptions & Heuristic Framework

| Dimension | Default Heuristic / Baseline | Rationale |
| :--- | :--- | :--- |
| **Budget Split** | Venue (30%), Catering (35%), Decor (15%), Entertainment (12%), Logistics (8%) | Industry benchmark for luxury celebrations and weddings. |
| **Minimum Budget** | $100 (or equivalent in selected currency) | Ensures realistic minimum planning parameters. |
| **Guest Threshold** | Max 100,000 | Protects against unrealistic input overflow. |
| **Supported Currencies** | USD (`$`), INR (`₹`), EUR (`€`), GBP (`£`) | Accommodates global international users and localizations. |
| **Data Storage** | Browser `localStorage` with fail-safe error isolation | Zero server latency; persists plans across page reloads. |

---

## 5. Security, Accessibility & Repository Constraints

### Security Safeguards
- **Zero Hardcoded Secrets:** All credentials access environment variables exclusively via `import.meta.env.VITE_*`.
- **Private Browsing Safeguard:** All `localStorage` read/write operations are isolated in `try...catch` blocks to prevent incognito quota exceptions.

### Accessibility Standards (WCAG 2.1 AA)
- Semantic HTML landmarks: `<header>`, `<main>`, `<section>`, `<nav>`, `<ol>`.
- Accessible form controls: Explicit `<label htmlFor="...">`, `aria-invalid`, `aria-describedby`.
- Live announcements: `aria-live="polite"` on generation loading skeletons, `role="alert"` on errors.
- Visual contrast: Meets high-contrast ratios using Slate 900 headers and Indigo 600 interactive elements.

### Repository Optimization
- **Size Limitation:** Strictly under 1 MB total repository footprint (well below the 10 MB limit).
- **Single Branch Rule:** 100% committed directly to `main` with clean semantic history.
- **Strict `.gitignore`:** Excludes `node_modules/`, `dist/`, `build/`, `.env`, and temporary logs.

---

## 6. Local Setup, Testing & Verification Instructions

### Prerequisites
- Node.js 18+ or 20+
- npm 9+ or 10+

### Step-by-Step Installation

```bash
# 1. Clone repository
git clone https://github.com/Parth1020738/EventCraft-AI.git
cd EventCraft-AI

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment variables
cp .env.example .env.local
# Add your VITE_GEMINI_API_KEY if available (Fallback blueprint works offline if omitted)

# 4. Run automated unit test suite (Vitest + React Testing Library)
npm run test

# 5. Build for production verification
npm run build

# 6. Start local development server
npm run dev
```

---

## 7. Automated Test Suite Results

EventCraft AI includes comprehensive unit tests verifying data validation and financial calculations:

```
 RUN  v4.1.12 EventCraft-AI

 ✓ src/utils/budgetCalculator.test.js (11 tests)
 ✓ src/utils/validators.test.js (17 tests)

 Test Files  2 passed (2)
      Tests  28 passed (28)
```

---

## 8. Tech Stack Summary

- **Framework:** React 19 + Vite
- **Styling:** Vanilla CSS + Tailwind CSS v4 (`@tailwindcss/vite`)
- **Typography:** Inter (`font-sans`) + Plus Jakarta Sans (`font-heading`)
- **Icons:** Lucide React
- **AI Engine:** Google Gemini API (`@google/generative-ai`) via structured JSON schema
- **Cloud Backend:** Firebase Auth & Firestore client wrappers
- **Testing:** Vitest + React Testing Library + jsdom
