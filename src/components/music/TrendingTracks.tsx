// src/components/music/TrendingTracks.tsx
import React from "react";

interface Track {
  id: string;
  name: string;
  artist: string;
  albumCover: string;
  uri: string;
}

interface TrendingTracksProps {
  tracks: Track[];
  onSelectTrack: (track: Track) => void;
}

const TrendingTracks: React.FC<TrendingTracksProps> = ({
  tracks,
  onSelectTrack,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="bg-gray-800 rounded-lg shadow-lg p-4 text-center cursor-pointer hover:bg-gray-700 transition"
          onClick={() => onSelectTrack(track)}
        >
          <img
            src={track.albumCover || "/placeholder.png"}
            alt={track.name}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <h2 className="text-lg font-semibold">{track.name}</h2>
          <p className="text-gray-400">{track.artist}</p>
        </div>
      ))}
    </div>
  );
};

export default TrendingTracks;
