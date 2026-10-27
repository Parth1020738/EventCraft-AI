import { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Search,
  HelpCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useEventContext } from '../../context/EventContext';

const VENDOR_VERIFICATION_QUESTIONS = {
  Venue: [
    'What are the overtime fees per additional hour past curfew?',
    'Is setup/teardown time included within the rental window?',
    'Are outside caterers permitted, or is there an exclusive preferred vendor list?',
    'What are the indoor backup arrangements in case of adverse weather?',
  ],
  Catering: [
    'Are servers, bar staff, dinnerware, and linens included in this estimate?',
    'What is the strict cutoff date for final head count lock?',
    'Can special dietary plates (celiac, vegan, halal) be accommodated at no extra fee?',
    'What is the leftover food handling and packing policy?',
  ],
  Media: [
    'How many hours of physical on-site coverage are guaranteed?',
    'What is the guaranteed turnaround timeline for digital edits and highlight reels?',
    'Do you carry backup camera bodies and dual SD-card redundancy on site?',
    'Are full-resolution RAW photos included in the licensing rights?',
  ],
  Decor: [
    'Does your quote include on-site delivery, styling, and midnight strike/teardown?',
    'Are open taper candles or cold-spark pyro allowed at this venue?',
    'Who is liable if floral rental stands or geometric arches are damaged?',
  ],
  Entertainment: [
    'Do you provide your own PA system, wireless mics, and ambient lighting?',
    'Will you act as the official Master of Ceremonies (MC) for guest announcements?',
    'When is the deadline to submit custom "Must-Play" and "Do-Not-Play" song lists?',
  ],
  Logistics: [
    'What is the payment milestone breakdown and cancellation refund policy?',
    'Are delivery vehicle parking permits or loading dock reservations needed?',
    'Is day-of event liability insurance required by the property manager?',
  ],
};

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

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Logistics');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskCost, setNewTaskCost] = useState('');

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

  const handleAddNewTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `custom-task-${Date.now()}`,
      task: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      estimatedCost: Number(newTaskCost) || 0,
      status: 'To Do',
    };

    checklist.push(newTask);
    setNewTaskTitle('');
    setNewTaskCost('');
    setNewTaskPriority('Medium');
    setShowAddModal(false);
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
            {['ALL', 'High', 'Medium', 'Low'].map((p) => (
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
          {['ALL', 'To Do', 'In Progress', 'Completed'].map((s) => (
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
      {showAddModal && (
        <form onSubmit={handleAddNewTask} className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 animate-fade-in space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">Add New Milestone Task</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div>
              <label htmlFor="new-task-title" className="sr-only">Task Title</label>
              <input
                id="new-task-title"
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task name (e.g. Schedule cake tasting)"
                className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs outline-none focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>

            <div>
              <label htmlFor="new-task-category" className="sr-only">Category</label>
              <select
                id="new-task-category"
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs outline-none"
              >
                <option value="Venue">Venue</option>
                <option value="Catering">Catering</option>
                <option value="Decor">Decor</option>
                <option value="Media">Media</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>

            <div>
              <label htmlFor="new-task-priority" className="sr-only">Priority</label>
              <select
                id="new-task-priority"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs outline-none"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div>
              <label htmlFor="new-task-cost" className="sr-only">Estimated Cost</label>
              <input
                id="new-task-cost"
                type="number"
                value={newTaskCost}
                onChange={(e) => setNewTaskCost(e.target.value)}
                placeholder="Est. Cost"
                className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs outline-none font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* Task List Items */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No checklist items match the current search or filters.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'Completed';
            const isInProgress = task.status === 'In Progress';
            const isQuestionsOpen = expandedQuestionsId === task.id;
            const categoryQuestions = VENDOR_VERIFICATION_QUESTIONS[task.category] || VENDOR_VERIFICATION_QUESTIONS.Logistics;

            return (
              <div 
                key={task.id}
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
                  onClick={() => toggleTask(task.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleTask(task.id);
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
                        onClick={(e) => toggleQuestions(e, task.id)}
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
          })
        )}
      </div>
    </div>
  );
}
