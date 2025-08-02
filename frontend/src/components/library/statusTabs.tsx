type StatusTabsProps = {
  selected: string;
  onSelect: (status: string) => void;
  options: string[];
};

export default function StatusTabs({ selected, onSelect, options }: StatusTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {options.map((label) => {
        const key = label.toLowerCase();
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition 
              ${
                selected === key
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
              }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
