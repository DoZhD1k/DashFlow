// src/components/music/FeaturedPlaylists.tsx
import React from "react";

interface Playlist {
  id: string;
  name: string;
  description?: string;
  images: { url: string }[];
}

interface FeaturedPlaylistsProps {
  playlists: Playlist[];
  onSelectPlaylist: (playlistId: string) => void;
}

const FeaturedPlaylists: React.FC<FeaturedPlaylistsProps> = ({
  playlists,
  onSelectPlaylist,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className="bg-gray-800 rounded-lg shadow-lg p-4 text-center cursor-pointer hover:bg-gray-700 transition"
          onClick={() => onSelectPlaylist(playlist.id)}
        >
          <img
            src={playlist.images[0]?.url || "/placeholder.png"}
            alt={playlist.name}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <h2 className="text-lg font-semibold">{playlist.name}</h2>
          <p className="text-gray-400">
            {playlist.description || "No description available"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FeaturedPlaylists;
