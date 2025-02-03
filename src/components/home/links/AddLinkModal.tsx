import React, { useState } from "react";
import Modal from "../../Modal";
import ColorSelector from "./ColorSelector";
import IconInput from "./IconInput";
import * as LucideIcons from "lucide-react";
import { getIconByName } from "./iconMapping";

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (link: {
    name: string;
    icon: string;
    href: string;
    iconColor: string;
  }) => void;
  predefinedColors: { name: string; value: string }[];
}

const AddLinkModal: React.FC<AddLinkModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  predefinedColors,
}) => {
  const [newLink, setNewLink] = useState<{
    name: string;
    icon: string;
    href: string;
    iconColor: string;
  }>({
    name: "",
    icon: "",
    href: "",
    iconColor: predefinedColors[0].value,
  });

  const [colorSelection, setColorSelection] = useState<string>(
    predefinedColors[0].value
  );
  const [customColor, setCustomColor] = useState<string>("#000000");

  const currentIconColor =
    colorSelection === "custom"
      ? customColor
      : predefinedColors.find((c) => c.value === colorSelection)?.value ||
        "#000000";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAdd({ ...newLink, iconColor: currentIconColor });
  };

  return (
    isOpen && (
      <Modal onClose={onClose}>
        <h2 className="text-xl font-bold mb-4">Добавить Новую Ссылку</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Название ссылки */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Название
            </label>
            <input
              type="text"
              value={newLink.name}
              onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
              className="border border-gray-300 rounded w-full p-2 mt-1 bg-transparent"
              placeholder="Введите название ссылки"
              required
            />
          </div>

          {/* Иконка */}
          <IconInput
            icon={newLink.icon}
            onIconChange={(icon) => setNewLink({ ...newLink, icon })}
          />

          {/* Цвет иконки */}
          <ColorSelector
            predefinedColors={predefinedColors}
            selectedColor={colorSelection}
            customColor={customColor}
            onColorChange={(color) => {
              setColorSelection(color);
              if (color !== "custom") {
                setNewLink((prev) => ({ ...prev, iconColor: color }));
              }
            }}
            onCustomColorChange={(color) => {
              setCustomColor(color);
              setNewLink((prev) => ({ ...prev, iconColor: color }));
            }}
          />

          {/* Предпросмотр иконки */}
          <div className="flex items-center">
            <span className="mr-2">Предпросмотр:</span>
            {newLink.icon ? (
              (() => {
                const PreviewIcon = getIconByName(
                  newLink.icon as keyof typeof LucideIcons
                );
                return PreviewIcon ? (
                  <PreviewIcon
                    className="w-6 h-6 transition-transform transform hover:scale-110"
                    strokeWidth={2}
                    color={currentIconColor}
                  />
                ) : (
                  <span className="text-gray-400">🔗</span>
                );
              })()
            ) : (
              <span className="text-gray-400">🔗</span>
            )}
          </div>

          {/* URL ссылки */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200">
              URL
            </label>
            <input
              type="url"
              value={newLink.href}
              onChange={(e) => setNewLink({ ...newLink, href: e.target.value })}
              className="border border-gray-300 rounded w-full p-2 mt-1 bg-transparent"
              placeholder="https://example.com"
              required
            />
          </div>

          {/* Кнопки Отмена и Добавить */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Добавить
            </button>
          </div>
        </form>
      </Modal>
    )
  );
};

export default AddLinkModal;
