import React, { useState, useEffect } from "react";
import Loader from "~/components/Loader";
import {
  Sun,
  Moon,
  Sliders,
  PaintBucket,
  Text,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";

export const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("auto");
  const [interfaceSize, setInterfaceSize] = useState("normal");
  const [customColor, setCustomColor] = useState("#3b82f6");
  const [font, setFont] = useState("Inter");
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 150);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-stone-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen p-6 dark:bg-stone-900 overflow-y-auto custom-scrollbar">
      <div className="flex flex-1 justify-between items-center text-center p-2">
        <h1 className="text-2xl font-bold mb-4">Настройки</h1>
      </div>

      {/* 🔥 АЛЕРТ О ТОМ, ЧТО ЭТО ЗАГЛУШКИ */}
      <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg mb-6 flex items-center gap-3">
        <AlertTriangle className="text-yellow-700 dark:text-yellow-200 w-6 h-6" />
        <p className="text-yellow-700 dark:text-yellow-200 text-sm">
          Это всего лишь заглушки для будущего функционала. Настройки пока не
          сохраняются.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 🔥 Тема */}
        <div className="bg-gray-200 dark:bg-stone-800 p-4 rounded-lg shadow">
          <label className="text-lg font-bold mb-2 flex items-center gap-2">
            <Sliders className="w-5 h-5" /> Тема
          </label>
          <div className="flex gap-2">
            <button
              title="Светлая тема"
              className={`p-2 rounded-lg transition ${
                theme === "light"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-stone-700"
              }`}
              onClick={() => setTheme("light")}
            >
              <Sun className="w-5 h-5" /> Светлая
            </button>
            <button
              title="Тёмная тема"
              className={`p-2 rounded-lg transition ${
                theme === "dark"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-stone-700"
              }`}
              onClick={() => setTheme("dark")}
            >
              <Moon className="w-5 h-5" /> Тёмная
            </button>
            <button
              title="Авто"
              className={`p-2 rounded-lg transition ${
                theme === "auto"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-stone-700"
              }`}
              onClick={() => setTheme("auto")}
            >
              Авто
            </button>
          </div>
        </div>

        {/* 🎨 Кастомные цвета */}
        <div className="bg-gray-200 dark:bg-stone-800 p-4 rounded-lg shadow">
          <label
            htmlFor="customColor"
            className="text-lg font-bold mb-2 flex items-center gap-2"
          >
            <PaintBucket className="w-5 h-5" /> Основной цвет
          </label>
          <input
            id="customColor"
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-full h-10 rounded-lg cursor-pointer"
            title="Выберите цвет"
          />
        </div>

        {/* 🔤 Выбор шрифта */}
        <div className="bg-gray-200 dark:bg-stone-800 p-4 rounded-lg shadow">
          <label
            htmlFor="fontSelect"
            className="text-lg font-bold mb-2 flex items-center gap-2"
          >
            <Text className="w-5 h-5" /> Шрифт
          </label>
          <select
            id="fontSelect"
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-300 dark:bg-stone-700"
            title="Выберите шрифт"
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Fira Code">Fira Code</option>
            <option value="Montserrat">Montserrat</option>
          </select>
        </div>

        {/* 📏 Размер интерфейса */}
        <div className="bg-gray-200 dark:bg-stone-800 p-4 rounded-lg shadow">
          <label className="text-lg font-bold mb-2 flex items-center gap-2">
            <Sliders className="w-5 h-5" /> Размер интерфейса
          </label>
          <div className="flex gap-2">
            <button
              title="Маленький размер"
              className={`p-2 rounded-lg transition ${
                interfaceSize === "small"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-stone-700"
              }`}
              onClick={() => setInterfaceSize("small")}
            >
              Маленький
            </button>
            <button
              title="Обычный размер"
              className={`p-2 rounded-lg transition ${
                interfaceSize === "normal"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-stone-700"
              }`}
              onClick={() => setInterfaceSize("normal")}
            >
              Обычный
            </button>
            <button
              title="Крупный размер"
              className={`p-2 rounded-lg transition ${
                interfaceSize === "large"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-stone-700"
              }`}
              onClick={() => setInterfaceSize("large")}
            >
              Крупный
            </button>
          </div>
        </div>

        {/* 🖥️ Видимость боковой панели */}
        <div className="bg-gray-200 dark:bg-stone-800 p-4 rounded-lg shadow">
          <label className="text-lg font-bold mb-2 flex items-center gap-2">
            <Eye className="w-5 h-5" /> Отображение панели
          </label>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-2 rounded-lg transition ${
              showSidebar
                ? "bg-blue-500 text-white"
                : "bg-gray-300 dark:bg-stone-700"
            } flex items-center gap-2`}
            title={
              showSidebar ? "Скрыть боковую панель" : "Показать боковую панель"
            }
          >
            {showSidebar ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
            {showSidebar ? "Скрыть" : "Показать"}
          </button>
        </div>
      </div>
    </div>
  );
};
