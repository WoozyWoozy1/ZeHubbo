import { useState } from 'react';
import SearchBar from './components/search/searchBar';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = (newQuery: string, newCategory: string) => {
    setQuery(newQuery);
    setCategory(newCategory);
    console.log('Search Query:', newQuery);
    console.log('Search Category:', newCategory);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-10">
      <h1 className="text-3xl font-bold mb-6">ZeHubbo</h1>
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}
