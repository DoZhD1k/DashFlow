import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
  images: { url: string }[];
}

interface AlbumsProps {
  accessToken: string;
  category: string;
  setCategory: (category: string) => void;
}

const Albums: React.FC<AlbumsProps> = ({
  accessToken,
  category,
  setCategory,
}) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlbums = async (categoryId: string) => {
    setLoading(true);
    setError(null);

    const albumIdsByCategory: Record<string, string[]> = {
      chill: ["4aawyAB9vmqN3uQ7FjRGTy", "1DFixLWuPkv3KT3TnV35m3"],
      gaming: ["7gsWAHLeT0w7es6FofOXk1", "3Gz2XfEewEmHYBjMeFkG9e"],
      work: ["5ht7ItJgpBH7W6vJ5BqpPr", "2ODvWsOgouMbaA5xf0RkJe"],
    };

    const albumIds = albumIdsByCategory[categoryId] || [];

    try {
      const response = await invoke<string>("fetch_albums", {
        accessToken,
        albumIds,
      });
      const parsedResponse = JSON.parse(response);
      setAlbums(parsedResponse.albums || []);
      console.log("Полученные альбомы:", albums);
    } catch (err) {
      console.error("Ошибка при загрузке альбомов:", err);
      setError("Не удалось загрузить альбомы.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums(category);
  }, [category]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Альбомы</h1>

      <div className="flex gap-4 mb-4">
        {["chill", "gaming", "work"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg ${
              category === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {albums.length > 0 ? (
          albums.map((album) => (
            <div
              key={album.id}
              className="bg-gray-800 text-white rounded-lg p-4 shadow-lg"
            >
              <img
                src={album.images[0]?.url || ""}
                alt={album.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-bold">{album.name}</h2>
              <p className="text-gray-400">
                {album.artists?.map((artist) => artist.name).join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Нет альбомов для отображения.</p>
        )}
      </div>
    </div>
  );
};

export default Albums;
