/**
 * Client-side validation routines for the Multi-step Event Wizard Form.
 */

export const VALID_CURRENCIES = ['USD', 'INR', 'EUR', 'GBP'];
export const MAX_GUEST_COUNT = 100000;
export const MIN_BUDGET = 100;
export const MAX_THEME_LENGTH = 150;
export const MAX_NOTES_LENGTH = 500;

/**
 * Validates Step 1: Basic Details (Event type, target date, guest count).
 *
 * @param {Object} data - Form data for step 1
 * @param {string} data.eventType - Selected event type
 * @param {string} data.targetDate - Target date string (YYYY-MM-DD)
 * @param {number|string} data.guestCount - Guest count number or string
 * @returns {{ isValid: boolean, errors: Record<string, string> }} Validation result
 */
export function validateStep1(data) {
  const errors = {};

  if (!data.eventType || !data.eventType.trim()) {
    errors.eventType = 'Please select an event type to continue.';
  }

  if (!data.targetDate || !data.targetDate.trim()) {
    errors.targetDate = 'Please select a target celebration date.';
  } else {
    const selected = new Date(data.targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(selected.getTime())) {
      errors.targetDate = 'Please provide a valid date.';
    } else if (selected < today) {
      errors.targetDate = 'Target date cannot be in the past.';
    }
  }

  const guests = Number(data.guestCount);
  if (!data.guestCount || isNaN(guests) || guests <= 0) {
    errors.guestCount = 'Guest count must be at least 1 attendee.';
  } else if (!Number.isInteger(guests)) {
    errors.guestCount = 'Guest count must be a whole number.';
  } else if (guests > MAX_GUEST_COUNT) {
    errors.guestCount = `Guest count cannot exceed ${MAX_GUEST_COUNT.toLocaleString()} for standard planning.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates Step 2: Budget & Venue Setting.
 *
 * @param {Object} data - Form data for step 2
 * @param {number|string} data.budget - Monetary budget figure
 * @param {string} data.currency - ISO currency code
 * @param {string} data.locationType - Venue setting identifier
 * @returns {{ isValid: boolean, errors: Record<string, string> }} Validation result
 */
export function validateStep2(data) {
  const errors = {};

  const budget = Number(data.budget);
  if (!data.budget || isNaN(budget) || budget <= 0) {
    errors.budget = 'Please enter a realistic celebration budget greater than 0.';
  } else if (budget < MIN_BUDGET) {
    errors.budget = `Minimum budget should be at least ${MIN_BUDGET}.`;
  }

  if (!data.currency || !VALID_CURRENCIES.includes(data.currency)) {
    errors.currency = `Please select a valid currency (${VALID_CURRENCIES.join(', ')}).`;
  }

  if (!data.locationType || !data.locationType.trim()) {
    errors.locationType = 'Please select a preferred venue / location setting.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates Step 3: Themes & Preferences.
 *
 * @param {Object} data - Form data for step 3
 * @param {string} [data.theme] - Theme description
 * @param {string} [data.notes] - Custom requirements or special instructions
 * @returns {{ isValid: boolean, errors: Record<string, string> }} Validation result
 */
export function validateStep3(data) {
  const errors = {};

  if (data.theme && data.theme.length > MAX_THEME_LENGTH) {
    errors.theme = `Theme description is too lengthy (max ${MAX_THEME_LENGTH} characters).`;
  }

  if (data.notes && data.notes.length > MAX_NOTES_LENGTH) {
    errors.notes = `Special requirements note is too lengthy (max ${MAX_NOTES_LENGTH} characters).`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
