import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Пример: для иконки используем публичные иконки OpenWeatherMap
// или любую другую иконку. В OWM есть "weather[0].icon" типа "04d".
// Ссылка будет такая: https://openweathermap.org/img/wn/04d@2x.png

interface WeatherData {
  temp: number;
  description: string;
  icon: string; // openweathermap icon code, напр. "04d"
  city: string;
  country: string;
  date: string;
  time: string;
}

export const WeatherCard: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Обратите внимание: Вставьте ваш реальный API_KEY в .env:
  // .env:
  // VITE_WEATHER_API_KEY=ваш_ключ

  // Или пропишите прямо здесь (но так делать не рекомендуется)
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "YOUR_API_KEY";
  const CITY = "Almaty"; // Можно сделать динамическим
  const UNITS = "metric"; // Цельсий

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=${UNITS}&lang=ru&appid=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Ошибка запроса: ${response.status}`);
        }
        const data = await response.json();

        // Распарсим нужные поля
        // data.main.temp - температура
        // data.weather[0].description - описание, data.weather[0].icon - код иконки
        // data.name - город, data.sys.country - страна
        // Для даты/времени возьмём локальное текущее время
        const now = new Date();
        const dateStr = now.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const timeStr = now.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const weatherInfo: WeatherData = {
          temp: Math.round(data.main.temp),
          description: data.weather[0].description, // на русском, так как &lang=ru
          icon: data.weather[0].icon,
          city: data.name,
          country: data.sys.country,
          date: dateStr,
          time: timeStr,
        };

        setWeather(weatherInfo);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchWeather();
  }, []);

  // Для анимации Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  if (error) {
    return <div className="text-red-500">Ошибка загрузки погоды: {error}</div>;
  }

  // Пока данные не пришли, показываем загрузку
  if (!weather) {
    return (
      <div
        className="
        bg-white/5 dark:bg-stone-800
        backdrop-blur-xl
        border border-white/10
        rounded-3xl
        p-6
        shadow-lg
        w-full max-w-sm
      "
      >
        Загрузка погоды...
      </div>
    );
  }

  return (
    <motion.div
      className="
        relative
        w-full max-w-sm
        bg-white/5 dark:bg-stone-800
        backdrop-blur-xl
        border border-white/10
        rounded-3xl
        p-6
        shadow-lg
        overflow-hidden
      "
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Полупрозрачный градиент или картинка на фон (по желанию) */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t from-black/30 to-transparent
          pointer-events-none
          rounded-3xl
        "
      />

      {/* Температура + Иконка */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold">{weather.temp}°C</h2>
          <p className="capitalize opacity-80">{weather.description}</p>
        </div>
        {/* Иконка из openweathermap */}
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt="Weather Icon"
          className="w-16 h-16"
        />
      </div>

      {/* Город, страна */}
      <div className="mb-2 opacity-80">
        <p>
          {weather.city}, {weather.country}
        </p>
      </div>

      {/* Дата и время */}
      <div className="text-sm opacity-60">
        <p>{weather.date}</p>
        <p>{weather.time}</p>
      </div>
    </motion.div>
  );
};
