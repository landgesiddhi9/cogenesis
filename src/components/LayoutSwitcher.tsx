import type { ReactNode } from "react";

interface LayoutSwitcherProps {
  columns: number;
  onChange: (columns: number) => void;
}

const ICONS: Record<number, ReactNode> = {
  2: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7.5" height="18" rx="0.5" />
      <rect x="13.5" y="3" width="7.5" height="18" rx="0.5" />
    </svg>
  ),
  3: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="5" height="18" rx="0.5" />
      <rect x="9.5" y="3" width="5" height="18" rx="0.5" />
      <rect x="16" y="3" width="5" height="18" rx="0.5" />
    </svg>
  ),
  4: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="3.75" height="18" rx="0.5" />
      <rect x="8.25" y="3" width="3.75" height="18" rx="0.5" />
      <rect x="13.5" y="3" width="3.75" height="18" rx="0.5" />
      <rect x="18.75" y="3" width="3.75" height="18" rx="0.5" />
    </svg>
  ),
};

const LayoutSwitcher = ({ columns, onChange }: LayoutSwitcherProps) => {
  const options = [2, 3, 4];

  return (
    <div className="flex items-center gap-1.5">
      {options.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`p-1.5 rounded transition-colors duration-200 ${
            columns === n
              ? "text-charcoal"
              : "text-charcoal/30 hover:text-charcoal/60"
          }`}
          aria-label={`${n} columns`}
        >
          {ICONS[n]}
        </button>
      ))}
    </div>
  );
};

export default LayoutSwitcher;
