import { useState } from 'react';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const PRIORITY_STYLES = {
  low: 'bg-slate-100 text-slate-500',
  medium: 'bg-orange-100 text-orange-600',
  high: 'bg-red-100 text-red-600',
};

const TaskCard = ({ task, onUpdate, onDelete, onEdit }) => {
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleStatusCycle = async () => {
    const cycle = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };
    const next = cycle[task.status];
    setUpdating(true);
    try {
      await onUpdate(task.id, { status: next });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setDeleting(false);
    }
  };

  const isOverdue =
    task.due_date &&
    task.status !== 'completed' &&
    new Date(task.due_date) < new Date();

  return (
    <div className={`card p-4 flex flex-col gap-3 animate-fade-in transition-all hover:shadow-md ${
      task.status === 'completed' ? 'opacity-75' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`font-semibold text-slate-800 leading-snug ${
            task.status === 'completed' ? 'line-through text-slate-400' : ''
          }`}
        >
          {task.title}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Edit */}
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </button>
          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap mt-auto pt-1 border-t border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority badge */}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>

          {/* Due date */}
          {task.due_date && (
            <span className={`text-xs font-medium flex items-center gap-1 ${
              isOverdue ? 'text-red-500' : 'text-slate-400'
            }`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
              {isOverdue ? 'Overdue · ' : ''}{new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>

        {/* Status toggle */}
        <button
          onClick={handleStatusCycle}
          disabled={updating}
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all hover:opacity-80 disabled:opacity-50 ${STATUS_STYLES[task.status]}`}
        >
          {updating ? '…' : STATUS_LABELS[task.status]}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
