import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { GameCard } from "./GameCard";

interface DetectedGame {
  name: string | null;
  description: string | null;
  path: string | null;
  platform: string | null;
  url: string | null;
  cover: string | null;
  genres: string | null;
  developers: string | null;
  platforms: string | null;
}

interface GameSliderProps {
  onCardClick: (game: DetectedGame) => void;
}

export const GameSlider: React.FC<GameSliderProps> = ({ onCardClick }) => {
  const [games, setGames] = useState<DetectedGame[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchGames() {
      setIsLoading(true);
      setError(null);

      try {
        const detectedGames: DetectedGame[] = await invoke<DetectedGame[]>(
          "scan_and_fetch_games"
        );
        setGames(detectedGames);
        console.log("Игры успешно загружены:", detectedGames);
      } catch (error: any) {
        console.error("Ошибка при получении списка игр:", error);
        setError("Не удалось загрузить список игр.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchGames();
  }, []);

  const handleCardClick = (index: number, game: DetectedGame) => {
    setSelectedIndex(index);
    console.log("Выбрана игра:", game);
    onCardClick(game);
  };

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -300, // Прокручиваем влево
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 300, // Прокручиваем вправо
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Кнопка для пролистывания влево */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white px-2 py-4 hover:bg-black/30 transition focus:outline-none border-2 border-white rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Слайдер */}
      <div
        ref={sliderRef}
        className="flex space-x-4 overflow-x-auto p-4 bg-dark-800 rounded-lg no-scrollbar gap-4 w-11/12 mx-auto"
      >
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && games.length === 0 && <p>Игры не найдены.</p>}
        {games.map((game, index) => (
          <GameCard
            key={index}
            image={game.cover || "https://via.placeholder.com/200x300"}
            isSelected={selectedIndex === index}
            onClick={() => handleCardClick(index, game)}
          />
        ))}
      </div>

      {/* Кнопка для пролистывания вправо */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2  text-white px-2 py-4 hover:bg-black/30 transition focus:outline-none border-2 border-white rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
