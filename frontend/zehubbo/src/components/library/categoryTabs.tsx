type CategoryTabsProps = {
  selected: string;
  onSelect: (category: string) => void;
};

const categories = [
  'Movie',
  'Show',
  'Anime',
  'Manga',
  'Light Novel',
  'Visual Novel',
  'Book',
  'Game',
];

export default function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      {categories.map((category) => {
        const key = category.toLowerCase();
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition 
              ${
                selected === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
              }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
