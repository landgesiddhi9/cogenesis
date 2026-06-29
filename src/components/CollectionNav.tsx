export interface CollectionTab {
  key: string;
  label: string;
}

interface CollectionNavProps {
  tabs: CollectionTab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

const CollectionNav = ({ tabs, activeTab, onTabChange }: CollectionNavProps) => {
  return (
    <nav className="flex items-center justify-start md:justify-center gap-8 md:gap-10 overflow-x-auto snap-x snap-mandatory scrollbar-none w-full" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              font-sans text-[11px] md:text-[12px] tracking-[0.22em] uppercase
              transition-all duration-300 ease-out pb-1 snap-start shrink-0 whitespace-nowrap
              ${
                isActive
                  ? "text-charcoal border-b border-charcoal"
                  : "text-charcoal/40 hover:text-charcoal/70 border-b border-transparent hover:border-charcoal/20"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};

export default CollectionNav;
