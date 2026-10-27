import { useState } from 'react';
import { 
  DollarSign, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useEventContext } from '../../context/EventContext';

const CATEGORY_COLORS = [
  { bg: 'bg-indigo-600', text: 'text-indigo-600', ring: 'ring-indigo-500', hex: '#4F46E5' },
  { bg: 'bg-violet-600', text: 'text-violet-600', ring: 'ring-violet-500', hex: '#7C3AED' },
  { bg: 'bg-amber-500', text: 'text-amber-500', ring: 'ring-amber-500', hex: '#F59E0B' },
  { bg: 'bg-rose-500', text: 'text-rose-500', ring: 'ring-rose-500', hex: '#F43F5E' },
  { bg: 'bg-emerald-600', text: 'text-emerald-600', ring: 'ring-emerald-500', hex: '#059669' },
  { bg: 'bg-sky-500', text: 'text-sky-500', ring: 'ring-sky-500', hex: '#0EA5E9' },
];

/**
 * Interactive Budget Allocation Breakdown with real-time sliders and dynamic distribution visualization.
 *
 * @param {Object} props
 * @param {string} props.currencySymbol - e.g. '$', '₹', '€', '£'
 */
export default function BudgetBreakdown({ currencySymbol = '$' }) {
  const { eventData, updateBudgetCategory } = useEventContext();
  const [activeInfo, setActiveInfo] = useState(null);

  if (!eventData?.budget) return null;

  const { totalBudget, allocations } = eventData.budget;
  const maxSliderValue = Math.max(10000, totalBudget * 1.5);

  const handleSliderChange = (category, value) => {
    updateBudgetCategory(category, Number(value));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              Smart Budget Allocation
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Interactive Sliders
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Drag sliders to dynamically rebalance funds across categories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-500 px-2">Total Pool:</span>
          <span className="text-lg font-extrabold font-mono text-indigo-600 bg-white px-3 py-1 rounded-xl shadow-xs border border-slate-200/60">
            {currencySymbol}{totalBudget.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Vendor Transparency Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2 text-slate-600">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Estimated Assumptions:</strong> Figures represent regional planning averages — verify against actual vendor quotes.
          </span>
        </div>
        {eventData.summary?.estimatedGuests > 0 && (
          <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs shrink-0">
            ~{currencySymbol}{Math.round(totalBudget / eventData.summary.estimatedGuests)} / guest
          </span>
        )}
      </div>

      {/* Visual Multi-Segment Distribution Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Distribution Composition</span>
          <span>100% Allocated</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden shadow-inner gap-0.5 p-0.5">
          {allocations.map((item, idx) => {
            const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            return (
              <div
                key={item.category}
                style={{ width: `${Math.max(item.percentage, 2)}%` }}
                className={`${color.bg} h-full rounded-sm transition-all duration-300 relative group`}
                title={`${item.category}: ${item.percentage}%`}
              />
            );
          })}
        </div>
      </div>

      {/* Itemized Category Sliders */}
      <div className="space-y-4">
        {allocations.map((item, idx) => {
          const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
          const isInfoOpen = activeInfo === item.category;

          return (
            <div 
              key={item.category}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${color.bg}`} />
                  <span className="text-sm font-bold text-slate-900">{item.category}</span>
                  <button
                    type="button"
                    onClick={() => setActiveInfo(isInfoOpen ? null : item.category)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 transition-colors"
                    aria-label={`Details for ${item.category}`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-xs">
                    {item.percentage}%
                  </span>
                  <span className="text-sm font-extrabold font-mono text-slate-900">
                    {currencySymbol}{item.allocatedAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Slider Input */}
              <div className="flex items-center gap-4">
                <label htmlFor={`slider-${idx}`} className="sr-only">
                  Adjust {item.category} budget
                </label>
                <input
                  id={`slider-${idx}`}
                  type="range"
                  min="0"
                  max={maxSliderValue}
                  step="50"
                  value={item.allocatedAmount}
                  onChange={(e) => handleSliderChange(item.category, e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
              </div>

              {/* Details & Notes Expandable Section */}
              {isInfoOpen && item.notes && (
                <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100 animate-fade-in space-y-1">
                  <span className="font-semibold text-slate-800">Coordinator Advice:</span>
                  <p className="leading-relaxed">{item.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
