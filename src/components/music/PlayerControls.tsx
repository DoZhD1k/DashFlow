import { useEffect, useRef, useState } from "react";
import { Track } from "../../types/music";

interface PlayerControlsProps {
  track: Track;
  onEnd: () => void; // Проп onEnd обязателен
}

export default function PlayerControls({ track, onEnd }: PlayerControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => onEnd(); // Вызов onEnd при завершении трека
    }
  }, [onEnd]);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(track.stream_url);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex gap-4 mt-4">
      <button className="px-3 py-1 bg-gray-600 rounded-md hover:bg-gray-500 transition">
        ⏮
      </button>
      <button
        className="px-3 py-1 bg-blue-500 rounded-md hover:bg-blue-600 transition"
        onClick={togglePlay}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>
      <button className="px-3 py-1 bg-gray-600 rounded-md hover:bg-gray-500 transition">
        ⏭
      </button>
    </div>
  );
}
