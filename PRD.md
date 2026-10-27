# Product Requirements Document (PRD)

## Project Title
Celebration & Event Planner (GenAI-Powered)

## Challenge Alignment
PromptWars Virtual Challenge 05: Celebration & Event Planner

## Objective
Build an agentic, GenAI-driven event planning web application that assists users in organizing weddings, birthdays, anniversaries, and community gatherings by generating tailored budgets, timelines, vendor checklists, and creative event themes based on user constraints.

## Target Audience
- Individuals planning personal events (weddings, birthdays, family reunions).
- Community organizers planning local gatherings or corporate meetups.

## Key Features

### 1. Event Onboarding & Input Parsing
- Dynamic form capturing Event Type, Total Budget, Guest Count, Target Date, Location Type, and Theme Preferences.
- Context validation and graceful fallback for missing or ambiguous inputs.

### 2. GenAI Event Engine (Powered by Gemini API)
- **Smart Budget Allocation:** Generates itemized spending breakdowns (Venue, Catering, Decor, Entertainment, Logistics) tailored to total budget and guest count.
- **Dynamic Master Timeline:** Produces a countdown schedule (Months, Weeks, and Day-of timeline).
- **Vendor Checklist:** Actionable, categorized task list with priority status and recommended vendor types.
- **Personalized Creative Ideas:** Custom themes, invitation phrasing, activity suggestions, and color palettes.

### 3. Interactive Management Dashboard
- Real-time budget adjustment sliders with visual feedback graphs.
- Toggleable task checklists persisted locally or via Firebase Firestore.
- Export options (PDF / JSON download for event summaries).

## Non-Functional Requirements
- **Performance:** Initial dashboard load under 2 seconds; GenAI generation response rendered within 3.5 seconds.
- **Accessibility:** Full WCAG 2.1 AA compliance (ARIA landmarks, high contrast, keyboard navigation).
- **Security:** Zero client-side API key exposure; sanitized AI response rendering.
- **Repo Constraints:** Size < 10 MB, single `main` branch, 100% public repository.