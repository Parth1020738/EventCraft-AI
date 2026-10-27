# EventCraft AI — Celebration & Event Planner
> **PromptWars Virtual Challenge 05: Celebration & Event Planner**  
> An agentic, GenAI-driven event coordination, dynamic scenario recalculation, and budget optimization application built with React 19, Tailwind CSS v4, and Google Gemini API.

---

## 1. Project Overview & Challenge Alignment

**EventCraft AI** is a responsive web application that turns chaotic, fragmented event planning into an interconnected, intelligent orchestration. Developed strictly according to the **PromptWars Challenge 05 Explainer Seminar** specifications, the platform recognizes that event management is an interconnected web of decisions — not a flat checklist.

### Core Explainer Seminar Capabilities:
1. **8-Dimension Comprehensive Onboarding:** Captures celebration occasion, total planned budget, guest headcount, date/timing, desired atmosphere/experience, non-negotiable must-haves, accessibility accommodations, and cultural customs.
2. **Dynamic Scenario Recalculator:** Live "what-if" simulations (adjusting headcount or budget limits) dynamically rebalance existing plans without forcing users to restart from scratch.
3. **Trade-Off Decision Engine:** Structured reallocation strategies (e.g., boosting gastronomy by reducing disposable decor, or activating an inflation buffer against vendor price surges).
4. **Sequential Task Dependencies:** Chronological timeline showing prerequisite chains (e.g., securing the venue and locking dates before booking photography or sending invitations).
5. **Vendor Transparency & Real-World Quoting:** Figures are explicitly labeled as **Estimated Assumptions** based on regional averages rather than claimed confirmed quotes, equipped with category-specific **Vendor Verification Questions** for accurate real-world bidding.
6. **Strictly Responsive Web Application:** Zero native Android wrappers or mobile-only limitations; fully responsive across mobile, tablet, and desktop viewports.

---

## 2. Core Architecture & GenAI Approach

### System Architecture Diagram
```
┌────────────────────────────────────────────────────────┐
│                   User Interface                       │
│  (8-Dimension Accessible Event Wizard / Dashboard UI)  │
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
┌───────────────────────────┐      ┌──────┴───────────────────────────┐
│       gemini.js           │      │ Interactive Dashboard Widgets    │
│  @google/generative-ai    │      │  • Scenario Recalculator (What-If│
│  - JSON Schema Mode       ├─────►│  • Smart Budget Sliders          │
│  - Context Engineering    │      │  • Trade-Off Advisor Engine      │
│  - Fail-Safe Fallback     │      │  • Master Countdown & Timeline   │
└───────────────────────────┘      │  • Vendor Checklist + Questions  │
                                   │  • Theme Palette & Copy Copier   │
                                   └──────────────────────────────────┘
```

### Structured JSON Schema Enforcement
To prevent unpredictable raw markdown regex failures, `src/services/gemini.js` leverages the native Gemini SDK JSON schema mode (`responseMimeType: 'application/json'`):
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
Adhering to hackathon zero-downtime standards:
1. **Unconfigured Key Graceful Degradation:** If `VITE_GEMINI_API_KEY` is omitted, the engine automatically routes to `getFallbackEventPlan()` with deterministic, high-fidelity data tailored to the user's specific inputs.
2. **Network/Rate Limit Recovery:** If API quotas are exceeded or connectivity drops, the user is presented with an accessible recovery card offering **"Retry with AI"** or **"Use Offline Blueprint"**.

---

## 3. Key Feature Walkthrough

