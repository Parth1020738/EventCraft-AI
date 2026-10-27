import { describe, it, expect } from 'vitest';
import { validateStep1, validateStep2, validateStep3 } from './validators';

describe('Validation Suite: Event Wizard Input Routines', () => {
  describe('validateStep1: Basic Details', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const validTomorrowStr = tomorrow.toISOString().split('T')[0];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDateStr = yesterday.toISOString().split('T')[0];

    it('passes with all valid inputs', () => {
      const result = validateStep1({
        eventType: 'Wedding',
        targetDate: validTomorrowStr,
        guestCount: 100,
      });
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('rejects missing or empty eventType', () => {
      const result = validateStep1({
        eventType: '',
        targetDate: validTomorrowStr,
        guestCount: 50,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.eventType).toBeDefined();
    });

    it('rejects missing targetDate', () => {
      const result = validateStep1({
        eventType: 'Birthday',
        targetDate: '',
        guestCount: 50,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.targetDate).toBeDefined();
    });

    it('rejects targetDate in the past', () => {
      const result = validateStep1({
        eventType: 'Birthday',
        targetDate: pastDateStr,
        guestCount: 50,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.targetDate).toContain('past');
    });

    it('rejects non-numeric or <= 0 guest counts', () => {
      expect(validateStep1({ eventType: 'Corporate', targetDate: validTomorrowStr, guestCount: 0 }).isValid).toBe(false);
      expect(validateStep1({ eventType: 'Corporate', targetDate: validTomorrowStr, guestCount: -5 }).isValid).toBe(false);
      expect(validateStep1({ eventType: 'Corporate', targetDate: validTomorrowStr, guestCount: 'invalid' }).isValid).toBe(false);
    });

    it('rejects decimal / non-integer guest counts', () => {
      const result = validateStep1({
        eventType: 'Anniversary',
        targetDate: validTomorrowStr,
        guestCount: 25.5,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.guestCount).toContain('whole number');
    });

    it('rejects guest counts exceeding ceiling threshold (> 100,000)', () => {
      const result = validateStep1({
        eventType: 'Festival',
        targetDate: validTomorrowStr,
        guestCount: 100001,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.guestCount).toContain('cannot exceed 100,000');
    });
  });

  describe('validateStep2: Budget & Location', () => {
    it('passes with valid budget, supported currency, and selected location', () => {
      const result = validateStep2({
        budget: 5000,
        currency: 'USD',
        locationType: 'Indoor',
      });
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('rejects non-numeric or zero budget', () => {
      expect(validateStep2({ budget: 0, currency: 'USD', locationType: 'Indoor' }).isValid).toBe(false);
      expect(validateStep2({ budget: -500, currency: 'USD', locationType: 'Indoor' }).isValid).toBe(false);
      expect(validateStep2({ budget: 'abc', currency: 'USD', locationType: 'Indoor' }).isValid).toBe(false);
    });

    it('rejects budgets below the minimum baseline threshold (< 100)', () => {
      const result = validateStep2({
        budget: 50,
        currency: 'USD',
        locationType: 'Outdoor',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.budget).toContain('at least 100');
    });

    it('accepts all supported challenge currencies (USD, INR, EUR, GBP)', () => {
      ['USD', 'INR', 'EUR', 'GBP'].forEach((curr) => {
        const result = validateStep2({
          budget: 2500,
          currency: curr,
          locationType: 'Hybrid',
        });
        expect(result.isValid).toBe(true);
      });
    });

    it('rejects unsupported currencies', () => {
      const result = validateStep2({
        budget: 2500,
        currency: 'JPY',
        locationType: 'Hybrid',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.currency).toBeDefined();
    });

    it('rejects missing locationType', () => {
      const result = validateStep2({
        budget: 2500,
        currency: 'USD',
        locationType: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.locationType).toBeDefined();
    });
  });

  describe('validateStep3: Themes & Preferences', () => {
    it('accepts clean optional theme and notes', () => {
      const result = validateStep3({
        theme: 'Bohemian Garden Romance',
        notes: 'Need live violin during entrance',
      });
      expect(result.isValid).toBe(true);
    });

    it('accepts empty theme and notes', () => {
      const result = validateStep3({
        theme: '',
        notes: '',
      });
      expect(result.isValid).toBe(true);
    });

    it('rejects overly long theme descriptions (> 150 characters)', () => {
      const longTheme = 'A'.repeat(151);
      const result = validateStep3({ theme: longTheme, notes: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.theme).toBeDefined();
    });

    it('rejects overly long special notes (> 500 characters)', () => {
      const longNotes = 'B'.repeat(501);
      const result = validateStep3({ theme: 'Vintage', notes: longNotes });
      expect(result.isValid).toBe(false);
      expect(result.errors.notes).toBeDefined();
    });
  });
});
