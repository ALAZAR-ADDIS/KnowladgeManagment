type FormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  as?: "input" | "textarea";
  type?: string;
};

export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  as = "input",
  type = "text",
}: FormFieldProps) {
  const baseClass =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-200 transition focus:ring-2";

  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {as === "textarea" ? (
        <textarea
          className={`${baseClass} min-h-24`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={baseClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
        />
      )}
    </label>
  );
}
