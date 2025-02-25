import { useState, useEffect } from "react";
import { SearchResultItem, Track, Playlist } from "../../types/music";
import Loader from "../Loader";

interface SearchResultsProps {
  searchResults: SearchResultItem[];
  setCurrentTrack: React.Dispatch<React.SetStateAction<Track | null>>;
  addToQueue: (track: Track) => void;
  selectPlaylist: (playlist: Playlist) => void;
}

export default function SearchResults({
  searchResults,
  setCurrentTrack,
  addToQueue,
  selectPlaylist,
}: SearchResultsProps) {
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Эффект имитации загрузки (можно убрать, если загрузка данных асинхронная)
  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [searchResults]);

  const tracks = searchResults.filter(
    (item) => item.type === "track"
  ) as Track[];
  const playlists = searchResults.filter(
    (item) => item.type === "playlist"
  ) as Playlist[];

  return (
    <div className="overflow-y-auto custom-scrollbar p-2">
      {isLoading ? ( // ✅ Показываем Loader, пока идет загрузка
        <div className="flex justify-center items-center h-full min-h-[400px]">
          <Loader />
        </div>
      ) : tracks.length === 0 && playlists.length === 0 ? (
        <p className="text-gray-400">Ничего не найдено.</p>
      ) : (
        <>
          {tracks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Треки</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 m-2">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className="dark:bg-stone-800 dark:hover:bg-stone-700 hover:bg-gray-200 p-3 rounded-lg shadow-lg transition cursor-pointer"
                    onClick={() => setCurrentTrack(track)}
                  >
                    <img
                      src={track.artwork?.["1000x1000"] || "/default-cover.jpg"}
                      alt={track.title}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <div className="mt-2 text-center">
                      <p className="font-semibold text-sm truncate">
                        {track.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {track.user.name}
                      </p>
                    </div>
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToQueue(track);
                        }}
                        className="mt-2 w-full px-3 py-1 bg-gray-200 dark:bg-stone-700 hover:bg-gray-300 dark:hover:bg-stone-600  rounded-md transition text-sm"
                      >
                        ➕ В очередь
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {playlists.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Плейлисты</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 m-2">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="dark:bg-stone-800 dark:hover:bg-stone-700 p-3 rounded-lg shadow-lg hover:bg-gray-300 transition cursor-pointer"
                    onClick={() => selectPlaylist(playlist)}
                  >
                    <img
                      src={
                        playlist.artwork?.["1000x1000"] || "/default-cover.jpg"
                      }
                      alt={playlist.playlist_name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <div className="mt-2">
                      <p className="font-semibold text-sm">
                        {playlist.playlist_name}
                      </p>
                      {playlist.description && (
                        <p className="text-xs text-gray-400 truncate">
                          {playlist.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
