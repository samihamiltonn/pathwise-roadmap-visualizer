import { useBoard } from '../context/BoardContext';

export default function TopBar({ onNewTask, onNewColumn, onOpenSettings }) {
  const { view, setView, resetToSample, profileName } = useBoard();

  return (
    <div className="h-14 shrink-0 border-b border-border flex items-center justify-between px-5 bg-surface">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-accent-dim flex items-center justify-center">
          <span className="text-accent text-sm font-bold">◆</span>
        </div>
        <span className="font-semibold text-[15px] tracking-tight">Pathwise</span>
      </div>

      <div className="flex items-center gap-1 bg-surface-raised border border-border rounded-full p-1">
        <button
          onClick={() => setView('graph')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
            view === 'graph' ? 'bg-accent text-white' : 'text-muted hover:text-ink'
          }`}
        >
          Graph
        </button>
        <button
          onClick={() => setView('board')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
            view === 'board' ? 'bg-accent text-white' : 'text-muted hover:text-ink'
          }`}
        >
          Board
        </button>
      </div>

      <div className="flex items-center gap-2">
        {view === 'board' && (
          <button
            onClick={onNewColumn}
            className="text-[13px] font-medium text-muted hover:text-ink px-3 py-1.5 rounded-lg transition-colors"
          >
            + Column
          </button>
        )}
        <button
          onClick={onNewTask}
          className="text-[13px] font-semibold bg-accent text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          + New Task
        </button>
        <button
          onClick={() => {
            if (confirm('Reset the board back to the sample roadmap? This clears your current tasks.')) {
              resetToSample();
            }
          }}
          className="text-[12px] font-medium text-muted hover:text-ink px-2 py-1.5 transition-colors"
          title="Reset to sample data"
        >
          ↺ Reset
        </button>
        <button
          onClick={onOpenSettings}
          className="w-8 h-8 rounded-full bg-accent-dim flex items-center justify-center text-accent text-[12px] font-bold hover:opacity-80 transition-opacity"
          title="Profile & settings"
        >
          {profileName?.[0]?.toUpperCase() || '?'}
        </button>
      </div>
    </div>
  );
}
