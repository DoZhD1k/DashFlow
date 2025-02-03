import React from "react";
import * as LucideIcons from "lucide-react";
import { getIconByName } from "./iconMapping";

interface LinkItem {
  id: number;
  name: string;
  icon: string;
  href: string;
  iconColor: string;
}

interface LinkCardProps {
  link: LinkItem;
  onDelete: (id: number) => void;
  onOpen: (url: string) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onDelete, onOpen }) => {
  const IconComponent = getIconByName(link.icon as keyof typeof LucideIcons);
  console.log("Переданная иконка:", link.icon);

  return (
    <div
      className="flex flex-col items-center dark:bg-stone-800 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-stone-700 transition-colors duration-300 cursor-pointer relative w-[100%]"
      onClick={() => onOpen(link.href)}
      title={link.name}
    >
      <div className="mb-2">
        {IconComponent ? (
          <IconComponent
            className="w-10 h-10 transition-transform transform hover:scale-110 bg-black rounded-full p-2"
            strokeWidth={2}
            color={link.iconColor}
          />
        ) : (
          <span className="text-gray-400">🔗</span>
        )}
      </div>
      <span className="font-medium text-center">{link.name}</span>
      {/* Кнопка удаления */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Предотвращает открытие ссылки при клике на кнопку
          onDelete(link.id);
        }}
        className="absolute top-2 right-2 rounded-full hover:text-red-300 transition-colors"
        title="Удалить ссылку"
      >
        ✕
      </button>
    </div>
  );
};

export default LinkCard;
