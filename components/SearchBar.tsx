import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <label className="relative block w-full">
      <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-sky-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search..."}
        className="w-full rounded-lg border border-sky-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none ring-sky-200 transition focus:border-sky-400 focus:ring-2"
      />
    </label>
  );
}
