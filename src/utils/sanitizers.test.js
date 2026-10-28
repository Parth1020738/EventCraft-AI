import { describe, it, expect } from 'vitest';
import {
  sanitizePromptInput,
  sanitizeFileName,
  normalizeHexColor,
  isValidPlanStructure,
} from './sanitizers';

describe('Sanitizers & Security Suite', () => {
  describe('sanitizePromptInput', () => {
    it('strips ASCII control characters and carriage returns', () => {
      const malicious = 'Celebration\r\n\x00\x08Party\x1F';
      const clean = sanitizePromptInput(malicious);
      expect(clean).toBe('Celebration Party');
    });

    it('collapses excessive whitespace and trims outer spaces', () => {
      const input = '   Royal   Gala   Evening   ';
      expect(sanitizePromptInput(input)).toBe('Royal Gala Evening');
    });

    it('enforces maximum character length boundary', () => {
      const longInput = 'A'.repeat(500);
      const output = sanitizePromptInput(longInput, 50);
      expect(output.length).toBe(50);
    });

    it('handles null, undefined, and non-string values gracefully', () => {
      expect(sanitizePromptInput(null)).toBe('');
      expect(sanitizePromptInput(undefined)).toBe('');
      expect(sanitizePromptInput(12345)).toBe('12345');
    });
  });

  describe('sanitizeFileName', () => {
    it('strips path traversal and reserved filesystem characters', () => {
      const dangerous = '../../../etc/passwd:my*event?plan';
      const clean = sanitizeFileName(dangerous);
      expect(clean).not.toContain('..');
      expect(clean).not.toContain('/');
      expect(clean).not.toContain(':');
      expect(clean).not.toContain('*');
      expect(clean).not.toContain('?');
    });

    it('replaces spaces with underscores', () => {
      expect(sanitizeFileName('Golden Anniversary Party')).toBe('Golden_Anniversary_Party');
    });

    it('falls back to default name on empty or invalid inputs', () => {
      expect(sanitizeFileName('')).toBe('Celebration_Plan');
      expect(sanitizeFileName(null)).toBe('Celebration_Plan');
    });
  });

  describe('normalizeHexColor', () => {
    it('accepts valid 6-digit hex and normalizes to uppercase', () => {
      expect(normalizeHexColor('#4f46e5')).toBe('#4F46E5');
      expect(normalizeHexColor('#ffffff')).toBe('#FFFFFF');
    });

    it('accepts valid 3-digit hex format', () => {
      expect(normalizeHexColor('#fff')).toBe('#FFF');
    });

    it('falls back to default color for invalid hex strings', () => {
      expect(normalizeHexColor('not-a-color')).toBe('#4F46E5');
      expect(normalizeHexColor('#123456789')).toBe('#4F46E5');
      expect(normalizeHexColor(null)).toBe('#4F46E5');
    });
  });

  describe('isValidPlanStructure', () => {
    it('returns true for a complete valid event plan', () => {
      const validPlan = {
        summary: { title: 'Wedding Gala', eventType: 'Wedding' },
        budget: { totalBudget: 10000, allocations: [{ category: 'Venue', allocatedAmount: 3000 }] },
      };
      expect(isValidPlanStructure(validPlan)).toBe(true);
    });

    it('returns false for null, empty object, or missing required subtrees', () => {
      expect(isValidPlanStructure(null)).toBe(false);
      expect(isValidPlanStructure({})).toBe(false);
      expect(isValidPlanStructure({ summary: null, budget: null })).toBe(false);
      expect(isValidPlanStructure({ summary: { title: 'Test' }, budget: { totalBudget: 0 } })).toBe(false);
      expect(isValidPlanStructure({ summary: { title: 'Test', eventType: 'Wedding' }, budget: { totalBudget: 5000, allocations: [] } })).toBe(false);
    });
  });
});

