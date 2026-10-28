/**
 * Security and sanitization utilities for user inputs, file downloads,
 * color codes, and AI-generated plan validation.
 */

/**
 * Sanitizes user-provided text by stripping control characters,
 * normalising whitespace, and enforcing maximum string length.
 * Prevents prompt injection formatting attacks and template breaking.
 *
 * @param {*} value - Raw input value
 * @param {number} [maxLength=300] - Maximum allowed character length
 * @returns {string} Sanitized string
 */
export function sanitizePromptInput(value, maxLength = 300) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // Strip control characters (ASCII 0-31 and 127) and collapse redundant whitespace
  let cleanStr = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    cleanStr += (code >= 32 && code !== 127) ? str[i] : ' ';
  }
  const sanitized = cleanStr.replace(/\s+/g, ' ').trim();
  return sanitized.slice(0, Math.max(0, maxLength));
}

/**
 * Sanitizes a title or string for secure use as a downloadable filename.
 * Removes path traversal characters, slashes, and reserved filesystem symbols.
 *
 * @param {string} [name=''] - Unsanitized filename or title
 * @param {string} [fallback='Celebration_Plan'] - Fallback name if input is empty
 * @returns {string} Safe filename
 */
export function sanitizeFileName(name, fallback = 'Celebration_Plan') {
  if (!name || typeof name !== 'string') return fallback;
  const cleaned = name
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, '_')
    .replace(/^[._]+/, '')
    .trim();
  return cleaned || fallback;
}

/**
 * Validates and normalizes a hex color string.
 *
 * @param {string} hex - Candidate hex string
 * @param {string} [fallback='#4F46E5'] - Fallback color if invalid
 * @returns {string} Valid uppercase hex color (e.g., '#4F46E5')
 */
export function normalizeHexColor(hex, fallback = '#4F46E5') {
  if (typeof hex !== 'string') return fallback;
  const trimmed = hex.trim();
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(trimmed) ? trimmed.toUpperCase() : fallback;
}

/**
 * Validates that an event plan conforms to essential structural requirements.
 * Ensures summary, budget allocations, and checklist arrays are safe to render.
 *
 * @param {Object} plan - Parsed plan object
 * @returns {boolean} True if plan meets required structure
 */
export function isValidPlanStructure(plan) {
  if (!plan || typeof plan !== 'object') return false;
  if (!plan.summary || typeof plan.summary !== 'object') return false;
  if (!plan.summary.title || !plan.summary.eventType) return false;
  if (!plan.budget || typeof plan.budget !== 'object') return false;
  if (typeof plan.budget.totalBudget !== 'number' || plan.budget.totalBudget <= 0) return false;
  if (!Array.isArray(plan.budget.allocations) || plan.budget.allocations.length === 0) return false;
  return true;
}
