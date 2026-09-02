import { useBoard } from '../context/BoardContext';
import { COLOR_OPTIONS } from '../data/sampleData';

export default function TaskDrawer() {
  const {
    tasks, columns, selectedTaskId, setSelectedTaskId,
    updateTask, deleteTask, toggleDependency, blockedBy, blocking,
  } = useBoard();

  const task = tasks.find((t) => t.id === selectedTaskId);
  if (!task) return null;

  const column = columns.find((c) => c.id === task.columnId);
  const deps = blockedBy(task.id);
  const dependents = blocking(task.id);
  const otherTasks = tasks.filter((t) => t.id !== task.id);

  return (
    <div className="absolute inset-0 z-30 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedTaskId(null)} />
      <div className="relative w-full max-w-sm bg-surface border-l border-border h-full overflow-y-auto animate-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="text-[12px] font-medium text-muted">Task details</span>
          <button
            onClick={() => setSelectedTaskId(null)}
            className="w-7 h-7 rounded-full bg-surface-raised flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          <input
            value={task.title}
            onChange={(e) => updateTask(task.id, { title: e.target.value })}
            className="w-full bg-transparent text-[18px] font-bold outline-none border-b border-transparent focus:border-border pb-1 mb-3"
          />

          <textarea
            value={task.description}
            onChange={(e) => updateTask(task.id, { description: e.target.value })}
            placeholder="Add a description..."
            rows={3}
            className="w-full bg-surface-raised border border-border rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-accent mb-5 placeholder:text-muted resize-none"
          />

          <label className="text-[11px] font-semibold text-muted uppercase tracking-wide block mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {columns.map((c) => (
              <button
                key={c.id}
                onClick={() => updateTask(task.id, { columnId: c.id })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors"
                style={{
                  background: c.id === task.columnId ? c.color + '22' : 'transparent',
                  borderColor: c.id === task.columnId ? c.color : '#262B35',
                  color: c.id === task.columnId ? c.color : '#8B93A5',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                {c.name}
              </button>
            ))}
          </div>

          <label className="text-[11px] font-semibold text-muted uppercase tracking-wide block mb-2">
            Blocked by {deps.length > 0 && `(${deps.length})`}
          </label>
          {deps.length > 0 ? (
            <div className="flex flex-col gap-1.5 mb-4">
              {deps.map((d) => (
                <div key={d.id} className="flex items-center justify-between bg-surface-raised rounded-lg px-3 py-2">
                  <span className="text-[13px]">{d.title}</span>
                  <button
                    onClick={() => toggleDependency(task.id, d.id)}
                    className="text-[11px] text-muted hover:text-coral"
                  >
                    remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-muted mb-4">Nothing blocking this task.</p>
          )}

          {otherTasks.length > 0 && (
            <details className="mb-6">
              <summary className="text-[12px] text-accent cursor-pointer select-none">
                + Add a blocking dependency
              </summary>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {otherTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleDependency(task.id, t.id)}
                    className={`px-2.5 py-1 rounded-lg text-[12px] border transition-colors ${
                      task.dependsOn.includes(t.id)
                        ? 'bg-accent text-white border-accent'
                        : 'bg-surface-raised text-muted border-border'
                    }`}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </details>
          )}

          <label className="text-[11px] font-semibold text-muted uppercase tracking-wide block mb-2">
            Blocking {dependents.length > 0 && `(${dependents.length})`}
          </label>
          {dependents.length > 0 ? (
            <div className="flex flex-col gap-1.5 mb-6">
              {dependents.map((d) => (
                <div key={d.id} className="bg-surface-raised rounded-lg px-3 py-2">
                  <span className="text-[13px]">{d.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-muted mb-6">This isn't blocking anything else.</p>
          )}

          <button
            onClick={() => deleteTask(task.id)}
            className="w-full py-2.5 rounded-xl bg-coral-dim text-coral text-[13px] font-semibold"
          >
            Delete task
          </button>
        </div>
      </div>
    </div>
  );
}
