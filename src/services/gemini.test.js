import { describe, it, expect } from 'vitest';
import { generateEventPlan, getFallbackEventPlan } from './gemini';

describe('Gemini Service & Fallback Plan Suite', () => {
  it('generates high-fidelity fallback blueprint with accurate calculations when API key is unconfigured', async () => {
    const params = {
      eventType: 'Anniversary',
      budget: 12000,
      currency: 'EUR',
      guestCount: 80,
      locationType: 'Outdoor Garden',
      theme: 'Sunset Romance',
    };

    const plan = await generateEventPlan(params);

    expect(plan).toBeDefined();
    expect(plan.summary).toBeDefined();
    expect(plan.summary.eventType).toBe('Anniversary');
    expect(plan.summary.estimatedGuests).toBe(80);
    expect(plan.summary.colorPalette).toHaveLength(4);

    expect(plan.budget).toBeDefined();
    expect(plan.budget.totalBudget).toBe(12000);
    expect(plan.budget.currency).toBe('EUR');
    expect(plan.budget.allocations.length).toBeGreaterThan(0);

    // Verify budget allocations sum to the total budget
    const allocatedSum = plan.budget.allocations.reduce((sum, a) => sum + a.allocatedAmount, 0);
    expect(allocatedSum).toBe(12000);

    expect(plan.timeline).toBeDefined();
    expect(plan.timeline.phases.length).toBeGreaterThanOrEqual(3);

    expect(plan.checklist).toBeDefined();
    expect(plan.checklist.length).toBeGreaterThanOrEqual(5);

    expect(plan.creativeIdeas).toBeDefined();
    expect(plan.creativeIdeas.themeSuggestions.length).toBeGreaterThan(0);
    expect(plan.creativeIdeas.invitationPhrasing.length).toBeGreaterThan(0);
  });

  it('handles default empty parameters gracefully in getFallbackEventPlan', () => {
    const fallback = getFallbackEventPlan();

    expect(fallback.summary.title).toContain('Celebration');
    expect(fallback.budget.totalBudget).toBe(5000);
    expect(fallback.budget.currency).toBe('USD');
    expect(fallback.summary.estimatedGuests).toBe(50);

    const sum = fallback.budget.allocations.reduce((acc, item) => acc + item.allocatedAmount, 0);
    expect(sum).toBe(5000);
  });
});
