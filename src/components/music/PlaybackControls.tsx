// src/components//music/PlaybackControls.tsx
import React from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onSkipBack,
  onSkipForward,
}) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-4">
      <button onClick={onSkipBack} className="p-2 bg-gray-700 rounded-full">
        <SkipBack size={24} />
      </button>
      {isPlaying ? (
        <button onClick={onPause} className="p-2 bg-gray-700 rounded-full">
          <Pause size={24} />
        </button>
      ) : (
        <button onClick={onPlay} className="p-2 bg-gray-700 rounded-full">
          <Play size={24} />
        </button>
      )}
      <button onClick={onSkipForward} className="p-2 bg-gray-700 rounded-full">
        <SkipForward size={24} />
      </button>
    </div>
  );
};

export default PlaybackControls;
