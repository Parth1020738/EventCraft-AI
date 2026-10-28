import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { VENDOR_VERIFICATION_QUESTIONS } from './vendorConstants';

/**
 * Individual checklist task card with completion toggle, priority indicators,
 * and expandable vendor interview verification questionnaire.
 *
 * @param {Object} props
 * @param {Object} props.task - Task record
 * @param {Function} props.onToggle - Task status toggle handler
 * @param {boolean} props.isQuestionsOpen - Accordion state
 * @param {Function} props.onToggleQuestions - Accordion toggle handler
 * @param {string} props.currencySymbol - Currency symbol
 */
export default function VendorTaskCard({
  task,
  onToggle,
  isQuestionsOpen,
  onToggleQuestions,
  currencySymbol = '$',
}) {
  const isDone = task.status === 'Completed';
  const isInProgress = task.status === 'In Progress';
  const categoryQuestions = VENDOR_VERIFICATION_QUESTIONS[task.category] || VENDOR_VERIFICATION_QUESTIONS.Logistics;

  return (
    <div 
      className={`rounded-2xl border transition-all ${
        isDone
          ? 'bg-slate-50/70 border-slate-200 opacity-70'
          : isInProgress
          ? 'bg-indigo-50/40 border-indigo-200 shadow-xs ring-1 ring-indigo-300'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div 
        role="button"
        tabIndex={0}
        aria-label={`Toggle task: ${task.task}. Current status: ${task.status}`}
        onClick={() => onToggle(task.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle(task.id);
          }
        }}
        className="w-full p-4 text-left cursor-pointer flex items-start gap-3.5 focus-visible:outline-2 focus-visible:outline-indigo-600 rounded-2xl"
      >
        <div className="mt-0.5 shrink-0">
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : isInProgress ? (
            <Clock className="w-5 h-5 text-indigo-600 animate-pulse" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300" />
          )}
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
              {task.task}
            </span>
            <span className="font-mono text-xs font-bold text-slate-700">
              ~{currencySymbol}{task.estimatedCost.toLocaleString()} (Est.)
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                {task.category}
              </span>
              <span className={`px-2 py-0.5 rounded-md font-semibold ${
                task.priority === 'High' 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                  : task.priority === 'Medium' 
                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {task.priority} Priority
              </span>
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                isDone 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : isInProgress 
                  ? 'bg-indigo-100 text-indigo-800' 
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {task.status}
              </span>
            </div>

            {/* Toggle Verification Questions Button */}
            <button
              type="button"
              onClick={(e) => onToggleQuestions(e, task.id)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 py-0.5 px-2 rounded-lg bg-indigo-50/80 hover:bg-indigo-100 transition-colors"
              aria-expanded={isQuestionsOpen}
              aria-label={`Questions to ask for ${task.category}`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Vendor Quoting Guide</span>
              {isQuestionsOpen ? (
                <ChevronUp className="w-3 h-3 ml-0.5" />
              ) : (
                <ChevronDown className="w-3 h-3 ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Verification Questions Accordion */}
      {isQuestionsOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 animate-fade-in space-y-2">
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
            Questions to Ask This Vendor Before Signing Contract:
          </span>
          <ul className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            {categoryQuestions.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold shrink-0">?</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
