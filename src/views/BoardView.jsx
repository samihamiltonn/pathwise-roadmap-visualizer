import { useState } from 'react';
import { useBoard } from '../context/BoardContext';

export default function BoardView({ onAddTaskToColumn }) {
  const {
    columns, tasks, setSelectedTaskId, moveTaskToColumn,
    deleteColumn, updateColumn, reorderColumn,
  } = useBoard();

  const [dragTaskId, setDragTaskId] = useState(null);
  const [overColumnId, setOverColumnId] = useState(null);
  const [dragColumnId, setDragColumnId] = useState(null);
  const [overColumnEdge, setOverColumnEdge] = useState(null); // column being hovered while dragging a column
  const [editingColumnId, setEditingColumnId] = useState(null);

  function handleTaskDrop(columnId) {
    if (dragTaskId) moveTaskToColumn(dragTaskId, columnId);
    setDragTaskId(null);
    setOverColumnId(null);
  }

  function handleColumnDragOver(e, columnId) {
    e.preventDefault();
    if (dragColumnId) {
      setOverColumnEdge(columnId);
    } else {
      setOverColumnId(columnId);
    }
  }

  function handleColumnDrop(columnId) {
    if (dragColumnId) {
      reorderColumn(dragColumnId, columnId);
      setDragColumnId(null);
      setOverColumnEdge(null);
    } else {
      handleTaskDrop(columnId);
    }
  }

  return (
    <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden bg-bg">
      <div className="flex gap-4 h-full p-5 min-w-max">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.columnId === col.id);
          const isTaskOver = overColumnId === col.id;
          const isColumnOver = overColumnEdge === col.id && dragColumnId && dragColumnId !== col.id;
          const isBeingDragged = dragColumnId === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleColumnDragOver(e, col.id)}
              onDragLeave={() => {
                setOverColumnId((c) => (c === col.id ? null : c));
                setOverColumnEdge((c) => (c === col.id ? null : c));
              }}
              onDrop={() => handleColumnDrop(col.id)}
              className="w-72 shrink-0 h-full flex flex-col bg-surface border rounded-2xl transition-colors"
              style={{
                borderColor: isTaskOver || isColumnOver ? col.color : '#262B35',
                opacity: isBeingDragged ? 0.4 : 1,
              }}
            >
              <div
                draggable
                onDragStart={() => setDragColumnId(col.id)}
                onDragEnd={() => { setDragColumnId(null); setOverColumnEdge(null); }}
                className="flex items-center justify-between px-4 py-3 border-b border-border cursor-grab active:cursor-grabbing shrink-0"
                title="Drag to reorder this column"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted text-[12px] select-none">⠿</span>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: col.color }} />
                  {editingColumnId === col.id ? (
                    <input
                      autoFocus
                      defaultValue={col.name}
                      onBlur={(e) => { updateColumn(col.id, { name: e.target.value || col.name }); setEditingColumnId(null); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="bg-transparent text-[13px] font-semibold outline-none border-b border-accent min-w-0"
                    />
                  ) : (
                    <span
                      className="text-[13px] font-semibold truncate cursor-text"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => setEditingColumnId(col.id)}
                    >
                      {col.name}
                    </span>
                  )}
                  <span className="text-[11px] text-muted shrink-0">{colTasks.length}</span>
                </div>
                {columns.length > 1 && (
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => {
                      if (confirm(`Delete "${col.name}"? Tasks inside will move to another column.`)) {
                        deleteColumn(col.id);
                      }
                    }}
                    className="text-[12px] text-muted hover:text-coral shrink-0"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-2.5 flex flex-col gap-2">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDragTaskId(task.id)}
                    onDragEnd={() => setDragTaskId(null)}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="bg-surface-raised border border-border rounded-xl px-3.5 py-3 cursor-pointer hover:border-accent transition-colors shrink-0"
                    style={{ opacity: dragTaskId === task.id ? 0.4 : 1 }}
                  >
                    <p className="text-[13px] font-medium leading-snug mb-1">{task.title}</p>
                    {task.description && (
                      <p className="text-[11px] text-muted line-clamp-2">{task.description}</p>
                    )}
                    {task.dependsOn.length > 0 && (
                      <p className="text-[10px] text-amber mt-1.5">
                        blocked by {task.dependsOn.length}
                      </p>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => onAddTaskToColumn(col.id)}
                  className="text-[12px] text-muted hover:text-ink text-left px-1 py-1.5 shrink-0"
                >
                  + Add task
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
