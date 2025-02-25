import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
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
  const [filteredLinks, setFilteredLinks] = useState<LinkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    // Фильтрация ссылок по названию
    setFilteredLinks(
      links.filter((link) =>
        link.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, links]);

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result: LinkItem[] = await invoke("get_links");

      // Преобразуем ключи из snake_case в camelCase
      const formattedLinks = result.map((link) => ({
        ...link,
        iconColor: link.icon_color,
      }));

      setLinks(formattedLinks);
    } catch (err: any) {
      console.error("Ошибка загрузки ссылок:", err);
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

    try {
      const addedLink: LinkItem = await invoke("add_links", link);

      console.log("Добавленная ссылка:", addedLink); // Проверка ответа

      // if (!addedLink || !addedLink.id) {
      //   alert("Ошибка: сервер не вернул ID ссылки");
      //   return;
      // }

      setLinks((prev) => [
        ...prev,
        { ...addedLink, iconColor: addedLink.icon_color ?? "#000000" },
      ]);

      setTimeout(() => {
        setSearchQuery(""); // Сброс поиска для обновления списка
      }, 100);
      await fetchLinks();

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
    <div className="p-6 bg-white dark:bg-stone-800 rounded-xl shadow-lg flex flex-col transition-shadow duration-300">
      {/* Заголовок + Поиск */}
      <h3 className="text-lg font-bold mb-4">Ссылки</h3>

      <div className="flex justify-between items-center mb-3 text-center">
        {/* <h3 className="text-lg font-bold">ссылки</h3> */}
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск ссылок..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm w-full p-2 pl-4 pr-10 bg-transparent border-b border-gray-300 focus:outline-none placeholder-gray-400"
          />
          <Search className="w-4 h-4 absolute right-2 top-2 text-gray-400" />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 m-2 bg-blue-500 rounded-md hover:bg-blue-600 transition"
          title="Добавить ссылку"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Список ссылок с прокруткой */}
      <div className="overflow-y-auto max-h-48 custom-scrollbar ">
        {loading ? (
          <p className="text-gray-400 text-sm">Загрузка...</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : filteredLinks.length === 0 ? (
          <p className="text-gray-400 text-sm">Ничего не найдено</p>
        ) : (
          <LinkList
            links={filteredLinks}
            onDelete={handleDeleteLink}
            onOpen={openInBrowser}
          />
        )}
      </div>

      {/* Модальное окно */}
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
