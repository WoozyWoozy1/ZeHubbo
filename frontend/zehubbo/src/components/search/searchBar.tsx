import { useState } from 'react';

type SearchBarProps = {
  onSearch: (query: string, category: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('movie');

  const handleSubmit = () => {
    onSearch(input.trim(), category);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl flex gap-2">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white"
      >
        <option value="movie">Movie</option>
        <option value="show">Show</option>
        <option value="anime">Anime</option>
        <option value="manga">Manga</option>
        <option value="manhwa">Manhwa</option>
        <option value="light novel">Light Novel</option>
        <option value="visual novel">Visual Novel</option>
        <option value="book">Book</option>
        <option value="game">Game</option>
      </select>

      <input
        type="text"
        placeholder="Search for media..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 text-xl"
        title="Search"
      >
        🔍
      </button>
    </div>
  );
}
