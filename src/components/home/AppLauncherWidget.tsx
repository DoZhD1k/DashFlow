import React, { useEffect, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import AddAppModal from "./AddAppModal";

interface AppItem {
  id: number;
  name: string;
  path: string;
}

const AppLauncherWidget: React.FC = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [filteredApps, setFilteredApps] = useState<AppItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    setFilteredApps(
      apps.filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, apps]);

  const fetchApps = async () => {
    setLoading(true);
    setError(null);
    try {
      const result: AppItem[] = await invoke("get_home_apps"); // Изменено на get_home_apps
      setApps(result);
    } catch (err: any) {
      console.error("Ошибка загрузки приложений:", err);
      setError("Не удалось загрузить приложения.");
    } finally {
      setLoading(false);
    }
  };

  const launchApp = async (path: string) => {
    try {
      await invoke("launch_home_app", { path }); // Изменено на launch_home_app
      console.log(`Запуск приложения: ${path}`);
    } catch (err) {
      console.error("Ошибка при запуске:", err);
      alert(`Не удалось запустить: ${err}`);
    }
  };

  const handleAddApp = async (app: { name: string; path: string }) => {
    if (!app.name || !app.path) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }

    try {
      const addedAppId: number = await invoke("add_home_apps", app); // Изменено на add_home_apps
      const newApp: AppItem = { id: addedAppId, ...app };
      setApps((prev) => [...prev, newApp]);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Ошибка при добавлении приложения:", err);
      alert(`Не удалось добавить: ${err}`);
    }
  };

  const handleDeleteApp = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить это приложение?")) return;
    try {
      await invoke("delete_home_app", { id }); // Изменено на delete_home_app
      setApps((prev) => prev.filter((app) => app.id !== id));
    } catch (err: any) {
      console.error("Ошибка при удалении приложения:", err);
      alert(`Не удалось удалить: ${err}`);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-stone-800 rounded-xl shadow-lg flex flex-col transition-shadow duration-300">
      {/* Заголовок + Поиск */}
      <h3 className="text-lg font-bold mb-4">Приложения</h3>
      <div className="flex justify-between items-center mb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm w-full p-2 pl-4 pr-10 bg-transparent border-b border-gray-300 focus:outline-none placeholder-gray-400"
          />
          <Search className="w-4 h-4 absolute right-2 top-2 text-gray-400" />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 bg-blue-500 rounded-md hover:bg-blue-600 transition"
          title="Добавить приложение"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Список приложений с прокруткой */}
      <div className="overflow-y-auto max-h-48 custom-scrollbar">
        {loading ? (
          <p className="text-sm">Загрузка...</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : filteredApps.length === 0 ? (
          <p className="text-sm">Ничего не найдено</p>
        ) : (
          <ul className="text-sm space-y-2 m-2">
            {filteredApps.map((app) => (
              <li
                key={app.id}
                className="flex justify-between items-center bg-gray-200 dark:bg-stone-900 dark:hover:bg-stone-700 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition"
                onClick={() => launchApp(app.path)}
              >
                <span className="">{app.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteApp(app.id);
                  }}
                  title="Удалить"
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Модальное окно */}
      <AddAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddApp}
      />
    </div>
  );
};

export default AppLauncherWidget;
