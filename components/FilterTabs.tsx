type FilterTabsProps = {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
};

export default function FilterTabs({ tabs, active, onChange }: FilterTabsProps) {
  return (
    <div className="inline-flex rounded-lg border border-sky-100 bg-white p-1 shadow-sm shadow-sky-100/60">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`rounded-md px-3 py-1.5 text-sm transition ${
            active === tab
              ? "bg-gradient-to-r from-blue-700 to-cyan-600 text-white"
              : "text-slate-600 hover:bg-sky-50"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
