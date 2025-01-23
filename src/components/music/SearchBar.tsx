// src/components/music/SearchBar.tsx
import React, { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);
    onSearch(query);
  };

  return (
    <div className="text-center mb-4">
      <div className="inline-flex items-center gap-2 bg-gray-800 p-3 rounded-lg shadow-lg">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search for a track..."
          className="w-80 p-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default SearchBar;
