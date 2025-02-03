import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { GameSlider } from "../components/games/GameSlider";
import { GameDetailes } from "../components/games/GameDetailes";
import Loader from "../components/Loader";
import { DetectedGame } from "~/types/types";

export const Games: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<DetectedGame | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCardClick = (game: DetectedGame) => {
    setSelectedGame(game);
    console.log("Фон установлен на обложку:", game.cover);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 150);
  }, []);

  const dropTable = async () => {
    try {
      const result = await invoke("drop_games_table");
      console.log("Таблица удалена:", result);
      alert("Таблица games успешно удалена!");
    } catch (error) {
      console.error("Ошибка удаления таблицы:", error);
      alert("Не удалось удалить таблицу.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-stone-900">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={`games-container ${
        selectedGame?.cover ? "has-background" : "games-game-bg-dark"
      }`}
      data-bg={selectedGame?.cover || ""}
      ref={(el) => {
        if (el && selectedGame?.cover) {
          el.style.setProperty("--game-cover", `url(${selectedGame.cover})`);
        }
      }}
    >
      {!selectedGame && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 pointer-events-none">
          <h2 className="text-4xl font-bold mb-4 opacity-90 animate-pulseGlow drop-shadow-neon pointer-events-auto">
            🎮 Выберите игру
          </h2>
          <p className="text-lg max-w-lg text-gray-300 opacity-75 animate-fadeInBlur drop-shadow-md pointer-events-auto">
            Нажмите на карточку ниже, чтобы посмотреть детали.
          </p>
        </div>
      )}

      <div className="p-5 backdrop-blur-md bg-black/60 h-full flex flex-col min-h-screen max-h-screen">
        {selectedGame && <GameDetailes game={selectedGame} />}

        {!selectedGame && (
          <div className="mt-5">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              onClick={() => setShowConfirm(true)}
            >
              ❌ Удалить таблицу games
            </button>
          </div>
        )}

        {showConfirm && (
          <div className="relative inset-0 flex items-center justify-center z-900">
            <div className="bg-white dark:bg-stone-800 p-5 rounded-lg shadow-lg text-center">
              <p className="text-lg font-semibold mb-4">Вы уверены?</p>
              <p className="text-sm text-gray-500 mb-4">
                Это действие удалит ВСЕ ДАННЫЕ в таблице games.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-gray-400 text-black rounded-md hover:bg-gray-500 transition"
                  onClick={() => setShowConfirm(false)}
                >
                  Отмена
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  onClick={() => {
                    dropTable();
                    setShowConfirm(false);
                  }}
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto">
          <GameSlider onCardClick={handleCardClick} />
        </div>
      </div>
    </div>
  );
};

// import React, { useState, useEffect } from "react";
// import { GameSlider } from "../components/games/GameSlider";
// import { GameDetailes } from "../components/games/GameDetailes";
// import Loader from "../components/Loader";
// import { DetectedGame } from "~/types/types";

// export const Games: React.FC = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedGame, setSelectedGame] = useState<DetectedGame | null>(null);
//   const [gamesLoaded, setGamesLoaded] = useState(false); // 🔥 Новый стейт, когда игры загрузятся

//   const handleCardClick = (game: DetectedGame) => {
//     setSelectedGame(game);
//     console.log("Фон установлен на обложку:", game.cover);
//   };

//   useEffect(() => {
//     if (gamesLoaded) {
//       setIsLoading(false); // Отключаем загрузку, когда данные получены
//     }
//   }, [gamesLoaded]); // Следим за загрузкой игр

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-stone-900">
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`games-container ${
//         selectedGame?.cover ? "has-background" : "games-game-bg-dark"
//       }`}
//       data-bg={selectedGame?.cover || ""}
//       ref={(el) => {
//         if (el && selectedGame?.cover) {
//           el.style.setProperty("--game-cover", `url(${selectedGame.cover})`);
//         }
//       }}
//     >
//       {/* Если игра не выбрана */}
//       {!selectedGame && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 pointer-events-none">
//           <h2 className="text-4xl font-bold mb-4 opacity-90 animate-pulseGlow drop-shadow-neon pointer-events-auto">
//             🎮 Выберите игру
//           </h2>
//           <p className="text-lg max-w-lg text-gray-300 opacity-75 animate-fadeInBlur drop-shadow-md pointer-events-auto">
//             Нажмите на карточку ниже, чтобы посмотреть детали.
//           </p>
//         </div>
//       )}

//       <div className="p-5 backdrop-blur-md bg-black/60 h-full flex flex-col min-h-screen max-h-screen">
//         {selectedGame && <GameDetailes game={selectedGame} />}

//         {/* Слайдер */}
//         <div className="mt-auto">
//           <GameSlider
//             onCardClick={handleCardClick}
//             setGamesLoaded={setGamesLoaded}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
