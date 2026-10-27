import { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Circle,
  PartyPopper, 
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  PlusCircle,
  RotateCcw,
  Check,
  Tag
} from 'lucide-react';
import { EventProvider, useEventContext } from './context/EventContext';
import EventWizard from './components/forms/EventWizard';
import LoadingSkeleton from './components/ui/LoadingSkeleton';
import ErrorMessage from './components/ui/ErrorMessage';

function MainAppContent() {
  const { 
    eventData, 
    lastParams, 
    isLoading, 
    error, 
    generatePlan, 
    loadFallbackBlueprint, 
    toggleTask, 
    resetPlan 
  } = useEventContext();

  const handleWizardSubmit = async (formData) => {
    try {
      await generatePlan(formData);
    } catch {
      // Error is captured in context
    }
  };

  const currencySymbolMap = {
    USD: '$',
    INR: '₹',
    EUR: '€',
    GBP: '£',
  };

  const currencySymbol = eventData?.budget?.currency 
    ? (currencySymbolMap[eventData.budget.currency] || eventData.budget.currency) 
    : '$';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold font-heading bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                EventCraft AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Phase 2 Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {eventData && !isLoading && (
              <button
                type="button"
                onClick={resetPlan}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
                Plan New Event
              </button>
            )}

            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Engine Online
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorMessage 
            message={error} 
            onRetry={() => lastParams && generatePlan(lastParams)}
            onFallback={() => loadFallbackBlueprint(lastParams)}
          />
        )}

        {/* Wizard Form State (When no plan exists and not loading) */}
        {!isLoading && !error && !eventData && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Introduction */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 text-white p-8 sm:p-12 shadow-xl border border-indigo-800/40 text-center max-w-4xl mx-auto">
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  GenAI Event Engine
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight leading-tight text-white">
                  Craft Your Dream Celebration in Seconds
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Provide your constraints below. Our AI orchestrates custom itemized budgets, dynamic master timelines, actionable checklists, and bespoke creative concepts tailored to your event.
                </p>
              </div>

              {/* Decorative Accents */}
              <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
              <div className="absolute right-20 -bottom-20 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
            </section>

            {/* Event Wizard Component */}
            <EventWizard onSubmit={handleWizardSubmit} isSubmitting={isLoading} />
          </div>
        )}

        {/* Generated Plan Dashboard View */}
        {!isLoading && !error && eventData && (
          <div className="space-y-8 animate-fade-in">
            {/* Event Hero Summary Banner */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-900 text-white p-6 sm:p-10 shadow-lg border border-indigo-800/40">
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-semibold uppercase tracking-wider">
                      {eventData.summary.eventType}
                    </span>
                    <span className="text-xs text-amber-300 font-medium">
                      ★ {eventData.summary.theme}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
                    {eventData.summary.title}
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {eventData.summary.description}
                  </p>
                </div>

                <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
                  <div className="flex-1 lg:flex-none p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                    <span className="text-xs text-slate-300 font-medium block">Total Allocation</span>
                    <span className="text-2xl font-extrabold font-mono text-white">
                      {currencySymbol}{eventData.budget.totalBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex-1 lg:flex-none p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                    <span className="text-xs text-slate-300 font-medium block">Guests</span>
                    <span className="text-2xl font-extrabold font-mono text-white">
                      {eventData.summary.estimatedGuests}
                    </span>
                  </div>
                </div>
              </div>

              {/* Color Palette Swatches */}
              {Array.isArray(eventData.summary.colorPalette) && (
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium mr-2">Theme Palette:</span>
                  {eventData.summary.colorPalette.map((hex, i) => (
                    <div 
                      key={i} 
                      className="w-6 h-6 rounded-full border border-white/40 shadow-xs" 
                      style={{ backgroundColor: hex }} 
                      title={hex} 
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Core Plan Grid: Budget, Timeline, Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Budget Allocations Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-base">Budget Breakdown</h2>
                      <span className="text-xs text-slate-500">Itemized categories</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold font-mono text-indigo-600">
                    {currencySymbol}{eventData.budget.totalBudget.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  {eventData.budget.allocations.map((alloc, idx) => (
                    <div key={idx} className="space-y-1.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{alloc.category}</span>
                        <span className="font-mono font-bold text-slate-900">
                          {currencySymbol}{alloc.allocatedAmount.toLocaleString()} ({alloc.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full transition-all" 
                          style={{ width: `${alloc.percentage}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight pt-0.5">{alloc.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Master Timeline Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Master Timeline</h2>
                    <span className="text-xs text-slate-500">{eventData.timeline.phases.length} Phases Scheduled</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {eventData.timeline.phases.map((phase, pIdx) => (
                    <div key={pIdx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                          {phase.phaseName}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5 rounded-md bg-slate-100">
                          {phase.targetPeriod}
                        </span>
                      </div>

                      <div className="space-y-2 pl-2 border-l-2 border-indigo-100">
                        {phase.milestones.map((m, mIdx) => (
                          <div key={mIdx} className="text-xs space-y-0.5">
                            <div className="flex items-center justify-between font-semibold text-slate-800">
                              <span>{m.title}</span>
                              <span className="text-[10px] text-indigo-600 font-mono">{m.dueTime}</span>
                            </div>
                            <p className="text-[11px] text-slate-500">{m.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Checklist Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-base">Vendor Checklist</h2>
                      <span className="text-xs text-slate-500">Interactive task toggles</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {eventData.checklist.filter((t) => t.status === 'Completed').length} / {eventData.checklist.length} Done
                  </span>
                </div>

                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {eventData.checklist.map((task) => {
                    const isDone = task.status === 'Completed';
                    const isInProgress = task.status === 'In Progress';
                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                          isDone 
                            ? 'bg-slate-50/60 border-slate-200/60 opacity-70' 
                            : isInProgress
                            ? 'bg-indigo-50/50 border-indigo-200'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        } focus-visible:outline-2 focus-visible:outline-indigo-600`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : isInProgress ? (
                            <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 text-xs space-y-1">
                          <span className={`font-semibold block ${isDone ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                            {task.task}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100">{task.category}</span>
                            <span>•</span>
                            <span className={`font-semibold ${
                              task.priority === 'High' ? 'text-rose-600' : task.priority === 'Medium' ? 'text-amber-600' : 'text-slate-600'
                            }`}>
                              {task.priority} Priority
                            </span>
                            <span>•</span>
                            <span className="font-mono">{currencySymbol}{task.estimatedCost.toLocaleString()}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Creative Ideas & Concepts Row */}
            {eventData.creativeIdeas && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-bold font-heading text-slate-900">
                    Bespoke Creative Concepts & Entertainment
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {/* Themes */}
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-indigo-600" />
                      Theme Accents
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {eventData.creativeIdeas.themeSuggestions?.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-indigo-500">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Decor Ideas */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100/80 space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      Decor & Ambiance
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {eventData.creativeIdeas.decorIdeas?.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Entertainment */}
                  <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100/80 space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-violet-900 flex items-center gap-1.5">
                      <PartyPopper className="w-3.5 h-3.5 text-violet-600" />
                      Activities & Music
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {eventData.creativeIdeas.entertainmentSuggestions?.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-violet-500">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <EventProvider>
      <MainAppContent />
    </EventProvider>
  );
}
