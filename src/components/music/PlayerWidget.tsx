// import { useState, useEffect } from "react";
import { usePlayer } from "../../context/PlayerContext";
import Loader from "../Loader"; // ✅ Используем твой компонент лоадера

const formatTime = (seconds: number) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function PlayerWidget() {
  const {
    currentTrack,
    queue,
    setQueue,
    setCurrentTrack,
    isPlaying,
    togglePlayPause,
    nextTrack,
    volume,
    setVolume,
    currentTime,
    duration,
    seekTo,
    isBuffering, // ✅ Добавляем флаг буферизации из PlayerContext
  } = usePlayer();

  const removeFromQueue = (trackId: string) => {
    setQueue(queue.filter((t) => t.id !== trackId));
  };

  return (
    <div className="w-80 bg-white dark:bg-stone-800 rounded-lg p-4 shadow-lg flex flex-col">
      <h2 className="text-lg font-bold mb-3">Сейчас играет</h2>

      {!currentTrack ? (
        <p className="text-gray-400">🔍 Выберите трек для воспроизведения</p>
      ) : (
        <>
          <img
            src={currentTrack.artwork?.["1000x1000"] || "/default-cover.jpg"}
            alt={currentTrack.title}
            className="w-full h-50 object-cover rounded-md"
          />
          <h3 className="mt-2 text-lg font-bold">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400">{currentTrack.user?.name}</p>

          {/* 🔥 Прогресс-бар с Лоадером */}
          <div className="mt-2 flex items-center">
            <span className="text-xs text-gray-400">
              {formatTime(currentTime)}
            </span>

            <div className="relative w-full mx-2">
              {isBuffering ? (
                <div className="flex items-center justify-center h-6">
                  <Loader />
                </div>
              ) : (
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  placeholder="currentTime"
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full appearance-none cursor-pointer transition"
                />
              )}
            </div>

            <span className="text-xs text-gray-400">
              {formatTime(duration)}
            </span>
          </div>

          {/* Регулятор громкости */}
          <div className="mt-4">
            <h3 className="text-md font-bold">🔊 Громкость</h3>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              placeholder="volume"
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Кнопки управления */}
          <div className="flex gap-4 mt-4">
            <button
              className="px-3 py-1 bg-gray-600 rounded-md hover:bg-gray-500 transition"
              onClick={nextTrack}
            >
              ⏭
            </button>
            <button
              className="px-3 py-1 bg-blue-500 rounded-md hover:bg-blue-600 transition"
              onClick={togglePlayPause}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
          </div>

          {/* Очередь треков */}
          <h3 className="mt-4 text-md font-bold">Очередь</h3>
          <div className="overflow-y-auto max-h-70 custom-scrollbar">
            {queue.length === 0 ? (
              <p className="text-gray-400">Очередь пуста</p>
            ) : (
              <ul className="space-y-2 m-2">
                {queue.map((t, trackId) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 bg-gray-100 dark:bg-stone-900 p-2 rounded-md cursor-pointer hover:bg-gray-300 dark:hover:bg-stone-700 transition"
                  >
                    <span className="text-gray-400">{trackId + 1}</span>
                    <img
                      src={t.artwork?.["1000x1000"] || "/default-cover.jpg"}
                      alt={t.title || "Без названия"}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <div className="flex-1" onClick={() => setCurrentTrack(t)}>
                      <p className="text-sm font-semibold">
                        {t.title || "Без названия"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t.user?.name || "Неизвестный исполнитель"}
                      </p>
                    </div>
                    {/* Кнопка удаления трека из очереди */}
                    <button
                      className="px-2 py-1 text-sm rounded-md transition"
                      onClick={() => removeFromQueue(t.id)}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
