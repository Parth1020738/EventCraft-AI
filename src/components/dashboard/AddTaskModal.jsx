import { useState } from 'react';

/**
 * Inline modal form for adding a custom task to the checklist.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal form is displayed
 * @param {Function} props.onClose - Dismiss modal handler
 * @param {Function} props.onAddTask - Add task callback
 */
export default function AddTaskModal({ isOpen, onClose, onAddTask }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Logistics');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskCost, setTaskCost] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddTask({
      id: `custom-task-${Date.now()}`,
      task: taskTitle.trim(),
      category: taskCategory,
      priority: taskPriority,
      estimatedCost: Number(taskCost) || 0,
      status: 'To Do',
    });

    setTaskTitle('');
    setTaskCost('');
    setTaskPriority('Medium');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 animate-fade-in space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">Add New Milestone Task</h4>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <div>
          <label htmlFor="new-task-title" className="sr-only">Task Title</label>
          <input
            id="new-task-title"
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task name (e.g. Schedule cake tasting)"
            className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs outline-none focus:ring-2 focus:ring-indigo-200"
            required
          />
        </div>

        <div>
          <label htmlFor="new-task-category" className="sr-only">Category</label>
          <select
            id="new-task-category"
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value)}
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
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
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
            value={taskCost}
            onChange={(e) => setTaskCost(e.target.value)}
            placeholder="Est. Cost"
            className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs outline-none font-mono"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
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
  );
}

