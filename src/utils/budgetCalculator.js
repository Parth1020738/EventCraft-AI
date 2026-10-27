/**
 * Pure mathematical helper functions for event budget allocations,
 * dynamic scenario recalculation, and trade-off optimization.
 */

/**
 * Calculates the sum of all itemized category allocations.
 * @param {Array<{ allocatedAmount: number }>} allocations
 * @returns {number} Total budget
 */
export function calculateTotalBudget(allocations = []) {
  if (!Array.isArray(allocations)) return 0;
  return allocations.reduce((sum, item) => sum + (Number(item?.allocatedAmount) || 0), 0);
}

/**
 * Calculates the percentage of a given amount relative to total budget.
 * Safely handles 0 total without division by zero.
 * @param {number} amount
 * @param {number} totalBudget
 * @returns {number} Integer percentage (0 to 100)
 */
export function calculateCategoryPercentage(amount, totalBudget) {
  const safeAmount = Math.max(0, Number(amount) || 0);
  const safeTotal = Math.max(0, Number(totalBudget) || 0);
  if (safeTotal === 0) return 0;
  return Math.round((safeAmount / safeTotal) * 100);
}

/**
 * Updates an itemized allocation amount and normalizes all category percentages.
 * Clamps negative amounts to 0.
 *
 * @param {Array<{ category: string, allocatedAmount: number, percentage: number }>} allocations
 * @param {string} categoryToUpdate
 * @param {number} newAmount
 * @returns {{ allocations: Array<Object>, totalBudget: number }}
 */
export function recalculateAllocations(allocations = [], categoryToUpdate, newAmount) {
  if (!Array.isArray(allocations) || allocations.length === 0) {
    return { allocations: [], totalBudget: 0 };
  }

  const safeNewAmount = Math.max(0, Number(newAmount) || 0);

  // 1. Update target category amount
  const updatedList = allocations.map((item) => {
    if (item.category === categoryToUpdate) {
      return { ...item, allocatedAmount: safeNewAmount };
    }
    return { ...item, allocatedAmount: Math.max(0, Number(item.allocatedAmount) || 0) };
  });

  // 2. Recompute new total
  const newTotal = calculateTotalBudget(updatedList);

  // 3. Recalculate normalized percentages
  const normalizedAllocations = updatedList.map((item) => ({
    ...item,
    percentage: calculateCategoryPercentage(item.allocatedAmount, newTotal),
  }));

  return {
    allocations: normalizedAllocations,
    totalBudget: newTotal,
  };
}

/**
 * Checks if the sum of category allocations equals the target total budget.
 * @param {Array<{ allocatedAmount: number }>} allocations
 * @param {number} expectedTotal
 * @returns {boolean}
 */
export function isBudgetBalanced(allocations = [], expectedTotal) {
  const currentTotal = calculateTotalBudget(allocations);
  return Math.abs(currentTotal - (Number(expectedTotal) || 0)) < 1;
}

/**
 * Recalculates an event budget when scenario parameters change (Guest count or Total budget)
 * without forcing the user to restart planning from scratch.
 *
 * @param {Array<Object>} allocations - Existing category allocations
 * @param {number} newTotalBudget - New target budget
 * @param {number} oldGuests - Previous guest headcount
 * @param {number} newGuests - Updated guest headcount
 * @returns {Array<Object>} Updated allocations with rebalanced amounts
 */
export function recalculateScenario(allocations = [], newTotalBudget, oldGuests = 50, newGuests = 50) {
  if (!Array.isArray(allocations) || allocations.length === 0) return [];
  const safeBudget = Math.max(100, Number(newTotalBudget) || 1000);
  const safeOldGuests = Math.max(1, Number(oldGuests) || 1);
  const safeNewGuests = Math.max(1, Number(newGuests) || 1);
  const guestRatio = safeNewGuests / safeOldGuests;

  // Sensitivity weighting: Catering (high: 0.7), Venue (medium: 0.4), Others (fixed: 0.1)
  const weightedList = allocations.map((item) => {
    let weight = 0.1;
    if (item.category.includes('Catering') || item.category.includes('Food')) weight = 0.7;
    else if (item.category.includes('Venue')) weight = 0.4;

    // Adjusted relative share based on guest delta
    const guestMultiplier = 1 + (guestRatio - 1) * weight;
    const rawShare = (item.percentage || 20) * guestMultiplier;
    return { ...item, rawShare };
  });

  const totalRawShare = weightedList.reduce((sum, i) => sum + i.rawShare, 0);

  // Re-normalize exact amounts to match the new total budget
  return weightedList.map((item) => {
    const normalizedPercent = Math.max(2, Math.round((item.rawShare / totalRawShare) * 100));
    const allocatedAmount = Math.round((item.rawShare / totalRawShare) * safeBudget);
    const { rawShare: _, ...cleanItem } = item;
    return {
      ...cleanItem,
      allocatedAmount,
      percentage: normalizedPercent,
    };
  });
}

/**
 * Applies strategic budget trade-off shifts when constraints change or expenses spike.
 *
 * @param {Array<Object>} allocations
 * @param {'GASTRONOMY_FOCUS' | 'MEDIA_FOCUS' | 'VENUE_FOCUS' | 'INFLATION_BUFFER'} strategy
 * @returns {Array<Object>} Rebalanced allocations
 */
export function applyTradeOffStrategy(allocations = [], strategy) {
  if (!Array.isArray(allocations) || allocations.length === 0) return allocations;

  const total = calculateTotalBudget(allocations);
  if (total <= 0) return allocations;

  // Define percentage adjustments per category for each strategy
  const adjustments = {
    GASTRONOMY_FOCUS: {
      'Catering & Beverages': 8,
      'Decor & Ambiance': -5,
      'Logistics & Contingency': -3,
    },
    MEDIA_FOCUS: {
      'Entertainment & Photography': 7,
      'Decor & Ambiance': -4,
      'Logistics & Contingency': -3,
    },
    VENUE_FOCUS: {
      'Venue & Facilities': 8,
      'Decor & Ambiance': -4,
      'Entertainment & Photography': -2,
      'Logistics & Contingency': -2,
    },
    INFLATION_BUFFER: {
      'Logistics & Contingency': 8,
      'Decor & Ambiance': -3,
      'Venue & Facilities': -3,
      'Catering & Beverages': -2,
    },
  };

  const deltaMap = adjustments[strategy];
  if (!deltaMap) return allocations;

  const adjusted = allocations.map((item) => {
    const deltaPercent = deltaMap[item.category] || 0;
    const newPercent = Math.max(3, (item.percentage || 0) + deltaPercent);
    const newAmount = Math.round((newPercent / 100) * total);
    return {
      ...item,
      percentage: newPercent,
      allocatedAmount: newAmount,
    };
  });

  // Normalize to exact total
  const adjustedTotal = calculateTotalBudget(adjusted);
  const diff = total - adjustedTotal;
  if (diff !== 0 && adjusted.length > 0) {
    adjusted[0].allocatedAmount += diff;
  }

  return adjusted.map((item) => ({
    ...item,
    percentage: calculateCategoryPercentage(item.allocatedAmount, total),
  }));
}
