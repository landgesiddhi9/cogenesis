import type { ReactNode } from "react";

interface LayoutSwitcherProps {
  columns: number;
  onChange: (columns: number) => void;
}

const ICONS: Record<number, ReactNode> = {
  2: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="0.5" strokeWidth="1.25" />
    </svg>
  ),
  4: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="0.5" strokeWidth="1.25" />
      <line x1="12" y1="3" x2="12" y2="21" strokeWidth="1" />
    </svg>
  ),
  12: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="0.5" strokeWidth="1.25" />
      <line x1="12" y1="3" x2="12" y2="21" strokeWidth="1" />
      <line x1="3" y1="12" x2="21" y2="12" strokeWidth="1" />
    </svg>
  ),
};

const options = [2, 4, 12];

const LayoutSwitcherDesktop = ({ columns, onChange }: LayoutSwitcherProps) => (
  <div className="flex items-center gap-1">
    {options.map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className={`p-1 rounded transition-colors duration-200 ${
          columns === n
            ? "text-charcoal"
            : "text-charcoal/20 hover:text-charcoal/40"
        }`}
        aria-label={`${n} columns`}
      >
        {ICONS[n]}
      </button>
    ))}
  </div>
);

export default LayoutSwitcherDesktop;
