import { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import { COLOR_OPTIONS } from '../data/sampleData';
import ColorPicker from './ColorPicker';

export default function NewColumnModal({ onClose }) {
  const { addColumn } = useBoard();
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    addColumn(name.trim(), color);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-surface border border-border rounded-2xl p-6 w-full max-w-sm animate-in"
      >
        <h2 className="text-[16px] font-bold mb-4">New workflow column</h2>

        <label className="text-[12px] font-medium text-muted block mb-1.5">Name</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. In Review"
          className="w-full bg-surface-raised border border-border rounded-xl px-3.5 py-2.5 text-[14px] outline-none focus:border-accent mb-4 placeholder:text-muted"
        />

        <label className="text-[12px] font-medium text-muted block mb-2">Color</label>
        <div className="mb-6">
          <ColorPicker value={color} onChange={setColor} />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-[13px] font-medium text-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white"
            style={{ background: color }}
          >
            Add column
          </button>
        </div>
      </form>
    </div>
  );
}
