# System Architecture & Technical Specification

## Technical Stack
- **Frontend Framework:** React 18+ (Vite)
- **Styling:** Tailwind CSS + Lucide React Icons
- **State Management:** React Context API + Hooks
- **Backend / Database:** Firebase (Firestore for event persistence, Auth for user accounts)
- **AI Integration:** Google Gemini API (`@google/generative-ai` SDK) via structured JSON outputs
- **Testing:** Vitest + React Testing Library
- **Deployment:** Vercel / Firebase Hosting

## Directory Structure (for github make like that for local)
├── .github/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/          # Buttons, Inputs, Cards, ARIA wrappers
│   │   ├── dashboard/       # Budget, Timeline, Vendor Checklist widgets
│   │   ├── forms/           # Event Wizard Form components
│   │   └── ui/              # Modal, Toast, Loading Skeletons
│   ├── context/             # EventContext, AuthContext
│   ├── services/            # gemini.js, firebase.js
│   ├── utils/               # budgetCalculator.js, formatters.js, validators.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── Architecture.md
├── Design.md
├── Memory.md
├── Phases.md
├── PRD.md
├── README.md
├── Rules.md
├── package.json
└── vite.config.js

## Data Flow
1. **User Input** -> `EventForm.jsx` captures parameters and validates data.
2. **AI Request** -> `gemini.js` constructs a structured prompt enforcing JSON output schemas.
3. **Response Parsing** -> Response validated by `validators.js` and loaded into `EventContext`.
4. **State Persistence** -> Plan cached to Firestore / LocalStorage.
5. **Dashboard Render** -> Components render Budget Charts, Checklist, and Timeline reactively.