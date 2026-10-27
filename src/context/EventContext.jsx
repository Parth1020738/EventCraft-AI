import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateEventPlan, getFallbackEventPlan } from '../services/gemini';

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

      const updatedAllocations = prev.budget.allocations.map((alloc) => {
        if (alloc.category === categoryName) {
          return { ...alloc, allocatedAmount: Math.max(0, Number(newAmount) || 0) };
        }
        return alloc;
      });

      const newTotal = updatedAllocations.reduce((sum, item) => sum + (item.allocatedAmount || 0), 0);

      const normalizedAllocations = updatedAllocations.map((item) => ({
        ...item,
        percentage: newTotal > 0 ? Math.round((item.allocatedAmount / newTotal) * 100) : 0,
      }));

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
