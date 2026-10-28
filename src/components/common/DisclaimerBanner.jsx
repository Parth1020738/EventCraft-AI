import { AlertCircle, AlertTriangle } from 'lucide-react';

/**
 * Reusable transparency disclaimer banner informing users that pricing figures
 * are regional estimated assumptions, optionally displaying per-guest costs.
 *
 * @param {Object} props
 * @param {'amber' | 'slate'} [props.variant='amber'] - Visual color scheme
 * @param {string} [props.title='Vendor Transparency Disclaimer:'] - Notice title
 * @param {string} [props.message] - Notice descriptive message
 * @param {string} [props.perGuestCost] - Optional formatted per-guest estimate (e.g. '$100 / guest')
 * @returns {import('react').JSX.Element}
 */
export default function DisclaimerBanner({
  variant = 'amber',
  title = 'Vendor Transparency Disclaimer:',
  message = 'All pricing figures shown represent Estimated Assumptions based on regional averages — not claimed confirmed quotes. Use our vendor verification questions below to obtain exact real-world bids.',
  perGuestCost,
}) {
  const isAmber = variant === 'amber';
  const Icon = isAmber ? AlertTriangle : AlertCircle;

  return (
    <div
      role="note"
      aria-label={title}
      className={`p-3.5 rounded-2xl border flex items-start sm:items-center justify-between gap-3 text-xs ${
        isAmber
          ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
          : 'bg-slate-50 border-slate-200/70 text-slate-700'
      }`}
    >
      <div className="flex items-start sm:items-center gap-2.5">
        <Icon className={`w-4 h-4 shrink-0 mt-0.5 sm:mt-0 ${isAmber ? 'text-amber-600' : 'text-amber-500'}`} />
        <div className="space-y-0.5 leading-relaxed">
          <span className="font-bold mr-1">{title}</span>
          <span className={isAmber ? 'text-amber-800 text-[11px]' : 'text-slate-600 text-[11px]'}>
            {message}
          </span>
        </div>
      </div>
      {perGuestCost && (
        <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs shrink-0">
          ~{perGuestCost}
        </span>
      )}
    </div>
  );
}

