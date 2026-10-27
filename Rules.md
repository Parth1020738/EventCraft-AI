# AI Development Boundaries & Rules

## General Constraints
1. **Repository Size:** Strictly keep repository size < 10 MB. Never commit build outputs (`dist/`, `build/`), `.env`, or media assets.
2. **Branch Management:** Commit directly to `main` branch only. Do NOT create secondary feature branches.
3. **API Security:** NEVER hardcode API keys or Firebase secrets in source code. Access secrets strictly via `import.meta.env.VITE_*`.

## Code Quality Standards
- Use functional React components with standard React Hooks.
- Prefer modular, single-responsibility files (max 250 lines per file).
- Enforce strict prop-types or TypeScript interfaces where applicable.
- All exported functions must include concise JSDoc comments.

## GenAI Rules
- Request structured JSON responses from Gemini API using JSON mode / system instructions.
- Always implement fallback static logic in case of network errors or API rate limits.
- Sanitize all model-generated raw strings before rendering to prevent XSS.

## Accessibility Rules
- Every form control must have an associated `<label>` or `aria-label`.
- Interactive elements must be fully focusable and navigable via `Tab` and `Enter/Space`.
- Semantic HTML tags (`<main>`, `<header>`, `<nav>`, `<section>`, `<article>`) must be used instead of nested generic `<div>` tags.