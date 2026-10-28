import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateEventPlan, getFallbackEventPlan } from '../services/gemini';
import { DEFAULT_FALLBACK_PARAMS } from '../services/fallbackPlan';
import { 
  recalculateAllocations, 
  recalculateScenario, 
  applyTradeOffStrategy 
} from '../utils/budgetCalculator';
import {
  safeGetStorage,
  safeSetStorage,
  EVENT_PLAN_STORAGE_KEY,
  FORM_DATA_STORAGE_KEY
} from '../utils/storage';

const EventContext = createContext(null);

/**
 * EventProvider component supplying global event state, generator triggers,
 * scenario recalculations, trade-off shifts, and task management.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Child elements
 * @returns {import('react').JSX.Element}
 */
export function EventProvider({ children }) {
  const [eventData, setEventData] = useState(() => safeGetStorage(EVENT_PLAN_STORAGE_KEY));
  const [lastParams, setLastParams] = useState(() => safeGetStorage(FORM_DATA_STORAGE_KEY));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    safeSetStorage(EVENT_PLAN_STORAGE_KEY, eventData);
  }, [eventData]);

  useEffect(() => {
    safeSetStorage(FORM_DATA_STORAGE_KEY, lastParams);
  }, [lastParams]);

  /**
   * Generates a new plan via Gemini AI or deterministic fallback.
   * @param {Object} formData - User onboarding specifications
   */
  const generatePlan = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    setLastParams(formData);

    try {
      const plan = await generateEventPlan(formData);
      if (!plan || !plan.summary || !plan.budget) {
        throw new Error('Received incomplete response structure from generator.');
      }
      setEventData(plan);
      return plan;
    } catch (err) {
      console.error('Plan generation failed:', err);
      setError(err.message || 'Failed to generate event plan. Please check your connection or retry.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fail-safe helper: Load fallback blueprint immediately on request.
   * @param {Object} [customParams] - Optional parameters to override defaults
   */
  const loadFallbackBlueprint = useCallback((customParams) => {
    setIsLoading(false);
    setError(null);
    const params = customParams || lastParams || DEFAULT_FALLBACK_PARAMS;
    const fallback = getFallbackEventPlan(params);
    setEventData(fallback);
    return fallback;
  }, [lastParams]);

  /**
   * Updates an itemized budget category amount and recalibrates total and percentages.
   */
  const updateBudgetCategory = useCallback((categoryName, newAmount) => {
    setEventData((prev) => {
      if (!prev?.budget?.allocations) return prev;

      const { allocations: normalizedAllocations, totalBudget: newTotal } = recalculateAllocations(
        prev.budget.allocations,
        categoryName,
        newAmount
      );

      return {
        ...prev,
        budget: {
          ...prev.budget,
          totalBudget: newTotal,
          allocations: normalizedAllocations,
        },
      };
    });
  }, []);

  /**
   * Recalculates plan dynamically when scenario changes without restarting.
   */
  const updateScenario = useCallback(({ budget, guestCount, targetDate }) => {
    setEventData((prev) => {
      if (!prev?.budget) return prev;

      const oldBudget = prev.budget.totalBudget;
      const oldGuests = prev.summary?.estimatedGuests || 50;
      const newBudget = budget !== undefined ? Number(budget) : oldBudget;
      const newGuests = guestCount !== undefined ? Number(guestCount) : oldGuests;

      const rebalancedAllocations = recalculateScenario(
        prev.budget.allocations,
        newBudget,
        oldGuests,
        newGuests
      );

      return {
        ...prev,
        summary: {
          ...prev.summary,
          estimatedGuests: newGuests,
        },
        budget: {
          ...prev.budget,
          totalBudget: newBudget,
          allocations: rebalancedAllocations,
        },
      };
    });

    if (targetDate) {
      setLastParams((prev) => ({ ...prev, targetDate }));
    }
  }, []);

  /**
   * Applies strategic trade-off shifts to current budget allocations.
   */
  const applyTradeOff = useCallback((strategy) => {
    setEventData((prev) => {
      if (!prev?.budget?.allocations) return prev;
      const adjustedAllocations = applyTradeOffStrategy(prev.budget.allocations, strategy);
      return {
        ...prev,
        budget: {
          ...prev.budget,
          allocations: adjustedAllocations,
        },
      };
    });
  }, []);

  /**
   * Toggles task status in the checklist between 'To Do' -> 'In Progress' -> 'Completed'.
   */
  const toggleTask = useCallback((taskId) => {
    setEventData((prev) => {
      if (!Array.isArray(prev?.checklist)) return prev;

      const updatedChecklist = prev.checklist.map((item) => {
        if (item.id === taskId) {
          let nextStatus = 'In Progress';
          if (item.status === 'In Progress') nextStatus = 'Completed';
          else if (item.status === 'Completed') nextStatus = 'To Do';
          return { ...item, status: nextStatus };
        }
        return item;
      });

      return { ...prev, checklist: updatedChecklist };
    });
  }, []);

  /**
   * Immutably adds a new task to the event checklist and syncs state.
   */
  const addTask = useCallback((newTask) => {
    if (!newTask || !newTask.task) return;
    setEventData((prev) => {
      if (!prev) return prev;
      const currentList = Array.isArray(prev.checklist) ? prev.checklist : [];
      return { ...prev, checklist: [...currentList, newTask] };
    });
  }, []);

  /**
   * Resets active event data and clears local cache and historical inputs.
   */
  const resetPlan = useCallback(() => {
    setEventData(null);
    setLastParams(null);
    setError(null);
    safeSetStorage(EVENT_PLAN_STORAGE_KEY, null);
    safeSetStorage(FORM_DATA_STORAGE_KEY, null);
  }, []);

  const value = {
    eventData,
    lastParams,
    isLoading,
    error,
    generatePlan,
    loadFallbackBlueprint,
    updateBudgetCategory,
    updateScenario,
    applyTradeOff,
    toggleTask,
    addTask,
    resetPlan,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

/**
 * Custom hook to safely consume EventContext.
 *
 * @throws {Error} If called outside of an EventProvider
 * @returns {Object} Event context state and actions
 */
export function useEventContext() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an <EventProvider>');
  }
  return context;
}
