import { useState } from 'react';
import { 
  CheckCircle2, 
  Plus, 
  Search,
  AlertTriangle
} from 'lucide-react';
import { useEventContext } from '../../context/EventContext';
import { PRIORITY_FILTERS, STATUS_FILTERS } from './vendorConstants';
import AddTaskModal from './AddTaskModal';
import VendorTaskCard from './VendorTaskCard';

/**
 * Actionable, categorized vendor & tasks checklist with priority filters, search,
 * transparent estimation labels, and vendor verification quoting questions.
 *
 * @param {Object} props
 * @param {string} props.currencySymbol - e.g. '$', '₹', '€', '£'
 */
export default function VendorChecklist({ currencySymbol = '$' }) {
  const { eventData, toggleTask } = useEventContext();
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedQuestionsId, setExpandedQuestionsId] = useState(null);

  if (!eventData?.checklist) return null;

  const checklist = eventData.checklist;

  // Filter tasks based on search, status, and priority
  const filteredTasks = checklist.filter((task) => {
    const matchesSearch = task.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const completedCount = checklist.filter((t) => t.status === 'Completed').length;
  const inProgressCount = checklist.filter((t) => t.status === 'In Progress').length;
  const completionPercentage = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  const handleAddNewTask = (newTask) => {
    checklist.push(newTask);
  };

  const toggleQuestions = (e, taskId) => {
    e.stopPropagation();
    setExpandedQuestionsId((prev) => (prev === taskId ? null : taskId));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header & Progress Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-900">
              Vendor Coordination & Task Checklist
            </h2>
            <p className="text-xs text-slate-500">
              Actionable milestones, status tracking, and verification questions for real-world quoting
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(!showAddModal)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Custom Task
        </button>
      </div>

      {/* Transparency Disclaimer Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <span className="font-bold">Vendor Transparency Disclaimer:</span>
          <p className="text-amber-800 text-[11px]">
            All pricing figures shown represent <strong>Estimated Assumptions</strong> based on regional averages — not claimed confirmed quotes. Use our vendor verification questions below to obtain exact real-world bids.
          </p>
        </div>
      </div>

      {/* Completion Progress Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Readiness Score: {completionPercentage}% Completed</span>
          <span className="text-slate-500 font-mono">
            {completedCount} Done • {inProgressCount} In Progress • {checklist.length - completedCount - inProgressCount} To Do
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <label htmlFor="checklist-search-input" className="sr-only">
              Search tasks or vendors
            </label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              id="checklist-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, vendors, categories..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>

          {/* Priority Filters */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
            {PRIORITY_FILTERS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterPriority === p
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {p === 'ALL' ? 'All Priority' : `${p} Priority`}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Status:</span>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterStatus === s
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {s === 'ALL' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Inline Add Task Form Modal */}
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddTask={handleAddNewTask}
      />

      {/* Task List Items */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No checklist items match the current search or filters.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <VendorTaskCard
              key={task.id}
              task={task}
              onToggle={toggleTask}
              isQuestionsOpen={expandedQuestionsId === task.id}
              onToggleQuestions={toggleQuestions}
              currencySymbol={currencySymbol}
            />
          ))
        )}
      </div>
    </div>
  );
}
