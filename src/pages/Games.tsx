import React, { useState } from "react";
import { GameSlider } from "../components/games/GameSlider";
import { GameDetailes } from "~/components/games/GameDetailes";

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

export const Games: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<DetectedGame | null>(null);

  const handleCardClick = (game: DetectedGame) => {
    setSelectedGame(game);
    console.log("Фон установлен на обложку:", game.cover);
  };

  return (
    <div
      className="h-screen bg-cover bg-center overflow-x-hidden scrollbar-hide"
      style={{
        backgroundImage: selectedGame?.cover
          ? `url(${selectedGame.cover})`
          : "none",
        backgroundColor: "#121212",
      }}
    >
      <div className="p-6 backdrop-blur-md bg-black/60 h-full flex flex-col">
        <div className="text-center text-white mb-6"></div>

        {/* Блок с описанием */}
        <GameDetailes game={selectedGame} />

        {/* Слайдер */}
        <div className="mt-auto">
          <GameSlider onCardClick={handleCardClick} />
        </div>
      </div>
    </div>
  );
};
