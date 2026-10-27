import { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { useEventContext } from '../../context/EventContext';

/**
 * Actionable, categorized vendor & tasks checklist with priority filters, search, and status progression.
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

    // Immutably append to checklist
    checklist.push(newTask);
    setNewTaskTitle('');
    setNewTaskCost('');
    setShowAddModal(false);
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
              Vendor & Task Checklist
            </h2>
            <p className="text-xs text-slate-500">
              Click any item to advance status: To Do → In Progress → Completed
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
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, vendors, categories..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        {/* Priority Filter */}
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
              {p === 'ALL' ? 'All Priority' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Inline Add Task Form Modal */}
      {showAddModal && (
        <form onSubmit={handleAddNewTask} className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 animate-fade-in space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">Add New Milestone Task</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task name (e.g. Schedule cake tasting)"
              className="sm:col-span-2 px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs outline-none"
            >
              <option value="Venue">Venue</option>
              <option value="Catering">Catering</option>
              <option value="Decor">Decor</option>
              <option value="Media">Media</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Logistics">Logistics</option>
            </select>
            <input
              type="number"
              value={newTaskCost}
              onChange={(e) => setNewTaskCost(e.target.value)}
              placeholder="Est. Cost"
              className="px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs outline-none font-mono"
            />
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
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No checklist items match the current search or filters.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'Completed';
            const isInProgress = task.status === 'In Progress';

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => toggleTask(task.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  isDone
                    ? 'bg-slate-50/70 border-slate-200 opacity-60'
                    : isInProgress
                    ? 'bg-indigo-50/40 border-indigo-200 shadow-xs ring-1 ring-indigo-300'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                } focus-visible:outline-2 focus-visible:outline-indigo-600`}
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
                      {currencySymbol}{task.estimatedCost.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
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
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
