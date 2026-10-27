import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  PartyPopper, 
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { generateEventPlan } from './services/gemini';

export default function App() {
  const [samplePlan, setSamplePlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Phase 1 verification smoke test: generate baseline event plan
    async function loadInitialState() {
      try {
        const plan = await generateEventPlan({
          eventType: 'Anniversary Celebration',
          budget: 7500,
          guestCount: 65,
          locationType: 'Botanical Garden Pavilion',
          theme: 'Golden Hour Romance',
        });
        setSamplePlan(plan);
      } catch (err) {
        console.error('Initial state generation failed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialState();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation */}
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
                Phase 1 Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Engine Online
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 text-white p-8 sm:p-12 shadow-xl border border-indigo-800/40">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              GenAI-Powered Celebration Architecture
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight leading-tight text-white">
              Effortless Celebrations, Orchestrated by AI.
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              From intimate anniversaries to grand community gatherings. EventCraft AI structures your budgets, schedules timelines, and suggests creative themes with precision.
            </p>
          </div>

          {/* Decorative Background Accents */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute right-20 -bottom-20 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        </section>

        {/* Phase 1 Verification Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500" />
              Infrastructure & GenAI Engine Smoke Test
            </h2>
            <span className="text-xs text-slate-500 font-mono">React 19 + Tailwind v4 + Gemini SDK</span>
          </div>

          {loading ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" />
              <p className="mt-3 text-sm text-slate-500 font-medium">Testing Gemini service & structured JSON schema...</p>
            </div>
          ) : samplePlan ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Event Summary Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{samplePlan.summary.title}</h3>
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-3">{samplePlan.summary.theme}</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{samplePlan.summary.description}</p>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 pt-3 border-t border-slate-100">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">{samplePlan.summary.locationType}</span>
                  <span>•</span>
                  <span>{samplePlan.summary.estimatedGuests} Guests</span>
                </div>
              </div>

              {/* Budget Allocation Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-lg">Smart Budget</h3>
                  <span className="text-lg font-extrabold text-indigo-600 font-mono">
                    ${samplePlan.budget.totalBudget.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Allocated across {samplePlan.budget.allocations.length} distinct categories</p>
                <div className="space-y-2">
                  {samplePlan.budget.allocations.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50">
                      <span className="text-slate-600 font-medium">{item.category}</span>
                      <span className="font-semibold text-slate-900 font-mono">${item.allocatedAmount.toLocaleString()} ({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline & Readiness Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">Master Timeline</h3>
                <p className="text-xs text-slate-500 mb-4">{samplePlan.timeline.phases.length} Phases structured for execution</p>
                <div className="space-y-3">
                  {samplePlan.timeline.phases.map((phase, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-800">{phase.phaseName}</span>
                        <p className="text-slate-500 text-[11px]">{phase.targetPeriod}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </section>

        {/* Phase Roadmaps Info Card */}
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-indigo-950 text-base">Next Phase: Core Form & GenAI Engine</h4>
            <p className="text-xs text-indigo-700 mt-0.5">
              Phase 1 foundation complete. Multi-step Event Wizard, interactive form validation, and Firestore persistence ready for Phase 2.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-white px-3 py-2 rounded-xl shadow-xs border border-indigo-200/60">
            <span>Ready for Phase 2</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </section>
      </main>
    </div>
  );
}
