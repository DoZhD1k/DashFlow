// src/components//music/TrackList.tsx
import React from "react";

interface Track {
  name: string;
  artist: string;
  albumCover: string;
  uri: string; // URI трека для воспроизведения
}

interface TrackListProps {
  tracks: Track[];
  onSelectTrack: (track: Track) => void;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, onSelectTrack }) => {
  if (!Array.isArray(tracks)) {
    console.error("TrackList получил некорректные данные:", tracks);
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
      {tracks.map((track, index) => (
        <div
          key={index}
          className="bg-gray-800 rounded-lg shadow-lg p-4 text-center cursor-pointer hover:bg-gray-700 transition"
          onClick={() => onSelectTrack(track)}
        >
          <img
            src={track.albumCover}
            alt={`Album Cover ${index + 1}`}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <h2 className="text-lg font-semibold">{track.name}</h2>
          <p className="text-gray-400">{track.artist}</p>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
