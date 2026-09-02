import { useCallback, useRef, useState } from 'react';
import { useBoard } from '../context/BoardContext';

const CANVAS_W = 1800;
const CANVAS_H = 900;
const NODE_W = 200;
const NODE_H = 88;

export default function GraphView() {
  const { tasks, columns, setSelectedTaskId, setTaskPosition } = useBoard();
  const wrapRef = useRef(null);
  const [transform, setTransform] = useState({ x: -20, y: -20, scale: 0.85 });
  const panRef = useRef(null);
  const dragRef = useRef(null);

  const columnById = Object.fromEntries(columns.map((c) => [c.id, c]));

  const clampScale = (s) => Math.min(1.4, Math.max(0.4, s));

  function handleWheel(e) {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setTransform((t) => ({ ...t, scale: clampScale(t.scale + delta) }));
  }

  function handleBackgroundMouseDown(e) {
    if (e.target !== wrapRef.current && !e.target.dataset.canvasBg) return;
    panRef.current = { startX: e.clientX, startY: e.clientY, origX: transform.x, origY: transform.y };
    window.addEventListener('mousemove', handlePanMove);
    window.addEventListener('mouseup', handlePanUp);
  }
  const handlePanMove = useCallback((e) => {
    if (!panRef.current) return;
    const { startX, startY, origX, origY } = panRef.current;
    setTransform((t) => ({ ...t, x: origX + (e.clientX - startX), y: origY + (e.clientY - startY) }));
  }, []);
  const handlePanUp = useCallback(() => {
    panRef.current = null;
    window.removeEventListener('mousemove', handlePanMove);
    window.removeEventListener('mouseup', handlePanUp);
  }, [handlePanMove]);

  function handleNodeMouseDown(e, task) {
    e.stopPropagation();
    dragRef.current = {
      id: task.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: task.x,
      origY: task.y,
      moved: false,
    };
    window.addEventListener('mousemove', handleNodeMove);
    window.addEventListener('mouseup', handleNodeUp);
  }
  const handleNodeMove = useCallback((e) => {
    if (!dragRef.current) return;
    const d = dragRef.current;
    const dx = (e.clientX - d.startX) / transform.scale;
    const dy = (e.clientY - d.startY) / transform.scale;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true;
    setTaskPosition(d.id, d.origX + dx, d.origY + dy);
  }, [transform.scale, setTaskPosition]);
  const handleNodeUp = useCallback((e) => {
    const d = dragRef.current;
    dragRef.current = null;
    window.removeEventListener('mousemove', handleNodeMove);
    window.removeEventListener('mouseup', handleNodeUp);
    if (d && !d.moved) {
      setSelectedTaskId(d.id);
    }
  }, [handleNodeMove, setSelectedTaskId]);

  function zoomBy(delta) {
    setTransform((t) => ({ ...t, scale: clampScale(t.scale + delta) }));
  }
  function resetView() {
    setTransform({ x: -20, y: -20, scale: 0.85 });
  }

  const taskById = Object.fromEntries(tasks.map((t) => [t.id, t]));

  return (
    <div className="relative flex-1 overflow-hidden bg-bg">
      <div
        ref={wrapRef}
        data-canvas-bg="true"
        onMouseDown={handleBackgroundMouseDown}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-canvas-dot) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          backgroundPosition: `${transform.x}px ${transform.y}px`,
        }}
      >
        <div
          className="relative"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
          }}
        >
          <svg
            width={CANVAS_W}
            height={CANVAS_H}
            className="absolute inset-0 pointer-events-none"
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="var(--color-edge)" />
              </marker>
            </defs>
            {tasks.map((task) =>
              task.dependsOn.map((depId) => {
                const from = taskById[depId];
                if (!from) return null;
                const x1 = from.x + NODE_W;
                const y1 = from.y + NODE_H / 2;
                const x2 = task.x;
                const y2 = task.y + NODE_H / 2;
                const midX = (x1 + x2) / 2;
                return (
                  <path
                    key={depId + '-' + task.id}
                    d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                    stroke="var(--color-edge)"
                    strokeWidth="1.5"
                    fill="none"
                    markerEnd="url(#arrow)"
                  />
                );
              })
            )}
          </svg>

          {tasks.map((task) => {
            const col = columnById[task.columnId];
            return (
              <div
                key={task.id}
                onMouseDown={(e) => handleNodeMouseDown(e, task)}
                className="absolute bg-surface border border-border rounded-xl px-4 py-3 shadow-lg select-none hover:border-accent transition-colors cursor-pointer"
                style={{ left: task.x, top: task.y, width: NODE_W, minHeight: NODE_H }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: col?.color || '#8B93A5' }} />
                  <span className="text-[10px] font-medium text-muted truncate">{col?.name || 'No status'}</span>
                </div>
                <p className="text-[13px] font-semibold leading-snug line-clamp-2">{task.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-5 right-5 flex flex-col gap-1.5 bg-surface border border-border rounded-xl p-1.5">
        <button onClick={() => zoomBy(0.15)} className="w-8 h-8 rounded-lg hover:bg-surface-hover text-[16px]">+</button>
        <button onClick={resetView} className="w-8 h-8 rounded-lg hover:bg-surface-hover text-[11px] text-muted">reset</button>
        <button onClick={() => zoomBy(-0.15)} className="w-8 h-8 rounded-lg hover:bg-surface-hover text-[16px]">–</button>
      </div>

      <p className="absolute bottom-5 left-5 text-[11px] text-muted">
        Drag the canvas to pan · drag a card to reposition it · scroll to zoom
      </p>
    </div>
  );
}
