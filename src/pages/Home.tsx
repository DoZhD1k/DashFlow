import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Moon, Power, Wifi, Sun } from "lucide-react";

export const Home: React.FC = () => {
  const openInBrowser = async (url) => {
    try {
      // Вызываем команду open_url, передавая URL
      await invoke("open_url", { url });
      console.log(`URL открыт: ${url}`);
    } catch (err) {
      console.error("Ошибка при открытии URL:", err);
      alert(`Не удалось открыть URL: ${err}`);
    }
  };
  // Для времени
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Пример «погоды»
  const weather = {
    temp: 28,
    condition: "Rainy Storm Clouds",
    city: "Almaty",
    country: "KZ",
  };

  // Пример прогноза
  const forecast = [
    { day: "Понедельник", temp: 29, cond: "Rain" },
    { day: "Вторник", temp: 21, cond: "Cloudy" },
    { day: "Среда", temp: 24, cond: "Storm" },
    { day: "Четверг", temp: 27, cond: "Sunny" },
    { day: "Пятница", temp: 30, cond: "Hot" },
  ];

  // Переключатель хот-спота
  const [hotspotEnabled, setHotspotEnabled] = useState(false);
  const toggleHotspot = async () => {
    setHotspotEnabled((prev) => !prev);
  };

  // Сон / Выключение
  const handleSleep = () => {
    invoke("sleep_mode");
    console.log("sleep");
  };
  const handleShutdown = () => {
    invoke("shutdown");
    console.log("shutdown");
  };

  return (
    <div className="min-h-screen w-full ">
      {/* Раскладка карточек в сетку */}
      <div className="px-4 pb-6 md:px-8 md:pb-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Погода */}
        <div className="dashboard-card">
          <h2 className="text-3xl font-bold mb-1">{weather.temp}°C</h2>
          <p className="text-sm opacity-80">{weather.condition}</p>
          <p className="text-sm mt-2">
            {weather.city}, {weather.country}
          </p>
        </div>

        {/* Текущее время */}
        <div className="dashboard-card">
          <h3 className="text-xl font-bold mb-2">Текущее время</h3>
          <p className="text-3xl font-semibold">
            {currentTime.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>

        {/* Прогноз */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-3">7 days Forecast</h3>
          <ul className="space-y-1 text-sm">
            {forecast.map((f, i) => (
              <li key={i}>
                {f.day} — {f.temp}°C, {f.cond}
              </li>
            ))}
          </ul>
        </div>

        {/* Задачи */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-3">Задачи на сегодня</h3>
          <ul className="list-disc list-inside text-sm opacity-90">
            <li>Сходить в магазин</li>
            <li>Закончить отчёт</li>
            <li>Позвонить другу</li>
            <li>Почитать книгу</li>
          </ul>
        </div>

        {/* Музыка */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-3">Music Player</h3>
          <p className="text-sm opacity-80 mb-2">
            Rick Astley — Never Gonna Give You Up
          </p>
          <div className="flex gap-2">
            <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-full text-white">
              ⏮
            </button>
            <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-full text-white">
              ▶
            </button>
            <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-full text-white">
              ⏭
            </button>
          </div>
        </div>

        {/* Быстрые ссылки */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm">
            <button
              onClick={() => openInBrowser("https://youtube.com")}
              className="bg-gray-100 dark:bg-white/10 rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-white/20 transition"
            >
              YouTube
            </button>
            <button
              onClick={() => openInBrowser("https://github.com")}
              className="bg-gray-100 dark:bg-white/10 rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-white/20 transition"
            >
              GitHub
            </button>
            <button
              onClick={() => openInBrowser("https://chat.openai.com")}
              className="bg-gray-100 dark:bg-white/10 rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-white/20 transition"
            >
              ChatGPT
            </button>
          </div>
        </div>

        {/* Быстрые приложения */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-3">Quick Apps</h3>
          <div className="flex flex-col gap-2 text-sm">
            <button className="bg-gray-100 dark:bg-white/10 rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-white/20 transition text-left">
              Word
            </button>
            <button className="bg-gray-100 dark:bg-white/10 rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-white/20 transition text-left">
              Excel
            </button>
            <button className="bg-gray-100 dark:bg-white/10 rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-white/20 transition text-left">
              PowerPoint
            </button>
          </div>
        </div>

        {/* Системные настройки */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-3">Системные настройки</h3>
          {/* Свитчер Hotspot */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Wifi className="w-5 h-5" />
              <span>Hotspot</span>
            </div>
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={hotspotEnabled}
                onChange={toggleHotspot}
              />
              <div
                className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none rounded-full peer
                peer-checked:bg-green-500 
                relative
                after:content-['']
                after:absolute after:top-[1px] after:left-[1px]
                after:bg-white after:border-gray-300 after:border after:rounded-full
                after:h-5 after:w-5 after:transition-all 
                peer-checked:after:translate-x-full
              "
              />
            </label>
          </div>

          {/* Сон + Выключение */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={handleSleep}
              className="flex items-center gap-1 bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 transition text-white"
            >
              <Moon className="w-5 h-5" />
              Сон
            </button>
            <button
              onClick={handleShutdown}
              className="flex items-center gap-1 bg-red-600 px-4 py-2 rounded-md hover:bg-red-500 transition text-white"
            >
              <Power className="w-5 h-5" />
              Выключить
            </button>
          </div>
          <p className="text-sm opacity-70">
            Демо-кнопки для вызова системных команд.
          </p>
        </div>
      </div>
    </div>
  );
};
