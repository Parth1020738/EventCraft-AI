import { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Users, 
  DollarSign, 
  MapPin, 
  Palette, 
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { validateStep1, validateStep2, validateStep3 } from '../../utils/validators';

const EVENT_TYPES = [
  { id: 'Wedding', label: 'Wedding', icon: '💍', desc: 'Ceremony & reception' },
  { id: 'Birthday', label: 'Birthday', icon: '🎂', desc: 'Milestone & party' },
  { id: 'Anniversary', label: 'Anniversary', icon: '🥂', desc: 'Love & celebration' },
  { id: 'Community Event', label: 'Community Event', icon: '🎪', desc: 'Festival & gathering' },
  { id: 'Corporate', label: 'Corporate Gala', icon: '💼', desc: 'Conference & dinner' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
];

const LOCATION_TYPES = [
  { id: 'Indoor', label: 'Indoor Hall', desc: 'Banquet hall or ballroom' },
  { id: 'Outdoor', label: 'Outdoor Garden', desc: 'Lawn, beach, or vineyard' },
  { id: 'Hybrid', label: 'Hybrid Space', desc: 'Indoor dining + outdoor patio' },
];

const THEME_PRESETS = [
  'Royal Elegance & Warm Glow',
  'Rustic Botanical & Fairy Lights',
  'Sunset Bohemian Radiance',
  'Modern Monochrome Chic',
  'Retro Glamour & Velvet',
];

/**
 * Multi-Step Event Planning Wizard Form.
 * Features 3 progressive steps, validation, and full WCAG accessibility.
 */
export default function EventWizard({ onSubmit, isSubmitting }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    eventType: 'Wedding',
    targetDate: '',
    guestCount: 75,
    budget: 8000,
    currency: 'USD',
    locationType: 'Indoor',
    theme: 'Royal Elegance & Warm Glow',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleNext = () => {
    let result = { isValid: true, errors: {} };
    if (currentStep === 1) {
      result = validateStep1(formData);
    } else if (currentStep === 2) {
      result = validateStep2(formData);
    }

    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result3 = validateStep3(formData);
    if (!result3.isValid) {
      setErrors(result3.errors);
      return;
    }
    setErrors({});
    onSubmit(formData);
  };

  // Compute minimum selectable date (today)
  const todayString = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10">
      {/* Wizard Header & Progress Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 font-heading">
              Step {currentStep} of 3
            </span>
            <h2 className="text-2xl font-bold font-heading text-slate-900">
              {currentStep === 1 && 'Celebration Essentials'}
              {currentStep === 2 && 'Budget & Venue Dynamics'}
              {currentStep === 3 && 'Aesthetics & Atmosphere'}
            </h2>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            GenAI Configurator
          </span>
        </div>

        {/* Accessible Progress Indicator */}
        <nav aria-label="Progress" className="w-full">
          <ol className="flex items-center gap-2">
            {[1, 2, 3].map((step) => {
              const isActive = step === currentStep;
              const isPassed = step < currentStep;
              return (
                <li 
                  key={step} 
                  className="flex-1"
                  aria-current={isActive ? 'step' : undefined}
                >
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isPassed 
                        ? 'bg-indigo-600' 
                        : isActive 
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-600' 
                        : 'bg-slate-100'
                    }`} 
                  />
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* ================= STEP 1: BASIC DETAILS ================= */}
        {currentStep === 1 && (
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
        )}

        {/* ================= STEP 2: BUDGET & LOCATION ================= */}
        {currentStep === 2 && (
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
        )}

        {/* ================= STEP 3: THEMES & PREFERENCES ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            {/* Theme Suggestions & Custom Input */}
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
                placeholder="Or type a custom theme (e.g. Cyberpunk Neon Garden)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
              {errors.theme && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.theme}
                </p>
              )}
            </div>

            {/* Special Instructions / Notes */}
            <div className="space-y-1.5">
              <label htmlFor="notes-textarea" className="block text-sm font-semibold text-slate-800">
                Special Requirements & Dietary Notes <span className="text-xs text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="notes-textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="e.g. Vegetarian catering focus, need live acoustic set, strict noise curfew at 10 PM."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
              />
              {errors.notes && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.notes}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-bold shadow-md shadow-indigo-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Generate AI Event Plan
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