### 1. 8-Dimension Onboarding Wizard (`EventWizard.jsx`)
- **Step 1 (Celebration Essentials):** Celebration occasion selector (Wedding, Birthday, Anniversary, Community Event, Corporate Gala), validated future date picker, guest count input with quick increments (`+25`, `+50`, `+100`, `+250`).
- **Step 2 (Budget & Venue Dynamics):** Currency selector (`USD $`, `INR ₹`, `EUR €`, `GBP £`), total budget input, and venue setting cards (Indoor Hall, Outdoor Garden, Hybrid).
- **Step 3 (Aesthetics, Must-Haves & Inclusivity):**
  - *Desired Experience:* Intimate & Heartfelt, High-Energy & Vibrant, Luxury & Formal, Casual & Festive, Artistic & Bohemian.
  - *Theme Presets & Custom Input:* Royal Elegance, Rustic Botanical, Sunset Bohemian, Modern Monochrome, Retro Glamour.
  - *Non-Negotiable Must-Haves:* Multi-select pills for Professional Photography, Open Bar, Live DJ/Band, Drone Media, Photo Booth, Multi-Tier Cake, Late-Night Snacks.
  - *Accessibility & Dietary Needs:* Wheelchair / Step-Free Access, Vegan/Celiac Friendly, Quiet Sensory Zone, Elderly-Friendly Seating, Halal/Kosher Certified.
  - *Cultural Preferences:* Traditional Ceremonies, Bilingual MC, Multi-Faith Inclusivity, Heritage Decor Accents.

### 2. Dynamic Scenario Recalculator (`ScenarioRecalculator.jsx`)
- Allows organizers to simulate "what-if" situations (e.g., headcount surge from 75 to 110 guests, or budget adjustment).
- Uses sensitivity weighting (`src/utils/budgetCalculator.js`) where catering scales dynamically with guest count while fixed venue costs scale moderately.
- Recalculates the active plan without forcing a fresh restart.

### 3. Trade-Off Decision Engine (`TradeOffAdvisor.jsx`)
- Empowers organizers to rebalance allocations when constraints tighten:
  - **Gastronomy Focus:** +8% Catering & Beverages / -5% Decor / -3% Logistics.
  - **Media Focus:** +7% Entertainment & Photo / -4% Decor / -3% Contingency.
  - **Venue Focus:** +8% Venue & Facilities / -4% Decor / -2% DJ / -2% Favors.
  - **Inflation Buffer:** +8% Contingency Reserve / -3% Venue / -3% Catering / -2% Decor.
- Always preserves 100% mathematical budget balance.

### 4. Interactive Budget Allocation (`BudgetBreakdown.jsx`)
- Live sliders for Venue, Catering, Decor, Entertainment, Logistics.
- Real-time per-guest cost indicator (`~$X / guest`).
- Explicit **Estimated Assumptions** disclaimer based on regional averages.

### 5. Master Countdown & Itinerary (`CountdownTimeline.jsx`)
- Real-time ticking countdown clock (Days, Hours, Minutes, Seconds).
- Phase filtering across planning horizons.
- **Sequential Task Dependency Badges:** Visual indicator chains detailing prerequisites (e.g. Venue & Date lock required before booking photography or dispatching invites).

### 6. Vendor Coordination & Quoting Checklist (`VendorChecklist.jsx`)
- Three-state progress tracking: `To Do` → `In Progress` → `Completed`.
- Real-time keyword search and priority filtering (High, Medium, Low).
- **Vendor Quoting Verification Questions:** Expandable checklists for Venue, Catering, Media, Decor, Entertainment, and Logistics to ask vendors during real-world quoting.
- Vendor transparency disclaimer banner.

### 7. Creative Themes & Export Tools (`ThemeShowcase.jsx`)
- One-click click-to-copy HEX color palette.
- Copyable invitation phrasing snippets.
- JSON plan export and printable browser layout.

---

## 4. Key Assumptions & Heuristic Framework

