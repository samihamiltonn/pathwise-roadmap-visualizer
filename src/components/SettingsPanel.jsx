import { useState } from 'react';
import { useBoard } from '../context/BoardContext';

export default function SettingsPanel({ onClose }) {
  const { theme, setTheme, profileName, setProfileName } = useBoard();
  const [name, setName] = useState(profileName);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl p-6 w-full max-w-sm animate-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-bold">Profile & settings</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-raised flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <label className="text-[11px] font-semibold text-muted uppercase tracking-wide block mb-2">
          Profile
        </label>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-accent-dim flex items-center justify-center text-accent text-[14px] font-bold shrink-0">
            {name?.[0]?.toUpperCase() || '?'}
          </div>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setProfileName(e.target.value); }}
            placeholder="Your name"
            className="flex-1 bg-surface-raised border border-border rounded-xl px-3.5 py-2.5 text-[14px] outline-none focus:border-accent placeholder:text-muted"
          />
        </div>

        <label className="text-[11px] font-semibold text-muted uppercase tracking-wide block mb-2">
          Appearance
        </label>
        <div className="grid grid-cols-2 gap-2 mb-1">
          <button
            onClick={() => setTheme('dark')}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[13px] font-medium transition-colors"
            style={{
              background: theme === 'dark' ? 'var(--color-accent-dim)' : 'transparent',
              borderColor: theme === 'dark' ? 'var(--color-accent)' : 'var(--color-border)',
              color: theme === 'dark' ? 'var(--color-accent)' : 'var(--color-muted)',
            }}
          >
            🌙 Dark
          </button>
          <button
            onClick={() => setTheme('light')}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[13px] font-medium transition-colors"
            style={{
              background: theme === 'light' ? 'var(--color-accent-dim)' : 'transparent',
              borderColor: theme === 'light' ? 'var(--color-accent)' : 'var(--color-border)',
              color: theme === 'light' ? 'var(--color-accent)' : 'var(--color-muted)',
            }}
          >
            ☀️ Light
          </button>
        </div>
      </div>
    </div>
  );
}
