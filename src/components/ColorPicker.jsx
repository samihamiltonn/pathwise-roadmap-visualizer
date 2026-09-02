import { COLOR_OPTIONS } from '../data/sampleData';

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_OPTIONS.map((c) => (
        <button
          key={c.value}
          type="button"
          onClick={() => onChange(c.value)}
          title={c.name}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-transform"
          style={{
            background: c.value,
            outline: value === c.value ? '2px solid #F4F5F7' : 'none',
            outlineOffset: '2px',
            transform: value === c.value ? 'scale(1.08)' : 'scale(1)',
          }}
          aria-label={c.name}
        >
          {value === c.value && <span className="text-[11px] text-black/70">✓</span>}
        </button>
      ))}
    </div>
  );
}