| Dimension | Default Heuristic / Baseline | Rationale |
| :--- | :--- | :--- |
| **Budget Split** | Venue (30%), Catering (35%), Decor (15%), Entertainment (12%), Logistics (8%) | Industry benchmark for luxury celebrations and weddings. |
| **Sensitivity Weighting** | Catering (0.7), Venue (0.4), Logistics/Decor (0.1) | Catering varies directly with headcount; decor remains mostly fixed. |
| **Minimum Budget** | $100 (or currency equivalent) | Prevents unrealistic micro-budget generation. |
| **Guest Threshold** | Max 100,000 | Prevents numerical overflow. |
| **Supported Currencies** | USD (`$`), INR (`₹`), EUR (`€`), GBP (`£`) | Accommodates international users and global pricing contexts. |
| **Data Storage** | Browser `localStorage` with fail-safe error isolation | Zero server latency; persists plans across reloads without tracking cookies. |

---

## 5. Security, Accessibility & Repository Constraints

### Security Standards
- **Zero Hardcoded Secrets:** Environment variables accessed exclusively via `import.meta.env.VITE_*`.
- **Private Browsing Shield:** All `localStorage` operations wrapped in `try...catch` blocks to prevent incognito quota exceptions.
- **XSS Protection:** React JSX automatic escaping on all rendered parameters.

### Accessibility Standards (WCAG 2.1 AA)
- Semantic HTML landmarks: `<header>`, `<main>`, `<section>`, `<nav>`, `<ol>`.
- Accessible form controls: Explicit `<label htmlFor="...">`, `id`, `aria-invalid`, `aria-describedby`.
- Live announcements: `aria-live="polite"` on generation loading skeletons, `role="alert"` on errors.
- Keyboard navigation: Full `Tab`, `Enter`, `Space` support with high-contrast `:focus-visible` rings.

### Repository Optimization
- **Size Limitation:** Strictly under 1 MB total footprint (well below 10 MB limit).
- **Single Branch Rule:** 100% committed directly to `main` with semantic history.
- **Strict `.gitignore`:** Excludes `node_modules/`, `dist/`, `build/`, `.env`, and logs.

---

## 6. Automated Test Suite Results

EventCraft AI features 37 comprehensive unit tests verifying data validation, financial calculations, scenario updates, trade-offs, and Gemini fail-safe fallbacks:

```
 RUN  v4.1.12 EventCraft-AI

 ✓ src/utils/validators.test.js (17 tests)
 ✓ src/utils/budgetCalculator.test.js (18 tests)
 ✓ src/services/gemini.test.js (2 tests)

 Test Files  3 passed (3)
      Tests  37 passed (37)
   Start at  19:25:54
   Duration  2.29s (100% passing)
```

---

## 7. Submission Artifacts & Deliverables

### A. LinkedIn Post Template Outline

```markdown
🚀 Exciting Project Announcement: Introducing EventCraft AI! 💍🎉

Traditional event planning is stressful and fragmented. Organizers juggle spreadsheets, guess vendor prices, and restart from scratch whenever guest numbers change.

For PromptWars Virtual Challenge 05, I built EventCraft AI — an intelligent, GenAI-orchestrated celebration planner that treats event design as an interconnected web of real-world decisions!

✨ What makes EventCraft AI unique?
🔹 8-Dimension Onboarding: Captures budget, headcount, timing, desired vibe, must-haves, accessibility, and cultural traditions.
🔹 Dynamic Scenario Recalculator: What happens if 35 extra guests RSVP? Test what-if scenarios that dynamically rebalance catering and venue budgets without resetting your plan.
🔹 Trade-Off Decision Engine: Reallocate funds with confidence (e.g., Gourmet Dining vs. Media Focus vs. Inflation Contingency Buffers).
🔹 Sequential Task Dependencies: Avoid premature commitments with chronological prerequisite chains.
🔹 Vendor Transparency: Clear "Estimated Assumptions" labels and built-in "Vendor Verification Questions" for confident real-world quoting.
🔹 Zero Downtime Architecture: Powered by Google Gemini 1.5 Flash structured JSON mode with deterministic offline fallback blueprints.

Built with React 19, Tailwind CSS v4, and Google Gemini API. 100% WCAG 2.1 AA accessible and verified with 37 automated tests!

🔗 Live App: [Insert Deployed URL]
💻 GitHub Repository: https://github.com/Parth1020738/EventCraft-AI
🎥 4-Minute Video Demo: [Insert Video Link]

Huge thanks to the PromptWars team for an incredible challenge!

#PromptWars #GenAI #GoogleGemini #React19 #WebDevelopment #FullStack #EventCraftAI #EventPlanning
```

