/**
 * Pure mathematical helper functions for event budget allocations and percentage rebalancing.
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
