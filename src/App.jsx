import { useState } from 'react';
import { BoardProvider, useBoard } from './context/BoardContext';
import TopBar from './components/TopBar';
import GraphView from './views/GraphView';
import BoardView from './views/BoardView';
import TaskDrawer from './components/TaskDrawer';
import NewTaskModal from './components/NewTaskModal';
import NewColumnModal from './components/NewColumnModal';
import SettingsPanel from './components/SettingsPanel';

function AppShell() {
  const { view, selectedTaskId } = useBoard();
  const [showNewTask, setShowNewTask] = useState(false);
  const [showNewColumn, setShowNewColumn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newTaskColumnId, setNewTaskColumnId] = useState(null);

  return (
    <div className="h-screen w-screen flex flex-col relative">
      <TopBar
        onNewTask={() => { setNewTaskColumnId(null); setShowNewTask(true); }}
        onNewColumn={() => setShowNewColumn(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {view === 'graph' ? (
        <GraphView />
      ) : (
        <BoardView onAddTaskToColumn={(colId) => { setNewTaskColumnId(colId); setShowNewTask(true); }} />
      )}

      {selectedTaskId && <TaskDrawer />}
      {showNewTask && (
        <NewTaskModal
          defaultColumnId={newTaskColumnId}
          onClose={() => setShowNewTask(false)}
        />
      )}
      {showNewColumn && <NewColumnModal onClose={() => setShowNewColumn(false)} />}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <BoardProvider>
      <AppShell />
    </BoardProvider>
  );
}
