import React, { useState } from "react";
import { SearchTracks } from "./JamendoApi";

interface Track {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  audio: string;
  image: string;
}

export const MusicSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const data = await SearchTracks(query);
    setLoading(false);

    if (data && data.results) {
      setTracks(
        data.results.map((track: any) => ({
          id: track.id,
          name: track.name,
          artist_name: track.artist_name,
          album_name: track.album_name,
          audio: track.audio,
          image: track.image,
        }))
      );
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Введите название трека или исполнителя"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white w-full"
        />
        <button
          onClick={handleSearch}
          className="mt-2 p-2 bg-green-500 rounded w-full"
        >
          Искать
        </button>
      </div>

      {loading && <p>Загрузка...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-gray-800 p-4 rounded shadow flex flex-col items-center"
          >
            <img
              src={track.image || "placeholder.jpg"}
              alt={track.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-lg font-bold">{track.name}</h2>
            <p className="text-sm text-gray-400">{track.artist_name}</p>
            <p className="text-sm text-gray-400">{track.album_name}</p>
            <audio controls className="w-full mt-2">
              <source src={track.audio} type="audio/mpeg" />
              Ваш браузер не поддерживает аудио.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};
