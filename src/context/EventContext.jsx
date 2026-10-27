import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateEventPlan, getFallbackEventPlan } from '../services/gemini';
import { 
  recalculateAllocations, 
  recalculateScenario, 
  applyTradeOffStrategy 
} from '../utils/budgetCalculator';

const STORAGE_KEY = 'eventcraft_ai_event_plan';
const FORM_DATA_KEY = 'eventcraft_ai_last_form_data';

const EventContext = createContext(null);

/**
 * Safely read from localStorage without crashing in incognito/restricted environments.
 */
function safeGetStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn(`Could not read '${key}' from localStorage:`, err);
    return null;
  }
}

/**
 * Safely write to localStorage without crashing in quota or privacy restricted contexts.
 */
function safeSetStorage(key, value) {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.warn(`Could not persist '${key}' to localStorage:`, err);
  }
}

/**
 * EventProvider component wrapping the application to supply global event state.
 */
export function EventProvider({ children }) {
  const [eventData, setEventData] = useState(() => safeGetStorage(STORAGE_KEY));
  const [lastParams, setLastParams] = useState(() => safeGetStorage(FORM_DATA_KEY));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync eventData changes to localStorage
  useEffect(() => {
    safeSetStorage(STORAGE_KEY, eventData);
  }, [eventData]);

  // Sync lastParams changes to localStorage
  useEffect(() => {
    safeSetStorage(FORM_DATA_KEY, lastParams);
  }, [lastParams]);

  /**
   * Generates a new plan via Gemini AI or deterministic fallback.
   * @param {Object} formData
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
   */
  const loadFallbackBlueprint = useCallback((customParams) => {
    setIsLoading(false);
    setError(null);
    const params = customParams || lastParams || {
      eventType: 'Celebration',
      budget: 5000,
      currency: 'USD',
      guestCount: 50,
      locationType: 'Indoor / Flexible',
      theme: 'Vibrant Celebration',
    };
    const fallback = getFallbackEventPlan(params);
    setEventData(fallback);
    return fallback;
  }, [lastParams]);

  /**
   * Updates an itemized budget category amount and recalibrates total and percentages.
   * @param {string} categoryName
   * @param {number} newAmount
   */
  const updateBudgetCategory = useCallback((categoryName, newAmount) => {
    setEventData((prev) => {
      if (!prev || !prev.budget || !Array.isArray(prev.budget.allocations)) return prev;

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
   * Recalculates plan dynamically when scenario changes (guest count or budget)
   * without restarting from scratch.
   * @param {Object} scenarioParams
   * @param {number} [scenarioParams.budget]
   * @param {number} [scenarioParams.guestCount]
   * @param {string} [scenarioParams.targetDate]
   */
  const updateScenario = useCallback(({ budget, guestCount, targetDate }) => {
    setEventData((prev) => {
      if (!prev || !prev.budget) return prev;

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
      setLastParams((prev) => ({
        ...prev,
        targetDate,
      }));
    }
  }, []);

  /**
   * Applies strategic trade-off shifts to current budget allocations.
   * @param {'GASTRONOMY_FOCUS' | 'MEDIA_FOCUS' | 'VENUE_FOCUS' | 'INFLATION_BUFFER'} strategy
   */
  const applyTradeOff = useCallback((strategy) => {
    setEventData((prev) => {
      if (!prev || !prev.budget || !Array.isArray(prev.budget.allocations)) return prev;

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
   * @param {string} taskId
   */
  const toggleTask = useCallback((taskId) => {
    setEventData((prev) => {
      if (!prev || !Array.isArray(prev.checklist)) return prev;

      const updatedChecklist = prev.checklist.map((item) => {
        if (item.id === taskId) {
          let nextStatus = 'In Progress';
          if (item.status === 'In Progress') nextStatus = 'Completed';
          else if (item.status === 'Completed') nextStatus = 'To Do';
          return { ...item, status: nextStatus };
        }
        return item;
      });

      return {
        ...prev,
        checklist: updatedChecklist,
      };
    });
  }, []);

  /**
   * Resets active event data and clears local cache.
   */
  const resetPlan = useCallback(() => {
    setEventData(null);
    setError(null);
    safeSetStorage(STORAGE_KEY, null);
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
    resetPlan,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

/**
 * Custom hook to safely consume EventContext.
 */
export function useEventContext() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an <EventProvider>');
  }
  return context;
}
