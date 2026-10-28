/**
 * Local storage utility functions with fail-safe error handling
 * for privacy-restricted or quota-constrained browser environments.
 */

export const EVENT_PLAN_STORAGE_KEY = 'eventcraft_ai_event_plan';
export const FORM_DATA_STORAGE_KEY = 'eventcraft_ai_last_form_data';

/**
 * Safely reads and parses a JSON record from localStorage.
 *
 * @template T
 * @param {string} key - LocalStorage key identifier
 * @returns {T|null} Parsed object or null if absent or inaccessible
 */
export function safeGetStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn(`Could not read '${key}' from localStorage:`, err);
    return null;
  }
}

/**
 * Safely serializes and persists a value to localStorage.
 * Removes key if value is null or undefined.
 *
 * @param {string} key - LocalStorage key identifier
 * @param {*} value - Data to serialize and persist
 * @returns {void}
 */
export function safeSetStorage(key, value) {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.warn(`Could not persist '${key}' to localStorage:`, err);
  }
}
