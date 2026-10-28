import { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  PartyPopper, 
  Flame, 
  MessageSquareQuote, 
  Tag 
} from 'lucide-react';
import { useEventContext } from '../../context/EventContext';
import { sanitizeFileName } from '../../utils/sanitizers';

/**
 * Fallback aesthetic color swatches if plan does not provide a palette.
 */
const DEFAULT_COLOR_PALETTE = ['#4F46E5', '#7C3AED', '#F59E0B', '#F43F5E'];

/**
 * Creative Theme & Idea Showcase with interactive color swatches, invitation phrasings, and plan export.
 *
 * @returns {import('react').JSX.Element|null}
 */
export default function ThemeShowcase() {
  const { eventData } = useEventContext();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedHex, setCopiedHex] = useState(null);

  if (!eventData?.creativeIdeas) return null;

  const { themeSuggestions, decorIdeas, invitationPhrasing, entertainmentSuggestions } = eventData.creativeIdeas;
  const colorPalette = eventData.summary.colorPalette || DEFAULT_COLOR_PALETTE;

  const handleCopyText = async (text, index) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    } catch (err) {
      console.warn('Clipboard write text rejected:', err);
    }
  };

  const handleCopyHex = async (hex) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(hex);
        setCopiedHex(hex);
        setTimeout(() => setCopiedHex(null), 2000);
      }
    } catch (err) {
      console.warn('Clipboard write hex rejected:', err);
    }
  };

  const handleExportJSON = () => {
    const rawTitle = eventData?.summary?.title || 'Celebration_Plan';
    const safeTitle = sanitizeFileName(rawTitle);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(eventData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${safeTitle}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-900">
              Creative Concepts & Inspiration
            </h2>
            <p className="text-xs text-slate-500">
              Personalized aesthetics, phrasing, decor accents, and export options
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-200 transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Summary
          </button>
        </div>
      </div>

      {/* Interactive Color Palette */}
      <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-600" />
            Aesthetic Color Palette (Click to Copy HEX)
          </span>
          {copiedHex && (
            <span className="text-xs text-emerald-600 font-semibold animate-fade-in flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Copied {copiedHex}!
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {colorPalette.map((hex, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Copy color code ${hex}`}
              onClick={() => handleCopyHex(hex)}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 transition-all flex items-center gap-3 text-left shadow-xs focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <div 
                className="w-8 h-8 rounded-lg shadow-inner border border-black/10 shrink-0" 
                style={{ backgroundColor: hex }} 
              />
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold text-slate-900">{hex}</span>
                <span className="text-[10px] text-slate-400">Click to copy</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Suggestions Banner */}
      {themeSuggestions && themeSuggestions.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-indigo-600" />
            Curated Theme Direction & Aesthetic Variations
          </h3>
          <div className="flex flex-wrap gap-2">
            {themeSuggestions.map((theme, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-xs">
                ✨ {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Creative Cards Grid: Phrasing, Decor, Entertainment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invitation Phrasing */}
        <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-2">
            <MessageSquareQuote className="w-4 h-4 text-indigo-600" />
            Invitation Phrasing
          </h3>
          <div className="space-y-2.5">
            {invitationPhrasing?.map((quote, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white border border-indigo-100 shadow-xs space-y-2">
                <p className="text-xs italic text-slate-700 leading-relaxed font-serif">
                  {quote}
                </p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    aria-label={`Copy invitation quote: ${quote}`}
                    onClick={() => handleCopyText(quote, idx)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decor & Styling Accents */}
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100/80 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600" />
            Decor & Atmosphere
          </h3>
          <ul className="space-y-2">
            {decorIdeas?.map((idea, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-white border border-amber-100 shadow-xs text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-amber-500 font-bold shrink-0">•</span>
                <span>{idea}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Entertainment & Guest Activities */}
        <div className="p-5 rounded-2xl bg-violet-50/60 border border-violet-100/80 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-violet-900 flex items-center gap-2">
            <PartyPopper className="w-4 h-4 text-violet-600" />
            Music & Experiences
          </h3>
          <ul className="space-y-2">
            {entertainmentSuggestions?.map((act, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-white border border-violet-100 shadow-xs text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                <span className="text-violet-500 font-bold shrink-0">•</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
