import { AlertTriangle, RefreshCw, Zap } from 'lucide-react';

/**
 * User-facing error message with accessible retry and fallback recovery actions.
 *
 * @param {Object} props
 * @param {string} [props.message] - Error message description
 * @param {Function} [props.onRetry] - Function to trigger retry
 * @param {Function} [props.onFallback] - Function to load deterministic blueprint
 */
export default function ErrorMessage({ message, onRetry, onFallback }) {
  return (
    <div 
      className="max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-white border border-rose-200 rounded-3xl shadow-sm text-center space-y-5"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold font-heading text-slate-900">
          Event Orchestration Halted
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {message || 'The AI service encountered an unexpected error. You can retry the request or load an instant offline blueprint.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry with AI
          </button>
        )}

        {onFallback && (
          <button
            type="button"
            onClick={onFallback}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            Use Offline Blueprint
          </button>
        )}
      </div>
    </div>
  );
}
