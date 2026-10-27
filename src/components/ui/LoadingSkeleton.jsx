import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const GENERATION_STAGES = [
  'Synthesizing guest volume and venue acoustics...',
  'Balancing vendor budget allocations and contingency reserves...',
  'Sequencing month-by-month and day-of countdown milestones...',
  'Curating bespoke aesthetic color swatches and creative themes...',
  'Compiling actionable vendor checklist and priority tasks...',
];

/**
 * Animated shimmer loading skeleton displayed while Gemini generates the event plan.
 * Features rotating status messages and ARIA polite live announcement.
 */
export default function LoadingSkeleton() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % GENERATION_STAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="max-w-5xl mx-auto py-12 px-4 sm:px-6 w-full space-y-8 animate-fade-in"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Central Progress Callout */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm animate-bounce">
          <Sparkles className="w-8 h-8 text-indigo-600" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold font-heading text-slate-900">
            Orchestrating Your Celebration
          </h2>
          <p className="text-sm font-medium text-indigo-600 min-h-[1.5rem] transition-all duration-300">
            {GENERATION_STAGES[stageIndex]}
          </p>
        </div>
      </div>

      {/* Shimmer Placeholder Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Skeleton Card 1: Event Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-slate-100 rounded animate-pulse w-full" />
            <div className="h-3 bg-slate-100 rounded animate-pulse w-5/6" />
            <div className="h-3 bg-slate-100 rounded animate-pulse w-2/3" />
          </div>
          <div className="h-8 bg-slate-100 rounded-lg animate-pulse mt-4" />
        </div>

        {/* Skeleton Card 2: Budget Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
            <div className="h-5 bg-slate-200 rounded animate-pulse w-24" />
          </div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-3.5 bg-slate-200 rounded animate-pulse w-28" />
                <div className="h-3.5 bg-slate-200 rounded animate-pulse w-16" />
              </div>
            ))}
          </div>
          <div className="h-2 bg-slate-100 rounded-full animate-pulse mt-3 overflow-hidden">
            <div className="h-full bg-indigo-300 w-1/3 animate-pulse" />
          </div>
        </div>

        {/* Skeleton Card 3: Timeline & Milestones */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded animate-pulse w-32" />
          </div>
          <div className="space-y-3.5 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-slate-200 animate-pulse shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-200 rounded animate-pulse w-4/5" />
                  <div className="h-2.5 bg-slate-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auxiliary Checklist Skeleton Preview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
        <div className="h-4 bg-slate-200 rounded animate-pulse w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/60">
              <div className="w-5 h-5 rounded-md bg-slate-200 animate-pulse shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4" />
                <div className="h-2.5 bg-slate-100 rounded animate-pulse w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
