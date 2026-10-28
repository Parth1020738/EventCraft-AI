import { AlertCircle, Check } from 'lucide-react';
import {
  DESIRED_EXPERIENCES,
  THEME_PRESETS,
  MUST_HAVES_OPTIONS,
  ACCESSIBILITY_OPTIONS,
  CULTURAL_PREFERENCES_OPTIONS,
} from './wizardConstants';

/**
 * Step 3: Aesthetics & Atmosphere (Atmosphere, Theme, Must-Haves, Accessibility, Customs, Notes).
 *
 * @param {Object} props
 * @param {Object} props.formData - Form values
 * @param {Function} props.updateField - Field update handler
 * @param {Function} props.toggleArrayOption - Multi-select toggle handler
 * @param {Object} props.errors - Validation errors
 */
export default function WizardStep3({
  formData,
  updateField,
  toggleArrayOption,
  errors,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Desired Experience / Atmosphere */}
      <div className="space-y-2">
        <label id="desired-experience-label" className="block text-sm font-semibold text-slate-800">
          Desired Experience & Atmosphere <span className="text-rose-500">*</span>
        </label>
        <div
          role="radiogroup"
          aria-labelledby="desired-experience-label"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5"
        >
          {DESIRED_EXPERIENCES.map((exp) => {
            const selected = formData.desiredExperience === exp.id;
            return (
              <button
                key={exp.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => updateField('desiredExperience', exp.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selected
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                } focus-visible:outline-2 focus-visible:outline-indigo-600`}
              >
                <span className="font-semibold text-xs text-slate-900 block">{exp.label}</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block leading-tight">{exp.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Theme Suggestions & Custom Input */}
      <div className="space-y-2">
        <label htmlFor="theme-input" className="block text-sm font-semibold text-slate-800">
          Creative Theme & Vibe
        </label>

        {/* Theme Presets */}
        <div className="flex flex-wrap gap-2 mb-2">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => updateField('theme', preset)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                formData.theme === preset
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        <input
          id="theme-input"
          type="text"
          value={formData.theme}
          onChange={(e) => updateField('theme', e.target.value)}
          aria-invalid={!!errors.theme}
          aria-describedby={errors.theme ? 'theme-error' : undefined}
          placeholder="Or type a custom theme (e.g. Cyberpunk Neon Garden)"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
        />
        {errors.theme && (
          <p id="theme-error" className="text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.theme}
          </p>
        )}
      </div>

      {/* 3. Non-Negotiable Must-Haves */}
      <div className="space-y-2">
        <label id="must-haves-label" className="block text-sm font-semibold text-slate-800">
          Non-Negotiable Must-Haves <span className="text-xs text-slate-400 font-normal">(Select all that apply)</span>
        </label>
        <div
          role="group"
          aria-labelledby="must-haves-label"
          className="flex flex-wrap gap-2"
        >
          {MUST_HAVES_OPTIONS.map((item) => {
            const isChecked = (formData.mustHaves || []).includes(item);
            return (
              <button
                key={item}
                type="button"
                aria-pressed={isChecked}
                onClick={() => toggleArrayOption('mustHaves', item)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isChecked
                    ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
                } focus-visible:outline-2 focus-visible:outline-indigo-600`}
              >
                {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Accessibility & Dietary Inclusivity */}
      <div className="space-y-2">
        <label id="accessibility-label" className="block text-sm font-semibold text-slate-800">
          Accessibility & Dietary Accommodations
        </label>
        <div
          role="group"
          aria-labelledby="accessibility-label"
          className="flex flex-wrap gap-2"
        >
          {ACCESSIBILITY_OPTIONS.map((item) => {
            const isChecked = (formData.accessibility || []).includes(item);
            return (
              <button
                key={item}
                type="button"
                aria-pressed={isChecked}
                onClick={() => toggleArrayOption('accessibility', item)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isChecked
                    ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
                } focus-visible:outline-2 focus-visible:outline-emerald-600`}
              >
                {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Cultural & Traditional Preferences */}
      <div className="space-y-2">
        <label id="cultural-label" className="block text-sm font-semibold text-slate-800">
          Cultural & Traditional Customs
        </label>
        <div
          role="group"
          aria-labelledby="cultural-label"
          className="flex flex-wrap gap-2"
        >
          {CULTURAL_PREFERENCES_OPTIONS.map((item) => {
            const isChecked = (formData.culturalPreferences || []).includes(item);
            return (
              <button
                key={item}
                type="button"
                aria-pressed={isChecked}
                onClick={() => toggleArrayOption('culturalPreferences', item)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isChecked
                    ? 'bg-violet-600 text-white shadow-xs ring-2 ring-violet-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
                } focus-visible:outline-2 focus-visible:outline-violet-600`}
              >
                {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Special Instructions / Notes */}
      <div className="space-y-1.5">
        <label htmlFor="notes-textarea" className="block text-sm font-semibold text-slate-800">
          Special Requirements & Notes <span className="text-xs text-slate-400 font-normal">(Optional)</span>
        </label>
        <textarea
          id="notes-textarea"
          rows={3}
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          aria-invalid={!!errors.notes}
          aria-describedby={errors.notes ? 'notes-error' : undefined}
          placeholder="e.g. Vegetarian catering focus, need live acoustic set, strict noise curfew at 10 PM."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
        />
        {errors.notes && (
          <p id="notes-error" className="text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.notes}
          </p>
        )}
      </div>
    </div>
  );
}

