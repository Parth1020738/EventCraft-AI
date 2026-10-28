import { useState } from 'react';
import { Scale, Utensils, Camera, Building2, ShieldAlert, Check, ArrowRight } from 'lucide-react';
import { useEventContext } from '../../context/EventContext';

/**
 * Curated trade-off strategies for rebalancing allocations under varying priorities.
 */
const TRADE_OFF_STRATEGIES = [
  {
    id: 'GASTRONOMY_FOCUS',
    title: 'Gourmet Dining & Open Bar',
    icon: Utensils,
    color: 'from-amber-500 to-rose-500',
    summary: 'Prioritize food & beverages by trimming disposable decor & physical paper invitations.',
    boosts: ['+8% Catering & Beverages'],
    reduces: ['-5% Decor & Floral', '-3% Physical Favors/Logistics'],
    recommendation: 'Ideal when guest delight centers around an unforgettable culinary banquet.',
  },
  {
    id: 'MEDIA_FOCUS',
    title: 'Cinematic Media & Entertainment',
    icon: Camera,
    color: 'from-violet-500 to-indigo-600',
    summary: 'Invest in premium photography, drone videography, and high-energy live performance.',
    boosts: ['+7% Entertainment & Photo'],
    reduces: ['-4% Elaborate Floral Displays', '-3% Contingency Buffers'],
    recommendation: 'Best for milestone events where capturing timeless memories is paramount.',
  },
  {
    id: 'VENUE_FOCUS',
    title: 'Iconic Venue Prestige',
    icon: Building2,
    color: 'from-indigo-600 to-blue-600',
    summary: 'Secure a scenic estate or historic hall that provides natural architectural beauty.',
    boosts: ['+8% Venue & Facilities'],
    reduces: ['-4% Custom Stage Decor', '-2% DJ Packages', '-2% Favors'],
    recommendation: 'Natural venue charm reduces the need for expensive artificial decoration.',
  },
  {
    id: 'INFLATION_BUFFER',
    title: 'Price Inflation & Contingency Shield',
    icon: ShieldAlert,
    color: 'from-emerald-500 to-teal-600',
    summary: 'Prepare for 15-20% vendor price surges and surprise last-minute costs.',
    boosts: ['+8% Contingency Reserve'],
    reduces: ['-3% Venue Extras', '-3% Catering Upgrades', '-2% Decor'],
    recommendation: 'Recommended for peace of mind against vendor rate volatility.',
  },
];

/**
 * Trade-Off Advisor Component.
 * Implements the PromptWars Challenge 05 Explainer Seminar core trade-off decision engine.
 *
 * @returns {import('react').JSX.Element}
 */
export default function TradeOffAdvisor() {
  const { applyTradeOff } = useEventContext();
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [appliedStrategy, setAppliedStrategy] = useState(null);

  const handleApply = (strategyId) => {
    applyTradeOff(strategyId);
    setAppliedStrategy(strategyId);
    setTimeout(() => setAppliedStrategy(null), 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              Strategic Trade-Off Engine
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                Decision Science
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Event planning is interconnected decisions. Choose what matters most when budget constraints tighten.
            </p>
          </div>
        </div>

        {appliedStrategy && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 animate-fade-in self-start sm:self-auto">
            <Check className="w-4 h-4 text-emerald-600" />
            Trade-Off Strategy Applied!
          </span>
        )}
      </div>

      {/* Strategy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TRADE_OFF_STRATEGIES.map((strat) => {
          const Icon = strat.icon;
          const isSelected = selectedStrategy === strat.id;

          return (
            <div
              key={strat.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                  : 'border-slate-200/80 bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{strat.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {strat.summary}
                </p>

                {/* Trade-off Impact Badges */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {strat.boosts.map((boost, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                        {boost}
                      </span>
                    ))}
                    {strat.reduces.map((red, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-medium border border-rose-200">
                        {red}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 italic pt-1">{strat.recommendation}</p>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedStrategy(strat.id);
                  handleApply(strat.id);
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600 shadow-xs"
              >
                <span>Adopt Trade-Off Strategy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
