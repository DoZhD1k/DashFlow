import { Track } from "../../types/music";
import { useState, useRef, useEffect } from "react";

interface NowPlayingProps {
  track: Track | null;
  queue: Track[];
  setQueue: React.Dispatch<React.SetStateAction<Track[]>>;
}

export default function NowPlaying({
  track,
  queue,
  setQueue,
}: NowPlayingProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (track) {
      if (!audioRef.current) {
        audioRef.current = new Audio(track.stream_url);
      } else {
        audioRef.current.src = track.stream_url;
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [track]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    if (queue.length > 0) {
      const next = queue[0];
      setQueue(queue.slice(1));
      if (audioRef.current) {
        audioRef.current.src = next.stream_url;
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      {track ? (
        <>
          <img
            src={track.artwork?.["1000x1000"] || "/default-cover.jpg"}
            alt={track.title}
            className="rounded-lg w-full h-40 object-cover"
          />
          <h2 className="mt-2 text-lg font-bold">{track.title}</h2>
          <p className="text-sm text-gray-400">{track.user.name}</p>
          <div className="flex gap-4 mt-4">
            <button
              className="px-3 py-1 bg-gray-600 rounded-md hover:bg-gray-500 transition"
              onClick={nextTrack}
            >
              ⏭
            </button>
            <button
              className="px-3 py-1 bg-blue-500 rounded-md hover:bg-blue-600 transition"
              onClick={togglePlay}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-md font-bold">Очередь</h3>
            {queue.length === 0 ? (
              <p className="text-gray-400">Очередь пуста</p>
            ) : (
              <ul>
                {queue.map((t, idx) => (
                  <li key={idx} className="text-sm">
                    {t.title} - {t.user.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-400">Трек не выбран</p>
      )}
    </div>
  );
}
