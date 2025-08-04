type EntrySearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function EntrySearchBar({ value, onChange, placeholder }: EntrySearchBarProps) {
  return (
    <div className="w-full mb-4">
      <input
        type="text"
        className="w-full px-4 py-2 border rounded-lg shadow-sm bg-white dark:bg-gray-800 text-black dark:text-white dark:border-gray-600"
        placeholder={placeholder || "Search entries..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
