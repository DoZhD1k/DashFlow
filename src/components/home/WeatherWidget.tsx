import React, { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, Snowflake, Search } from "lucide-react";
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

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "01d":
        return <Sun className="w-10 h-10 text-yellow-400" />;
      case "02d":
      case "03d":
      case "04d":
        return <Cloud className="w-10 h-10 text-gray-700 dark:text-gray-300" />;
      case "09d":
      case "10d":
        return <CloudRain className="w-10 h-10 text-blue-400" />;
      case "13d":
        return <Snowflake className="w-10 h-10 text-blue-300" />;
      case "01n":
        return <Sun className="w-10 h-10 text-yellow-400" />;
      case "02n":
      case "03n":
      case "04n":
        return <Cloud className="w-10 h-10 text-gray-700 dark:text-gray-300" />;
      case "09n":
      case "10n":
        return <CloudRain className="w-10 h-10 text-blue-400" />;
      case "13n":
        return <Snowflake className="w-10 h-10 text-blue-300" />;
      default:
        return <Cloud className="w-10 h-10 text-gray-700 dark:text-gray-300" />;
    }
  };

  const fetchWeather = async (city: string) => {
    if (!API_KEY) {
      setError("API ключ не настроен. Добавьте его в переменные окружения.");
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
      localStorage.setItem("defaultCity", data.name);
    } catch (err: any) {
      console.error("Ошибка получения данных о погоде:", err);
      if (err.response && err.response.status === 404) {
        setError("Город не найден.");
      } else {
        setError("Не удалось загрузить погоду.");
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(searchCity);
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-stone-800 rounded-lg shadow-md flex flex-col items-center gap-2 w-full transition-all duration-300">
      {/* Поле ввода и кнопка */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchWeather(searchCity.trim());
        }}
        className="relative w-full"
      >
        <input
          type="text"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          placeholder="Город"
          className="
          w-full p-2 pl-4 pr-10 bg-transparent border-b border-gray-300 focus:outline-none placeholder-gray-400"
        />
        <button
          type="submit"
          title="Найти"
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-400 dark:hover:text-white"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {/* Отображение погоды */}
      {loading ? (
        <div className="flex items-center">
          <Cloud className="w-10 h-10 dark:text-gray-400 animate-pulse" />
          <p className="text-sm dark:text-gray-300 ml-2">Загрузка...</p>
        </div>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : weather ? (
        <div className="flex flex-col items-center">
          {getWeatherIcon(weather.icon)}
          <p className="text-lg font-bold">{weather.city}</p>
          <p className="text-2xl font-semibold">{weather.temperature} °C</p>
          <p className="text-sm capitalize text-gray-500 dark:text-gray-300">
            {weather.description}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default WeatherWidget;
