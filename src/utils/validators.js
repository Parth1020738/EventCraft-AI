/**
 * Client-side validation routines for the Multi-step Event Wizard Form.
 */

/**
 * Validates Step 1: Basic Details
 * @param {Object} data
 * @param {string} data.eventType
 * @param {string} data.targetDate
 * @param {number|string} data.guestCount
 * @returns {{ isValid: boolean, errors: Object.<string, string> }}
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
  } else if (guests > 100000) {
    errors.guestCount = 'Guest count cannot exceed 100,000 for standard planning.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates Step 2: Budget & Location
 * @param {Object} data
 * @param {number|string} data.budget
 * @param {string} data.currency
 * @param {string} data.locationType
 * @returns {{ isValid: boolean, errors: Object.<string, string> }}
 */
export function validateStep2(data) {
  const errors = {};

  const budget = Number(data.budget);
  if (!data.budget || isNaN(budget) || budget <= 0) {
    errors.budget = 'Please enter a realistic celebration budget greater than 0.';
  } else if (budget < 100) {
    errors.budget = 'Minimum budget should be at least 100.';
  }

  const validCurrencies = ['USD', 'INR', 'EUR', 'GBP'];
  if (!data.currency || !validCurrencies.includes(data.currency)) {
    errors.currency = 'Please select a valid currency (USD, INR, EUR, GBP).';
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
 * Validates Step 3: Themes & Preferences
 * @param {Object} data
 * @param {string} [data.theme]
 * @param {string} [data.notes]
 * @returns {{ isValid: boolean, errors: Object.<string, string> }}
 */
export function validateStep3(data) {
  const errors = {};

  if (data.theme && data.theme.length > 150) {
    errors.theme = 'Theme description is too lengthy (max 150 characters).';
  }

  if (data.notes && data.notes.length > 500) {
    errors.notes = 'Special requirements note is too lengthy (max 500 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
