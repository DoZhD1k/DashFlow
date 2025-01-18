import React from "react";

interface GameCardProps {
  image: string;
  onClick: () => void;
  isSelected: boolean; // Новый пропс для выделения карточки
}

export const GameCard: React.FC<GameCardProps> = ({
  image,
  onClick,
  isSelected,
}) => {
  return (
    <div
      onClick={onClick}
      className={`min-w-[200px] h-[300px] rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-200 ${
        isSelected ? "scale-110 border-4 border-green-500" : "hover:scale-105"
      }`}
    >
      <img src={image} alt="Game" className="w-full h-full object-cover" />
    </div>
  );
};
