import { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  PartyPopper, 
  ShieldCheck, 
  PlusCircle,
  Layers,
  CheckSquare,
  Clock,
  Palette
} from 'lucide-react';
import { EventProvider, useEventContext } from './context/EventContext';
import EventWizard from './components/forms/EventWizard';
import LoadingSkeleton from './components/ui/LoadingSkeleton';
import ErrorMessage from './components/ui/ErrorMessage';
import BudgetBreakdown from './components/dashboard/BudgetBreakdown';
import CountdownTimeline from './components/dashboard/CountdownTimeline';
import VendorChecklist from './components/dashboard/VendorChecklist';
import ThemeShowcase from './components/dashboard/ThemeShowcase';

function MainAppContent() {
  const { 
    eventData, 
    lastParams, 
    isLoading, 
    error, 
    generatePlan, 
    loadFallbackBlueprint, 
    resetPlan 
  } = useEventContext();

  const [activeTab, setActiveTab] = useState('all');

  const handleWizardSubmit = async (formData) => {
    try {
      await generatePlan(formData);
    } catch {
      // Handled via context error state
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
                Interactive Dashboard
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

        {/* Generated Plan: Complete Interactive Dashboard */}
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
            </section>

            {/* Dashboard View Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
              {[
                { id: 'all', label: 'Overview & All Sections', icon: Layers },
                { id: 'budget', label: 'Budget Sliders', icon: DollarSign },
                { id: 'timeline', label: 'Master Itinerary', icon: Clock },
                { id: 'checklist', label: 'Vendor Checklist', icon: CheckSquare },
                { id: 'concepts', label: 'Themes & Ideas', icon: Palette },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                    } focus-visible:outline-2 focus-visible:outline-indigo-600`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Interactive Dashboard Sections */}
            <div className="space-y-8">
              {(activeTab === 'all' || activeTab === 'budget') && (
                <BudgetBreakdown currencySymbol={currencySymbol} />
              )}

              {(activeTab === 'all' || activeTab === 'timeline') && (
                <CountdownTimeline />
              )}

              {(activeTab === 'all' || activeTab === 'checklist') && (
                <VendorChecklist currencySymbol={currencySymbol} />
              )}

              {(activeTab === 'all' || activeTab === 'concepts') && (
                <ThemeShowcase />
              )}
            </div>
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
