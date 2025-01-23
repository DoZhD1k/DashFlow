import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { getIconByName } from "./links/iconMapping";
import * as LucideIcons from "lucide-react";
import LinkList from "./links/LinkList";
import AddLinkModal from "./links/AddLinkModal";

interface LinkItem {
  id: number;
  name: string;
  icon: string;
  href: string;
  iconColor: string;
  icon_color: string;
}

const predefinedColors: { name: string; value: string }[] = [
  { name: "Красный", value: "#FF0000" },
  { name: "Зеленый", value: "#00FF00" },
  { name: "Синий", value: "#0000FF" },
  { name: "Желтый", value: "#FFFF00" },
  { name: "Фиолетовый", value: "#800080" },
  { name: "Кастомный", value: "custom" },
];

const HotLinksWidget: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result: LinkItem[] = await invoke("get_links");

      // Преобразуем ключи из snake_case в camelCase
      const formattedLinks = result.map((link) => ({
        ...link,
        iconColor: link.icon_color, // Добавляем camelCase ключ
      }));

      setLinks(formattedLinks);
    } catch (err: any) {
      console.error("Ошибка при получении ссылок:", err);
      setError("Не удалось загрузить ссылки.");
    } finally {
      setLoading(false);
    }
  };

  const openInBrowser = async (url: string) => {
    try {
      await invoke("open_url", { url });
      console.log(`URL открыт: ${url}`);
    } catch (err) {
      console.error("Ошибка при открытии URL:", err);
      alert(`Не удалось открыть URL: ${err}`);
    }
  };

  const handleAddLink = async (link: {
    name: string;
    icon: string;
    href: string;
    iconColor: string;
  }) => {
    if (!link.name || !link.icon || !link.href || !link.iconColor) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }

    // Валидация иконки
    const isValidIcon = Boolean(
      getIconByName(link.icon as keyof typeof LucideIcons)
    );
    if (!isValidIcon) {
      alert(
        "Введённая иконка не найдена. Пожалуйста, проверьте название иконки."
      );
      return;
    }

    try {
      console.log("Добавление ссылки с аргументами:", link);

      const addedLink: LinkItem = await invoke("add_links", link);

      console.log("Добавленная ссылка:", addedLink);

      setLinks((prev) => [
        ...prev,
        { ...addedLink, iconColor: addedLink.icon_color },
      ]);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Ошибка при добавлении ссылки:", err);
      alert(`Не удалось добавить ссылку: ${err}`);
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту ссылку?")) return;
    try {
      await invoke("delete_link", { id });
      setLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (err: any) {
      console.error("Ошибка при удалении ссылки:", err);
      alert(`Не удалось удалить ссылку: ${err}`);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
      {/* Заголовок и кнопка добавления */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Горячие ссылки</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
          title="Добавить ссылку"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Отображение ссылок */}
      {loading ? (
        <p className="text-white">Загрузка ссылок...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <LinkList
          links={links}
          onDelete={handleDeleteLink}
          onOpen={openInBrowser}
        />
      )}

      {/* Модальное Окно для Добавления Ссылки */}
      <AddLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddLink}
        predefinedColors={predefinedColors}
      />
    </div>
  );
};

export default HotLinksWidget;
