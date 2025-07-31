interface CategoryDropdownProps {
  category: string;
  setCategory: (value: string) => void;
}

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

export default function CategoryDropdown({ category, setCategory }: CategoryDropdownProps) {
  return (
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="p-3 rounded-xl border shadow"
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
