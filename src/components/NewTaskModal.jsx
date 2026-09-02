import { useState } from 'react';
import { useBoard } from '../context/BoardContext';

export default function NewTaskModal({ onClose, defaultColumnId }) {
  const { columns, tasks, addTask } = useBoard();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState(defaultColumnId || columns[0]?.id);
  const [dependsOn, setDependsOn] = useState([]);

  function toggleDep(id) {
    setDependsOn((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title: title.trim(), description: description.trim(), columnId, dependsOn });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-surface border border-border rounded-2xl p-6 w-full max-w-md animate-in"
      >
        <h2 className="text-[16px] font-bold mb-4">New task</h2>

        <label className="text-[12px] font-medium text-muted block mb-1.5">Title</label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Write onboarding copy"
          className="w-full bg-surface-raised border border-border rounded-xl px-3.5 py-2.5 text-[14px] outline-none focus:border-accent mb-4 placeholder:text-muted"
        />

        <label className="text-[12px] font-medium text-muted block mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details"
          rows={2}
          className="w-full bg-surface-raised border border-border rounded-xl px-3.5 py-2.5 text-[14px] outline-none focus:border-accent mb-4 placeholder:text-muted resize-none"
        />

        <label className="text-[12px] font-medium text-muted block mb-1.5">Column</label>
        <select
          value={columnId}
          onChange={(e) => setColumnId(e.target.value)}
          className="w-full bg-surface-raised border border-border rounded-xl px-3.5 py-2.5 text-[14px] outline-none focus:border-accent mb-4"
        >
          {columns.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {tasks.length > 0 && (
          <>
            <label className="text-[12px] font-medium text-muted block mb-1.5">
              Depends on (blocked by)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-5 max-h-28 overflow-y-auto">
              {tasks.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => toggleDep(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[12px] border transition-colors ${
                    dependsOn.includes(t.id)
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface-raised text-muted border-border'
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-[13px] font-medium text-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl bg-accent text-white text-[13px] font-semibold"
          >
            Create task
          </button>
        </div>
      </form>
    </div>
  );
}
