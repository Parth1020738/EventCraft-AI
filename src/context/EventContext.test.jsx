import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { EventProvider, useEventContext } from './EventContext';
import { EVENT_PLAN_STORAGE_KEY, FORM_DATA_STORAGE_KEY } from '../utils/storage';

// In-memory localStorage mock for headless jsdom test isolation
const store = new Map();
const localStorageMock = {
  getItem: vi.fn((key) => store.get(key) || null),
  setItem: vi.fn((key, val) => store.set(key, String(val))),
  removeItem: vi.fn((key) => store.delete(key)),
  clear: vi.fn(() => store.clear()),
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('EventContext Global State Management Suite', () => {
  beforeEach(() => {
    store.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => <EventProvider>{children}</EventProvider>;

  it('initializes with null data when localStorage is empty', () => {
    const { result } = renderHook(() => useEventContext(), { wrapper });

    expect(result.current.eventData).toBeNull();
    expect(result.current.lastParams).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('throws an error if useEventContext is called outside of EventProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useEventContext())).toThrow(
      'useEventContext must be used within an <EventProvider>'
    );
    consoleSpy.mockRestore();
  });

  it('loads fallback blueprint and persists state into localStorage', () => {
    const { result } = renderHook(() => useEventContext(), { wrapper });

    act(() => {
      result.current.loadFallbackBlueprint({
        eventType: 'Wedding',
        budget: 15000,
        currency: 'USD',
        guestCount: 120,
      });
    });

    expect(result.current.eventData).toBeDefined();
    expect(result.current.eventData.summary.eventType).toBe('Wedding');
    expect(result.current.eventData.budget.totalBudget).toBe(15000);

    const saved = JSON.parse(store.get(EVENT_PLAN_STORAGE_KEY));
    expect(saved).toBeDefined();
    expect(saved.summary.eventType).toBe('Wedding');
  });

  it('immutably adds custom tasks to checklist and preserves task data', () => {
    const { result } = renderHook(() => useEventContext(), { wrapper });

    act(() => {
      result.current.loadFallbackBlueprint();
    });

    const initialTaskCount = result.current.eventData.checklist.length;
    const newTask = {
      id: 'custom-task-999',
      task: 'Book artisanal dessert cart',
      category: 'Catering',
      priority: 'High',
      estimatedCost: 800,
      status: 'To Do',
    };

    act(() => {
      result.current.addTask(newTask);
    });

    expect(result.current.eventData.checklist.length).toBe(initialTaskCount + 1);
    const added = result.current.eventData.checklist.find((t) => t.id === 'custom-task-999');
    expect(added).toBeDefined();
    expect(added.task).toBe('Book artisanal dessert cart');
    expect(added.estimatedCost).toBe(800);
  });

  it('cycles task status through To Do -> In Progress -> Completed -> To Do', () => {
    const { result } = renderHook(() => useEventContext(), { wrapper });

    act(() => {
      result.current.loadFallbackBlueprint();
    });

    const targetTaskId = result.current.eventData.checklist[0].id;
    expect(result.current.eventData.checklist[0].status).toBe('To Do');

    // 1st toggle: To Do -> In Progress
    act(() => {
      result.current.toggleTask(targetTaskId);
    });
    expect(result.current.eventData.checklist.find((t) => t.id === targetTaskId).status).toBe('In Progress');

    // 2nd toggle: In Progress -> Completed
    act(() => {
      result.current.toggleTask(targetTaskId);
    });
    expect(result.current.eventData.checklist.find((t) => t.id === targetTaskId).status).toBe('Completed');

    // 3rd toggle: Completed -> To Do
    act(() => {
      result.current.toggleTask(targetTaskId);
    });
    expect(result.current.eventData.checklist.find((t) => t.id === targetTaskId).status).toBe('To Do');
  });

  it('resets event data, parameters, and cleans localStorage cache completely', () => {
    const { result } = renderHook(() => useEventContext(), { wrapper });

    act(() => {
      result.current.loadFallbackBlueprint({ eventType: 'Birthday', budget: 3000 });
    });

    expect(result.current.eventData).not.toBeNull();
    expect(store.has(EVENT_PLAN_STORAGE_KEY)).toBe(true);

    act(() => {
      result.current.resetPlan();
    });

    expect(result.current.eventData).toBeNull();
    expect(result.current.lastParams).toBeNull();
    expect(store.has(EVENT_PLAN_STORAGE_KEY)).toBe(false);
    expect(store.has(FORM_DATA_STORAGE_KEY)).toBe(false);
  });
});
