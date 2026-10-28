import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle,
  Link2
} from 'lucide-react';
import { useEventContext } from '../../context/EventContext';

/**
 * Calculates remaining days, hours, minutes, and seconds until the target celebration date.
 *
 * @param {string} targetDateStr - Target celebration date (YYYY-MM-DD)
 * @returns {{ days: number, hours: number, minutes: number, seconds: number, isPast: boolean } | null}
 */
function calculateTimeRemaining(targetDateStr) {
  if (!targetDateStr) return null;
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    isPast: false,
  };
}

/**
 * Master Countdown and Interactive Event Timeline with phase filtering,
 * live countdown clock, milestone completion toggles, and sequential prerequisite links.
 *
 * @returns {import('react').JSX.Element|null}
 */
export default function CountdownTimeline() {
  const { eventData, lastParams } = useEventContext();
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState('all');
  const [completedMilestones, setCompletedMilestones] = useState({});

  const targetDateStr = lastParams?.targetDate;
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(targetDateStr));

  useEffect(() => {
    if (!targetDateStr) {
      setTimeLeft(null);
      return;
    }
    setTimeLeft(calculateTimeRemaining(targetDateStr));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetDateStr));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  if (!eventData?.timeline?.phases) return null;

  const phases = eventData.timeline.phases;
  const filteredPhases = selectedPhaseIndex === 'all' 
    ? phases 
    : [phases[Number(selectedPhaseIndex)]].filter(Boolean);

  const toggleMilestone = (milestoneKey) => {
    setCompletedMilestones((prev) => ({
      ...prev,
      [milestoneKey]: !prev[milestoneKey],
    }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header & Live Countdown */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-900">
              Master Countdown & Itinerary
            </h2>
            <p className="text-xs text-slate-500">
              {targetDateStr ? `Target celebration date: ${targetDateStr}` : 'Structured preparation roadmap'}
            </p>
          </div>
        </div>

        {/* Live Countdown Clock */}
        {timeLeft && !timeLeft.isPast && (
          <div className="flex items-center gap-2 self-start lg:self-auto bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-sm">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mr-1" />
            <div className="flex items-center gap-1.5 font-mono text-center">
              <div className="flex flex-col">
                <span className="text-base font-bold leading-none">{timeLeft.days}</span>
                <span className="text-[9px] text-slate-400 uppercase">Days</span>
              </div>
              <span className="text-slate-500 text-xs">:</span>
              <div className="flex flex-col">
                <span className="text-base font-bold leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[9px] text-slate-400 uppercase">Hrs</span>
              </div>
              <span className="text-slate-500 text-xs">:</span>
              <div className="flex flex-col">
                <span className="text-base font-bold leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[9px] text-slate-400 uppercase">Min</span>
              </div>
              <span className="text-slate-500 text-xs">:</span>
              <div className="flex flex-col">
                <span className="text-base font-bold leading-none text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[9px] text-slate-400 uppercase">Sec</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phase Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedPhaseIndex('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedPhaseIndex === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          All Phases ({phases.length})
        </button>
        {phases.map((phase, pIdx) => (
          <button
            key={pIdx}
            type="button"
            onClick={() => setSelectedPhaseIndex(String(pIdx))}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedPhaseIndex === String(pIdx)
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Phase {pIdx + 1}
          </button>
        ))}
      </div>

      {/* Timeline Progression List */}
      <div className="space-y-6 pt-2">
        {filteredPhases.map((phase, pIdx) => (
          <div key={pIdx} className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-sm font-bold font-heading text-indigo-950 uppercase tracking-wide flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 inline-flex items-center justify-center text-xs font-bold font-mono">
                  {pIdx + 1}
                </span>
                {phase.phaseName}
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                {phase.targetPeriod}
              </span>
            </div>

            <div className="space-y-2.5 pl-3 border-l-2 border-indigo-100 ml-3">
              {phase.milestones.map((milestone, mIdx) => {
                const key = `${pIdx}-${mIdx}-${milestone.title}`;
                const isDone = !!completedMilestones[key];

                return (
                  <button
                    key={mIdx}
                    type="button"
                    aria-label={`Toggle milestone: ${milestone.title}. Status: ${isDone ? 'Completed' : 'Pending'}`}
                    onClick={() => toggleMilestone(key)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                      isDone
                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    } focus-visible:outline-2 focus-visible:outline-indigo-600`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {milestone.title}
                        </span>
                        <span className="text-[11px] font-mono text-indigo-600 shrink-0 font-medium bg-indigo-50 px-2 py-0.5 rounded">
                          {milestone.dueTime}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${isDone ? 'line-through text-slate-400' : 'text-slate-600'}`}>
                        {milestone.description}
                      </p>
                      {/* Sequential Task Dependency Badge */}
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1 font-medium">
                        <Link2 className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span>
                          {pIdx === 0
                            ? 'Root Prerequisite: Milestone initiates planning sequence'
                            : pIdx === 1
                            ? 'Depends on: Phase 1 Venue agreement & primary deposits settled'
                            : 'Depends on: Phase 2 Headcount lock & menu tastings completed'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
