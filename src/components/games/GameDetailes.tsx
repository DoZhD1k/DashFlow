import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Play } from "lucide-react";

interface Store {
  name: string;
  url: string;
}

interface DetectedGame {
  name: string | null;
  description: string | null;
  path: string | null;
  platform: string | null;
  url: string | null;
  cover: string | null;
  genres: string[] | null; // Жанры игры
  developers: string[] | null; // Разработчики
  platforms: string[] | null; // Платформы
  stores: Store[] | null; // Магазины, где можно купить
}

interface GameDetailesProps {
  game: DetectedGame | null;
}

export const GameDetailes: React.FC<GameDetailesProps> = ({ game }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleLaunch = async () => {
    if (!game || !game.path) {
      alert("Путь к игре не указан.");
      return;
    }

    try {
      await invoke("launch_game", { path: game.path });
      alert(`Игра "${game.name}" успешно запущена!`);
    } catch (error) {
      alert(`Ошибка запуска игры: ${error}`);
      console.error(error);
    }
  };

  if (!game) {
    return <p className="text-white">Выберите игру, чтобы увидеть детали.</p>;
  }

  const truncatedDescription =
    game.description && game.description.length > 300
      ? `${game.description.slice(0, 300)}...`
      : game.description;

  return (
    <div className="flex flex-col lg:flex-row mt-6 h-full gap-6">
      {/* Левая часть: Детали */}
      <div className="p-8 text-white max-w-5xl flex-1">
        <h2 className="text-6xl font-bold mb-4">
          {game.name || "Название игры"}
        </h2>
        <p className="text-gray-300 mb-6 max-w-2xl leading-relaxed">
          {showFullDescription
            ? game.description
            : truncatedDescription || "Описание отсутствует."}
        </p>
        {/* Жанры, разработчики, платформы */}
        <div className="flex flex-wrap justify-between gap-8">
          {/* Жанры */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Жанры:</h3>
            <div className="flex flex-wrap gap-2">
              {game.genres ? (
                game.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="bg-black/40 px-3 py-1 rounded-full text-sm text-white"
                  >
                    {genre}
                  </span>
                ))
              ) : (
                <p className="text-gray-300">Жанры отсутствуют</p>
              )}
            </div>
          </div>

          {/* Разработчики */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Разработчики:</h3>
            <p className="text-gray-300">
              {game.developers
                ? game.developers.join(", ")
                : "Информация о разработчиках отсутствует"}
            </p>
          </div>
        </div>

        {/* Платформы и где купить */}
        <div className="flex flex-wrap justify-between gap-8 mt-6">
          {/* Платформы */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Платформы:</h3>
            <div className="flex flex-wrap gap-2 max-w-sm">
              {game.platforms ? (
                game.platforms.map((p, index) => (
                  <span
                    key={index}
                    className="bg-black/40 px-3 py-1 rounded-full text-sm text-white"
                  >
                    {p}
                  </span>
                ))
              ) : (
                <p className="text-gray-300">
                  Информация о платформах отсутствует
                </p>
              )}
            </div>
          </div>

          {/* Где купить */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Где купить:</h3>

            <span className="bg-black/40 px-3 py-1 rounded-full text-sm text-white">
              {game.platform}
            </span>
          </div>
        </div>
      </div>

      {/* Правая часть: Картинка и кнопка запуска */}
      <div className="relative lg:w-1/3 flex justify-center items-center">
        <button
          onClick={handleLaunch}
          className="relative rounded-lg shadow-md w-full transition-opacity duration-300 ease-in-out"
        >
          {/* Картинка */}
          <img
            src={game.cover || "placeholder.jpg"}
            alt={game.name || "Обложка игры"}
            className="rounded-lg w-full h-full object-cover group"
          />
          {/* Иконка Play с hover только на картинку */}
          <div className="absolute inset-0 flex items-center justify-center hover:bg-black/40 rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out">
            <Play className="w-16 h-16 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
};
