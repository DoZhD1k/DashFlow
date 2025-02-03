import { useEffect, useState } from "react";
import SearchBar from "../components/music/SearchBar";
import SearchResults from "../components/music/SearchResults";
import PlaylistView from "../components/music/PlaylistView";
import PlayerWidget from "../components/music/PlayerWidget";
import TrendingTracks from "../components/music/TrendingTracks";
import { SearchResultItem, Playlist, Track } from "../types/music";
import { usePlayer } from "../context/PlayerContext";
import Loader from "../components/Loader";

export default function Music() {
  const [isLoading, setIsLoading] = useState(true);

  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const { setCurrentTrack, addToQueue } = usePlayer();

  useEffect(() => {
    // Симуляция загрузки данных
    setTimeout(() => {
      setIsLoading(false);
    }); // Можно убрать задержку, если не нужна
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-stone-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen max-h-screen p-4 gap-4 bg-gray-100 dark:bg-stone-900">
      <div className="flex flex-col flex-1 bg-white dark:bg-stone-800 rounded-lg p-4 shadow-lg">
        <SearchBar setSearchResults={setSearchResults} />

        {selectedPlaylist ? (
          <PlaylistView
            playlist={selectedPlaylist}
            setCurrentTrack={(track) => setCurrentTrack(track as Track | null)} // Фикс
            addToQueue={addToQueue}
            goBack={() => setSelectedPlaylist(null)}
          />
        ) : searchResults.length > 0 ? (
          <SearchResults
            searchResults={searchResults}
            setCurrentTrack={(track) => setCurrentTrack(track as Track | null)} // Фикс
            addToQueue={addToQueue}
            selectPlaylist={setSelectedPlaylist}
          />
        ) : (
          <TrendingTracks
            setCurrentTrack={(track) => setCurrentTrack(track as Track | null)} // Фикс
            addToQueue={addToQueue}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
          />
        )}
      </div>

      <PlayerWidget />
    </div>
  );
}
