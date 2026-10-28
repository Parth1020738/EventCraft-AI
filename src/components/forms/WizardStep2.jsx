import { AlertCircle } from 'lucide-react';
import { CURRENCIES, LOCATION_TYPES } from './wizardConstants';

/**
 * Step 2: Budget & Venue Dynamics (Currency, Total Budget, Venue Type).
 *
 * @param {Object} props
 * @param {Object} props.formData - Form values
 * @param {Function} props.updateField - Update handler
 * @param {Object} props.errors - Validation errors
 */
export default function WizardStep2({ formData, updateField, errors }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Currency & Total Budget */}
      <div className="space-y-2">
        <label htmlFor="total-budget-input" className="block text-sm font-semibold text-slate-800">
          Total Planned Budget <span className="text-rose-500">*</span>
        </label>

        <div className="flex gap-2">
          {/* Currency Dropdown */}
          <label htmlFor="currency-select" className="sr-only">
            Currency Selector
          </label>
          <select
            id="currency-select"
            value={formData.currency}
            onChange={(e) => updateField('currency', e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Amount Input */}
          <div className="relative flex-1">
            <input
              id="total-budget-input"
              type="number"
              min="100"
              step="100"
              value={formData.budget}
              onChange={(e) => updateField('budget', e.target.value)}
              aria-invalid={!!errors.budget}
              aria-describedby={errors.budget ? 'budget-error' : undefined}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-mono text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              placeholder="e.g. 5000"
            />
          </div>
        </div>

        {errors.budget && (
          <p id="budget-error" className="text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.budget}
          </p>
        )}
      </div>

      {/* Location Type Cards */}
      <div className="space-y-2">
        <label id="location-type-label" className="block text-sm font-semibold text-slate-800">
          Preferred Venue Setting <span className="text-rose-500">*</span>
        </label>
        <div 
          role="radiogroup" 
          aria-labelledby="location-type-label"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {LOCATION_TYPES.map((loc) => {
            const selected = formData.locationType === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => updateField('locationType', loc.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selected
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                } focus-visible:outline-2 focus-visible:outline-indigo-600`}
              >
                <span className="font-semibold text-sm text-slate-900 block">{loc.label}</span>
                <span className="text-xs text-slate-500 mt-1 block">{loc.desc}</span>
              </button>
            );
          })}
        </div>
        {errors.locationType && (
          <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.locationType}
          </p>
        )}
      </div>
    </div>
  );
}

