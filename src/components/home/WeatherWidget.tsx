// src/components/WeatherWidget.tsx
import React, { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, Snowflake, Search, MapPin } from "lucide-react";
import axios from "axios";

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  city: string;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchCity, setSearchCity] = useState<string>(() => {
    return localStorage.getItem("defaultCity") || "Almaty";
  });

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Функция для получения иконки
  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "01d":
        return <Sun className="w-12 h-12 text-yellow-400" />;
      case "02d":
      case "03d":
      case "04d":
        return <Cloud className="w-12 h-12 text-gray-300" />;
      case "09d":
      case "10d":
        return <CloudRain className="w-12 h-12 text-blue-400" />;
      case "13d":
        return <Snowflake className="w-12 h-12 text-blue-300" />;
      case "01n":
        return <Sun className="w-12 h-12 text-yellow-400" />;
      case "02n":
      case "03n":
      case "04n":
        return <Cloud className="w-12 h-12 text-gray-300" />;
      case "09n":
      case "10n":
        return <CloudRain className="w-12 h-12 text-blue-400" />;
      case "13n":
        return <Snowflake className="w-12 h-12 text-blue-300" />;
      default:
        return <Cloud className="w-12 h-12 text-gray-300" />;
    }
  };

  // Функция для запроса погоды
  const fetchWeather = async (city: string) => {
    if (!API_KEY) {
      setError(
        "API ключ не настроен. Пожалуйста, добавьте его в переменные окружения."
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: city,
            units: "metric",
            appid: API_KEY,
            lang: "ru",
          },
        }
      );
      const data = response.data;
      setWeather({
        temperature: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        city: data.name,
      });
      localStorage.setItem("defaultCity", data.name); // Сохраняем корректное название города
    } catch (err: any) {
      console.error("Ошибка при получении данных о погоде:", err);
      if (err.response && err.response.status === 404) {
        setError("Город не найден. Пожалуйста, попробуйте другой.");
      } else {
        setError("Не удалось загрузить данные о погоде.");
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Инициализация с сохранённым или начальным городом
  useEffect(() => {
    fetchWeather(searchCity);
  }, []); // Пустой массив зависимостей для однократного вызова

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedCity = searchCity.trim();
    if (trimmedCity === "") {
      setError("Пожалуйста, введите название города.");
      return;
    }
    fetchWeather(trimmedCity);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg flex flex-col items-center gap-4 transition-all duration-300 hover:shadow-2xl">
      {/* Форма Поиска Города */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Введите город"
            className="w-full p-2 pl-4 pr-10 bg-transparent border-b border-gray-300 text-white focus:outline-none placeholder-gray-400"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 mt-2 mr-3 bg-transparent"
            title="Поиск"
          >
            <Search className="w-5 h-5 text-gray-300 hover:text-white" />
          </button>
        </div>
      </form>

      {/* Отображение Погоды */}
      {loading ? (
        <div className="flex items-center">
          <Cloud className="w-12 h-12 text-gray-400 animate-pulse" />
          <p className="text-lg text-white ml-4">Загрузка погоды...</p>
        </div>
      ) : error ? (
        <div className="flex items-center">
          <CloudRain className="w-12 h-12 text-red-500" />
          <p className="text-lg text-white ml-4">{error}</p>
        </div>
      ) : weather ? (
        <div className="flex flex-col items-center">
          <div className="flex-shrink-0">{getWeatherIcon(weather.icon)}</div>
          <div className="mt-4 text-center text-white">
            <div className="flex justify-between items-center">
              <MapPin />
              <h3 className="text-2xl font-bold flex">{weather.city}</h3>
            </div>
            <p className="text-3xl font-semibold">{weather.temperature} °C</p>
            <p className="capitalize text-lg">{weather.description}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WeatherWidget;
