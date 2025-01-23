import React from "react";

interface CurrentTrackProps {
  track: {
    name: string;
    artist: string;
    albumCover: string;
  } | null; // Трек может быть null, если ничего не выбрано
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipNext: () => void;
  onSkipPrevious: () => void;
}

const CurrentTrack: React.FC<CurrentTrackProps> = ({
  track,
  isPlaying,
  onPlayPause,
  onSkipNext,
  onSkipPrevious,
}) => {
  if (!track) {
    return (
      <div className="text-center text-gray-400">
        <p>Выберите трек для воспроизведения</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <img
        src={track.albumCover}
        alt={track.name}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <h2 className="text-lg font-bold">{track.name}</h2>
      <p className="text-gray-400">{track.artist}</p>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={onSkipPrevious}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Предыдущий
        </button>
        <button
          onClick={onPlayPause}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          {isPlaying ? "Пауза" : "Воспроизвести"}
        </button>
        <button
          onClick={onSkipNext}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Следующий
        </button>
      </div>
    </div>
  );
};

export default CurrentTrack;
