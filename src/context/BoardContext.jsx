import { createContext, useContext, useEffect, useState } from 'react';
import { freshSampleState } from '../data/sampleData';

const BoardContext = createContext(null);
const STORAGE_KEY = 'pathwise.board.v1';
const SETTINGS_KEY = 'pathwise.settings.v1';

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { theme: 'dark', profileName: 'Sami' };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return freshSampleState();
}

function uid(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
}

export function BoardProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [view, setView] = useState('graph'); // 'graph' | 'board'
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings]);

  function setTheme(theme) {
    setSettings((s) => ({ ...s, theme }));
  }

  function setProfileName(profileName) {
    setSettings((s) => ({ ...s, profileName }));
  }

  function addTask(task) {
    const id = uid('t');
    setState((s) => ({
      ...s,
      tasks: [
        ...s.tasks,
        {
          id,
          title: task.title || 'Untitled task',
          description: task.description || '',
          columnId: task.columnId || s.columns[0]?.id,
          dependsOn: task.dependsOn || [],
          x: task.x ?? 80 + Math.random() * 200,
          y: task.y ?? 80 + Math.random() * 400,
        },
      ],
    }));
    return id;
  }

  function updateTask(id, updates) {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }

  function deleteTask(id) {
    setState((s) => ({
      ...s,
      tasks: s.tasks
        .filter((t) => t.id !== id)
        .map((t) => ({ ...t, dependsOn: t.dependsOn.filter((d) => d !== id) })),
    }));
    setSelectedTaskId((cur) => (cur === id ? null : cur));
  }

  function moveTaskToColumn(id, columnId) {
    updateTask(id, { columnId });
  }

  function setTaskPosition(id, x, y) {
    updateTask(id, { x, y });
  }

  function addColumn(name, color) {
    const id = uid('col');
    setState((s) => ({ ...s, columns: [...s.columns, { id, name, color }] }));
    return id;
  }

  function reorderColumn(draggedId, targetId) {
    if (draggedId === targetId) return;
    setState((s) => {
      const cols = [...s.columns];
      const fromIdx = cols.findIndex((c) => c.id === draggedId);
      const toIdx = cols.findIndex((c) => c.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return s;
      const [moved] = cols.splice(fromIdx, 1);
      cols.splice(toIdx, 0, moved);
      return { ...s, columns: cols };
    });
  }

  function updateColumn(id, updates) {
    setState((s) => ({
      ...s,
      columns: s.columns.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }

  function deleteColumn(id) {
    setState((s) => {
      const fallback = s.columns.find((c) => c.id !== id)?.id || null;
      return {
        ...s,
        columns: s.columns.filter((c) => c.id !== id),
        tasks: s.tasks.map((t) => (t.columnId === id ? { ...t, columnId: fallback } : t)),
      };
    });
  }

  function toggleDependency(taskId, dependsOnId) {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const has = t.dependsOn.includes(dependsOnId);
        return {
          ...t,
          dependsOn: has
            ? t.dependsOn.filter((d) => d !== dependsOnId)
            : [...t.dependsOn, dependsOnId],
        };
      }),
    }));
  }

  function resetToSample() {
    setState(freshSampleState());
    setSelectedTaskId(null);
  }

  function clearAll() {
    setState({ columns: freshSampleState().columns, tasks: [] });
    setSelectedTaskId(null);
  }

  function blockedBy(taskId) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return [];
    return task.dependsOn
      .map((id) => state.tasks.find((t) => t.id === id))
      .filter(Boolean);
  }

  function blocking(taskId) {
    return state.tasks.filter((t) => t.dependsOn.includes(taskId));
  }

  const value = {
    columns: state.columns,
    tasks: state.tasks,
    view,
    setView,
    selectedTaskId,
    setSelectedTaskId,
    addTask,
    updateTask,
    deleteTask,
    moveTaskToColumn,
    setTaskPosition,
    addColumn,
    reorderColumn,
    updateColumn,
    deleteColumn,
    toggleDependency,
    resetToSample,
    clearAll,
    blockedBy,
    blocking,
    theme: settings.theme,
    setTheme,
    profileName: settings.profileName,
    setProfileName,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard must be used within BoardProvider');
  return ctx;
}
