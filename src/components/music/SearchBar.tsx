import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { SearchResultItem, Track, Playlist } from "../../types/music";

interface SearchBarProps {
  setSearchResults: React.Dispatch<React.SetStateAction<SearchResultItem[]>>;
}

export default function SearchBar({ setSearchResults }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");

  const handleSearch = async () => {
    if (!query.trim()) {
      setSearchResults([]); // Очистка результатов, если поле ввода пустое
      return;
    }

    try {
      const tracksData: { data: Track[] } = await invoke(
        "search_tracks_audius_command",
        { query }
      );
      const playlistsData: { data: Playlist[] } = await invoke(
        "search_playlists_audius_command",
        { query }
      );

      const combinedResults: SearchResultItem[] = [
        ...tracksData.data.map((track) => ({
          ...track,
          type: "track" as const, // Явно указываем "track"
        })),
        ...playlistsData.data.map((playlist) => ({
          ...playlist,
          type: "playlist" as const, // Явно указываем "playlist"
        })),
      ];

      setSearchResults(combinedResults);
    } catch (error) {
      console.error("Ошибка поиска:", error);
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Поиск треков или плейлистов..."
        className="w-full p-2 bg-transparent placeholder-gray-400 outline-none border-b border-gray-300 max-w-lg dark:border-gray-700"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!e.target.value.trim()) {
            setSearchResults([]); // Очистка, если поле пустое
          }
        }}
      />
      <button
        className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition"
        onClick={handleSearch}
      >
        🔍
      </button>
    </div>
  );
}
