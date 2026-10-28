import { useState, useEffect } from 'react';
import { RefreshCw, Users, DollarSign, Calendar, TrendingUp, Check } from 'lucide-react';
import { useEventContext } from '../../context/EventContext';

/**
 * Scenario Recalculation Widget.
 * Empowers users to test what-if scenarios (guest count changes, budget increases/decreases)
 * and dynamically recalculates the live plan without forcing a restart.
 *
 * @param {Object} props
 * @param {string} [props.currencySymbol='$'] - Active currency symbol
 * @returns {import('react').JSX.Element}
 */
export default function ScenarioRecalculator({ currencySymbol = '$' }) {
  const { eventData, lastParams, updateScenario } = useEventContext();

  const currentBudget = eventData?.budget?.totalBudget || 5000;
  const currentGuests = eventData?.summary?.estimatedGuests || 50;
  const currentDate = lastParams?.targetDate || '';

  const [simGuests, setSimGuests] = useState(currentGuests);
  const [simBudget, setSimBudget] = useState(currentBudget);
  const [simDate, setSimDate] = useState(currentDate);
  const [appliedNotice, setAppliedNotice] = useState(false);

  // Synchronize simulation baselines whenever live plan updates
  useEffect(() => {
    setSimGuests(currentGuests);
    setSimBudget(currentBudget);
  }, [currentGuests, currentBudget]);

  useEffect(() => {
    setSimDate(currentDate);
  }, [currentDate]);

  const currentPerGuest = Math.round(currentBudget / Math.max(1, currentGuests));
  const simPerGuest = Math.round((Number(simBudget) || currentBudget) / Math.max(1, Number(simGuests) || 1));
  const guestDelta = (Number(simGuests) || currentGuests) - currentGuests;
  const budgetDelta = (Number(simBudget) || currentBudget) - currentBudget;

  const handleApply = (e) => {
    e.preventDefault();
    updateScenario({
      budget: Number(simBudget) || currentBudget,
      guestCount: Number(simGuests) || currentGuests,
      targetDate: simDate,
    });
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              Dynamic Scenario Recalculator
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Simulation
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Test what-if changes (headcount surges, budget adjustments) without losing your plan
            </p>
          </div>
        </div>

        {appliedNotice && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 animate-fade-in self-start sm:self-auto">
            <Check className="w-4 h-4 text-emerald-600" />
            Plan Dynamically Recalculated!
          </span>
        )}
      </div>

      {/* Interactive Controls & Real-Time Metrics */}
      <form onSubmit={handleApply} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Guest Count Simulation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <label htmlFor="scenario-guests-input" className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              Adjust Headcount
            </label>
            <div className="flex items-center gap-2">
              <input
                id="scenario-guests-input"
                type="number"
                min="1"
                max="50000"
                value={simGuests}
                onChange={(e) => setSimGuests(e.target.value === '' ? '' : Math.max(1, Math.min(50000, Number(e.target.value))))}
                onBlur={() => setSimGuests((prev) => (prev === '' ? currentGuests : Math.max(1, Math.min(50000, Number(prev)))))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Baseline: {currentGuests}</span>
              <span className={guestDelta > 0 ? 'text-amber-600 font-semibold' : guestDelta < 0 ? 'text-indigo-600 font-semibold' : ''}>
                {guestDelta > 0 ? `+${guestDelta} Guests` : guestDelta < 0 ? `${guestDelta} Guests` : 'Unchanged'}
              </span>
            </div>
          </div>

          {/* Budget Simulation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <label htmlFor="scenario-budget-input" className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-600" />
              Adjust Total Budget
            </label>
            <div className="flex items-center gap-2">
              <input
                id="scenario-budget-input"
                type="number"
                min="100"
                step="100"
                value={simBudget}
                onChange={(e) => setSimBudget(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                onBlur={() => setSimBudget((prev) => (prev === '' ? currentBudget : Math.max(100, Number(prev))))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Baseline: {currencySymbol}{currentBudget.toLocaleString()}</span>
              <span className={budgetDelta > 0 ? 'text-emerald-600 font-semibold' : budgetDelta < 0 ? 'text-rose-600 font-semibold' : ''}>
                {budgetDelta > 0 ? `+${currencySymbol}${budgetDelta.toLocaleString()}` : budgetDelta < 0 ? `-${currencySymbol}${Math.abs(budgetDelta).toLocaleString()}` : 'Unchanged'}
              </span>
            </div>
          </div>

          {/* Date Shift Simulation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <label htmlFor="scenario-date-input" className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-violet-600" />
              Shift Target Date
            </label>
            <input
              id="scenario-date-input"
              type="date"
              value={simDate}
              onChange={(e) => setSimDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <div className="text-[11px] text-slate-500 pt-1">
              <span>{simDate ? `New target: ${simDate}` : 'Date unchanged'}</span>
            </div>
          </div>
        </div>

        {/* Real-Time Impact Metric Preview */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-950 block">Cost Per Attendee Projection</span>
              <span className="text-[11px] text-indigo-700">
                Baseline: {currencySymbol}{currentPerGuest}/guest → Projected: {currencySymbol}{simPerGuest}/guest
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-200 transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Recalculate Plan
          </button>
        </div>
      </form>
    </div>
  );
}
