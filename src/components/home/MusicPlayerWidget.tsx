import { usePlayer } from "../../context/PlayerContext";
import Loader from "../Loader";

/** ✅ Функция форматирования времени (минуты:секунды) **/
const formatTime = (seconds: number) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function MusicPlayerWidget() {
  const {
    currentTrack,
    queue,
    isPlaying,
    togglePlayPause,
    nextTrack,
    volume,
    setVolume,
    currentTime,
    duration,
    seekTo,
    isBuffering,
  } = usePlayer();

  return (
    <div className="relative p-5 bg-white dark:bg-stone-800 rounded-xl shadow-xl flex flex-col w-full">
      {currentTrack ? (
        <>
          {/* Верхняя часть (Обложка, название, исполнитель) */}
          <div className="flex items-center gap-4">
            <img
              src={currentTrack.artwork?.["1000x1000"] || "/default-cover.jpg"}
              alt={currentTrack.title}
              className="w-28 h-28 object-cover rounded-md shadow-md"
            />
            <div className="flex flex-col flex-1">
              <h3 className="text-lg font-semibold">{currentTrack.title}</h3>
              <p className="text-sm text-gray-400">
                {currentTrack.user?.name || "Unknown Artist"}
              </p>

              {/* Прогресс-бар с буферизацией */}
              <div className="mt-3 flex items-center">
                {isBuffering ? (
                  <div className="flex justify-center items-center w-full">
                    <Loader />
                  </div>
                ) : (
                  <div className="flex justify-center items-center w-full">
                    <span className="text-xs text-gray-400">
                      {formatTime(currentTime)}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      placeholder="currentTime"
                      onChange={(e) => seekTo(parseFloat(e.target.value))}
                      className="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer transition mx-3"
                    />{" "}
                    <span className="text-xs text-gray-400">
                      {formatTime(duration)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Кнопки управления и громкость в один ряд */}
          <div className="mt-5 flex items-center justify-center gap-5 w-full">
            <button
              className="text-xl text-gray-400 hover:text-white transition"
              onClick={togglePlayPause}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              className="text-lg text-gray-400 hover:text-white transition"
              onClick={nextTrack}
            >
              ⏭
            </button>

            {/* Ползунок громкости */}
            <div className="flex items-center gap-2 w-full max-w-[140px]">
              <span className="text-gray-400 text-sm">🔉</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                placeholder="volume"
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer transition"
              />
              <span className="text-gray-400 text-sm">🔊</span>
            </div>
          </div>

          {/* Очередь воспроизведения */}
          {queue.length > 0 && (
            <>
              <h3 className="mt-6 text-md font-semibold text-gray-500 dark:text-gray-300">
                Очередь воспроизведения
              </h3>
              <div className="mt-2 overflow-y-auto max-h-40 custom-scrollbar">
                {queue.map((t, trackId) => (
                  <div
                    key={trackId}
                    className="flex items-center gap-3 p-2 rounded-md cursor-pointer dark:hover:bg-stone-700 hover:bg-gray-300 transition m-2"
                  >
                    <span className="text-gray-400">{trackId + 1}</span>
                    <img
                      src={t.artwork?.["1000x1000"] || "/default-cover.jpg"}
                      alt={t.title || "Без названия"}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {t.title || "Без названия"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t.user?.name || "Неизвестный исполнитель"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        /** Плейсхолдер, если музыка не играет **/
        <div className="flex flex-col items-center justify-center h-52 text-gray-400">
          <span className="text-6xl">🎧</span>
          <p className="mt-3 text-lg font-semibold">Музыка не играет</p>
          <p className="text-sm text-gray-500">
            Выберите трек или нажмите кнопку в плеере
          </p>
        </div>
      )}
    </div>
  );
}
