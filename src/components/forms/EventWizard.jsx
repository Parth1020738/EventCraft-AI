import { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { validateStep1, validateStep2, validateStep3 } from '../../utils/validators';
import { INITIAL_FORM_DATA } from './wizardConstants';
import WizardStep1 from './WizardStep1';
import WizardStep2 from './WizardStep2';
import WizardStep3 from './WizardStep3';

/**
 * Multi-Step Event Planning Wizard Form.
 * Features 3 progressive steps, validation, and full WCAG accessibility.
 *
 * @param {Object} props
 * @param {Function} props.onSubmit - Submission callback receiving form data
 * @param {boolean} props.isSubmitting - Loading state flag
 */
export default function EventWizard({ onSubmit, isSubmitting }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
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

  const toggleArrayOption = (field, option) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [field]: updated };
    });
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
        {currentStep === 1 && (
          <WizardStep1
            formData={formData}
            updateField={updateField}
            errors={errors}
            todayString={todayString}
          />
        )}

        {currentStep === 2 && (
          <WizardStep2
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        )}

        {currentStep === 3 && (
          <WizardStep3
            formData={formData}
            updateField={updateField}
            toggleArrayOption={toggleArrayOption}
            errors={errors}
          />
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