---

### B. 4-Minute Video Walkthrough Script Outline

| Timestamp | Phase / Screen | Key Visuals & Actions | Narration Script Breakdown |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:45** | **Introduction & Problem Context** | Hero header, empty state view | *"Welcome to EventCraft AI, created for PromptWars Challenge 05. Traditional event planning is broken because decisions are interconnected: changing guest counts breaks your catering budget, and hiring photographers before locking your venue leads to scheduling disasters. EventCraft AI turns this chaos into an intelligent, cohesive roadmap."* |
| **0:45 - 1:45** | **8-Dimension Wizard & GenAI Engine** | Navigating Steps 1, 2, and 3 | *"Let's plan a milestone celebration. In Step 1, we select Wedding, our target date, and 75 guests. In Step 2, we set a $8,000 budget and choose an Indoor Banquet. In Step 3, we capture desired experience — Intimate & Heartfelt, Royal Elegance theme, select our Must-Haves like Professional Photography, and add Accessibility needs. Clicking Generate calls Google Gemini 1.5 Flash using structured JSON mode, with a deterministic fallback guaranteeing zero downtime."* |
| **1:45 - 2:45** | **Dashboard, Sliders & Scenario Recalculator** | Overview tab, sliders, Scenario widget | *"Here is our comprehensive event plan. In the Budget Allocations tab, our interactive sliders dynamically rebalance funds. But what if our guest list surges to 105 attendees? Instead of restarting, our Dynamic Scenario Recalculator simulates the what-if: catering scales dynamically while fixed decor remains stable, seamlessly updating the live plan."* |
| **2:45 - 3:30** | **Trade-Off Engine & Vendor Transparency** | Trade-Off Advisor tab, Vendor Checklist tab | *"Now, what if costs rise? Our Trade-Off Engine lets us apply strategies like 'Gastronomy Focus' or 'Inflation Buffer' with one click, maintaining 100% balance. Looking at our Vendor Checklist, notice our transparency disclaimer: all prices are explicitly labeled as Estimated Assumptions based on regional averages. Expanding each category reveals key verification questions to ask vendors during quoting."* |
| **3:30 - 4:00** | **Timeline Dependencies, Testing & Conclusion** | Master Itinerary tab, terminal test view | *"Our Master Itinerary features a live countdown clock and sequential prerequisite chains ensuring venue lock precedes vendor booking. EventCraft AI is built with React 19, Tailwind CSS v4, achieves WCAG AA compliance, and passes 37 automated unit tests. Thank you for watching!"* |

---

## 8. Local Setup & Verification Guide

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
# Add VITE_GEMINI_API_KEY if available (deterministic offline blueprint activates automatically if omitted)

# 4. Run automated unit test suite (37 tests)
npm run test

# 5. Build for production verification
npm run build

# 6. Start local development server
npm run dev
```

---

## 9. Tech Stack Summary

- **Framework:** React 19 + Vite
- **Styling:** Vanilla CSS + Tailwind CSS v4 (`@tailwindcss/vite`)
- **Typography:** Inter (`font-sans`) + Plus Jakarta Sans (`font-heading`)
- **Icons:** Lucide React
- **AI Engine:** Google Gemini API (`@google/generative-ai`) via structured JSON schema mode
- **Cloud Backend:** Firebase Auth & Firestore client wrappers
- **Testing:** Vitest + React Testing Library + jsdom
