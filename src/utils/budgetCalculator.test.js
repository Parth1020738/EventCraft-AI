import { describe, it, expect } from 'vitest';
import { 
  calculateTotalBudget, 
  calculateCategoryPercentage, 
  recalculateAllocations, 
  isBudgetBalanced,
  recalculateScenario,
  applyTradeOffStrategy
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

  describe('recalculateScenario (Dynamic What-If Recalculations)', () => {
    it('scales allocations proportionally when total budget increases without resetting plan', () => {
      const updated = recalculateScenario(sampleAllocations, 20000, 50, 50);
      const total = calculateTotalBudget(updated);
      expect(total).toBeCloseTo(20000, -2);
      expect(updated.length).toBe(sampleAllocations.length);
    });

    it('adjusts catering more aggressively when guest count doubles (guest sensitivity weighting)', () => {
      const updated = recalculateScenario(sampleAllocations, 10000, 50, 100);
      const catering = updated.find((a) => a.category.includes('Catering'));
      const decor = updated.find((a) => a.category.includes('Decor'));

      // Catering should have gained share over decor due to guest sensitivity
      expect(catering.percentage).toBeGreaterThan(sampleAllocations.find((a) => a.category.includes('Catering')).percentage);
      expect(decor.percentage).toBeLessThanOrEqual(sampleAllocations.find((a) => a.category.includes('Decor')).percentage);
    });

    it('returns empty array cleanly on invalid input', () => {
      expect(recalculateScenario([], 10000)).toEqual([]);
      expect(recalculateScenario(null, 10000)).toEqual([]);
    });
  });

  describe('applyTradeOffStrategy (Trade-Off Decision Engine)', () => {
    it('applies GASTRONOMY_FOCUS by boosting catering and trimming decor/contingency', () => {
      const rebalanced = applyTradeOffStrategy(sampleAllocations, 'GASTRONOMY_FOCUS');
      const catering = rebalanced.find((a) => a.category.includes('Catering'));
      const decor = rebalanced.find((a) => a.category.includes('Decor'));

      expect(catering.allocatedAmount).toBeGreaterThan(3500);
      expect(decor.allocatedAmount).toBeLessThan(1500);
      expect(calculateTotalBudget(rebalanced)).toBe(10000);
    });

    it('applies INFLATION_BUFFER by boosting contingency reserve buffer', () => {
      const rebalanced = applyTradeOffStrategy(sampleAllocations, 'INFLATION_BUFFER');
      const contingency = rebalanced.find((a) => a.category.includes('Logistics & Contingency'));

      expect(contingency.percentage).toBeGreaterThan(8);
      expect(calculateTotalBudget(rebalanced)).toBe(10000);
    });

    it('maintains 100% budget balance across all strategies', () => {
      const strategies = ['GASTRONOMY_FOCUS', 'MEDIA_FOCUS', 'VENUE_FOCUS', 'INFLATION_BUFFER'];
      for (const strat of strategies) {
        const rebalanced = applyTradeOffStrategy(sampleAllocations, strat);
        expect(calculateTotalBudget(rebalanced)).toBe(10000);
      }
    });

    it('handles empty or unrecognized strategies gracefully', () => {
      expect(applyTradeOffStrategy([], 'UNKNOWN_STRATEGY')).toEqual([]);
      expect(applyTradeOffStrategy(sampleAllocations, 'UNKNOWN_STRATEGY')).toEqual(sampleAllocations);
    });
  });
});
