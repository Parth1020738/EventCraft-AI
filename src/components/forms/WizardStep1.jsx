import { AlertCircle } from 'lucide-react';
import { EVENT_TYPES } from './wizardConstants';

/**
 * Step 1: Celebration Essentials (Event Type, Target Date, Headcount).
 *
 * @param {Object} props
 * @param {Object} props.formData - Form values
 * @param {Function} props.updateField - Update handler
 * @param {Object} props.errors - Validation errors
 * @param {string} props.todayString - Minimum date limit string (YYYY-MM-DD)
 */
export default function WizardStep1({ formData, updateField, errors, todayString }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Event Type Selection */}
      <div className="space-y-2">
        <label id="event-type-label" className="block text-sm font-semibold text-slate-800">
          Celebration Type <span className="text-rose-500">*</span>
        </label>
        <div 
          role="radiogroup" 
          aria-labelledby="event-type-label"
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {EVENT_TYPES.map((type) => {
            const selected = formData.eventType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => updateField('eventType', type.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  selected
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                } focus-visible:outline-2 focus-visible:outline-indigo-600`}
              >
                <span className="text-2xl mb-1">{type.icon}</span>
                <span className="font-semibold text-sm text-slate-900">{type.label}</span>
                <span className="text-xs text-slate-500 mt-0.5">{type.desc}</span>
              </button>
            );
          })}
        </div>
        {errors.eventType && (
          <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.eventType}
          </p>
        )}
      </div>

      {/* Target Date & Guest Count Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Target Date */}
        <div className="space-y-1.5">
          <label htmlFor="target-date-input" className="block text-sm font-semibold text-slate-800">
            Target Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="target-date-input"
              type="date"
              min={todayString}
              value={formData.targetDate}
              onChange={(e) => updateField('targetDate', e.target.value)}
              aria-invalid={!!errors.targetDate}
              aria-describedby={errors.targetDate ? 'target-date-error' : undefined}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
          {errors.targetDate && (
            <p id="target-date-error" className="text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.targetDate}
            </p>
          )}
        </div>

        {/* Guest Count */}
        <div className="space-y-1.5">
          <label htmlFor="guest-count-input" className="block text-sm font-semibold text-slate-800">
            Guest Count <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="guest-count-input"
              type="number"
              min="1"
              max="100000"
              value={formData.guestCount}
              onChange={(e) => updateField('guestCount', e.target.value)}
              aria-invalid={!!errors.guestCount}
              aria-describedby={errors.guestCount ? 'guest-count-error' : undefined}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
          {/* Quick Increment Buttons */}
          <div className="flex items-center gap-2 pt-1">
            {[25, 50, 100, 250].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => updateField('guestCount', count)}
                className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                {count}
              </button>
            ))}
          </div>
          {errors.guestCount && (
            <p id="guest-count-error" className="text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.guestCount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

