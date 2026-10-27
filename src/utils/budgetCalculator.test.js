import { describe, it, expect } from 'vitest';
import { 
  calculateTotalBudget, 
  calculateCategoryPercentage, 
  recalculateAllocations, 
  isBudgetBalanced 
} from './budgetCalculator';

describe('Budget Calculator Logic Suite', () => {
  const sampleAllocations = [
    { category: 'Venue & Facilities', allocatedAmount: 3000, percentage: 30 },
    { category: 'Catering & Beverages', allocatedAmount: 3500, percentage: 35 },
    { category: 'Decor & Ambiance', allocatedAmount: 1500, percentage: 15 },
    { category: 'Entertainment & Photography', allocatedAmount: 1200, percentage: 12 },
    { category: 'Logistics & Contingency', allocatedAmount: 800, percentage: 8 },
  ];

  describe('calculateTotalBudget', () => {
    it('sums up all allocated category amounts accurately', () => {
      const total = calculateTotalBudget(sampleAllocations);
      expect(total).toBe(10000);
    });

    it('returns 0 for empty or invalid allocation lists', () => {
      expect(calculateTotalBudget([])).toBe(0);
      expect(calculateTotalBudget(null)).toBe(0);
      expect(calculateTotalBudget(undefined)).toBe(0);
    });

    it('handles items with missing or non-numeric amounts safely', () => {
      const dirtyAllocations = [
        { category: 'Venue', allocatedAmount: 1000 },
        { category: 'Decor', allocatedAmount: 'invalid' },
        { category: 'Catering', allocatedAmount: null },
      ];
      expect(calculateTotalBudget(dirtyAllocations)).toBe(1000);
    });
  });

  describe('calculateCategoryPercentage', () => {
    it('computes standard percentage rounded to nearest integer', () => {
      expect(calculateCategoryPercentage(3000, 10000)).toBe(30);
      expect(calculateCategoryPercentage(350, 1000)).toBe(35);
      expect(calculateCategoryPercentage(333, 1000)).toBe(33);
    });

    it('returns 0 when totalBudget is 0 without division by zero errors', () => {
      expect(calculateCategoryPercentage(500, 0)).toBe(0);
    });

    it('handles negative or invalid amount inputs cleanly by clamping to 0', () => {
      expect(calculateCategoryPercentage(-500, 1000)).toBe(0);
      expect(calculateCategoryPercentage('xyz', 1000)).toBe(0);
    });
  });

  describe('recalculateAllocations', () => {
    it('updates single category amount and re-balances all percentages', () => {
      // Change Venue from 3000 to 5000 (New total = 12000)
      const { allocations, totalBudget } = recalculateAllocations(
        sampleAllocations,
        'Venue & Facilities',
        5000
      );

      expect(totalBudget).toBe(12000);

      const venue = allocations.find((a) => a.category === 'Venue & Facilities');
      expect(venue.allocatedAmount).toBe(5000);
      expect(venue.percentage).toBe(Math.round((5000 / 12000) * 100)); // 42%

      // Verify that other categories maintain their absolute amounts
      const catering = allocations.find((a) => a.category === 'Catering & Beverages');
      expect(catering.allocatedAmount).toBe(3500);
      expect(catering.percentage).toBe(Math.round((3500 / 12000) * 100)); // 29%
    });

    it('clamps negative slider inputs to 0', () => {
      const { allocations, totalBudget } = recalculateAllocations(
        sampleAllocations,
        'Decor & Ambiance',
        -2000
      );

      const decor = allocations.find((a) => a.category === 'Decor & Ambiance');
      expect(decor.allocatedAmount).toBe(0);
      expect(decor.percentage).toBe(0);
      expect(totalBudget).toBe(8500);
    });

    it('handles empty input array without crashing', () => {
      const result = recalculateAllocations([], 'Venue', 1000);
      expect(result.allocations).toEqual([]);
      expect(result.totalBudget).toBe(0);
    });
  });

  describe('isBudgetBalanced', () => {
    it('returns true when allocation sum matches expected total', () => {
      expect(isBudgetBalanced(sampleAllocations, 10000)).toBe(true);
    });

    it('returns false when allocation sum diverges from expected total', () => {
      expect(isBudgetBalanced(sampleAllocations, 12000)).toBe(false);
    });
  });
});
