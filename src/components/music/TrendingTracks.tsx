import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Track } from "../../types/music";
import Loader from "../Loader";

interface TrendingTracksProps {
  setCurrentTrack: React.Dispatch<React.SetStateAction<Track | null>>;
  addToQueue: (track: Track | Track[]) => void;
  selectedGenre: string | null;
  setSelectedGenre: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function TrendingTracks({
  setCurrentTrack,
  addToQueue,
  selectedGenre,
}: TrendingTracksProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Функция загрузки трендовых треков
  const fetchTrendingTracks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await invoke("get_trending_tracks_command", {
        genre: selectedGenre || null,
      });

      console.log("📥 Ответ от API:", response); // Логируем сырой ответ

      // Проверяем, является ли ответ объектом с `data`
      if (!response || typeof response !== "object" || !("data" in response)) {
        throw new Error("Некорректный формат ответа от API");
      }

      setTracks(response.data as Track[]);
    } catch (err) {
      setError("Ошибка загрузки трендов 😢");
      console.error("❌ Ошибка запроса трендов:", err);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные при изменении жанра
  useEffect(() => {
    fetchTrendingTracks();
  }, [selectedGenre]);

  return (
    <div className="overflow-y-auto custom-scrollbar p-2">
      <h2 className="text-2xl font-bold mb-4">🔥 Тренды</h2>
      {loading ? (
        <div className="flex justify-center items-center h-full min-h-[400px]">
          <Loader />
        </div>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          {tracks.length > 0 ? (
            tracks.map((track) => (
              <div
                key={track.id}
                className="dark:bg-stone-800 dark:hover:bg-stone-700 hover:bg-gray-200 p-3 rounded-lg shadow-md transition cursor-pointer"
                onClick={() => setCurrentTrack(track)}
              >
                <img
                  src={track.artwork?.["1000x1000"] || "/default-cover.jpg"}
                  alt={track.title}
                  className="w-full h-40 object-cover rounded-md"
                />
                <div className="mt-2">
                  <p className="font-semibold text-sm truncate">
                    {track.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {track.user?.name || "Неизвестный исполнитель"}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Чтобы не запускался трек при нажатии
                    addToQueue(track);
                  }}
                  className="mt-2 w-full px-3 py-1 bg-gray-200 dark:bg-stone-700 hover:bg-gray-300 dark:hover:bg-stone-600 rounded-md transition text-sm"
                >
                  ➕ В очередь
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Нет доступных треков.</p>
          )}
        </div>
      )}
    </div>
  );
}
