import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="mb-4 flex items-center text-center justify-center">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Поиск профилей..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          // className="px-4 py-2 border border-b-gray-300 rounded-md bg-transparent"
          className="w-full max-w-xl p-2 pl-4 pr-10 bg-transparent border-b border-gray-300 text-white focus:outline-none placeholder-gray-400"
        />
        <div className="absolute right-0 top-0 mt-2 mr-3 bg-transparent">
          <Search className="w-5 h-5 text-gray-300 hover:text-white" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
