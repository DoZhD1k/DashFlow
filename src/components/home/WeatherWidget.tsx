// import React, { useEffect, useState } from "react";
// import {
//   Sun,
//   Cloud,
//   CloudRain,
//   CloudLightning,
//   CloudSnow,
//   Tornado,
//   Wind,
//   Search,
//   Droplets,
//   Gauge,
//   Eye,
// } from "lucide-react";
// import axios from "axios";

// interface WeatherData {
//   temperature: number;
//   description: string;
//   icon: string;
//   city: string;
//   windSpeed: number;
//   humidity: number;
//   pressure: number;
//   visibility: number;
// }

// const WeatherWidget: React.FC = () => {
//   const [weather, setWeather] = useState<WeatherData | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchCity, setSearchCity] = useState<string>(() => {
//     return localStorage.getItem("defaultCity") || "Almaty";
//   });

//   const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

//   const getWeatherIcon = (icon: string) => {
//     switch (icon) {
//       case "01d":
//         return <Sun className="w-20 h-20 text-yellow-400" />;
//       case "02d":
//       case "03d":
//       case "04d":
//         return <Cloud className="w-20 h-20 text-gray-300" />;
//       case "09d":
//       case "10d":
//         return <CloudRain className="w-20 h-20 text-blue-400" />;
//       case "11d":
//         return <CloudLightning className="w-20 h-20 text-yellow-600" />;
//       case "13d":
//         return <CloudSnow className="w-20 h-20 text-blue-300" />;
//       case "50d":
//         return <Wind className="w-20 h-20 text-gray-400" />;
//       case "01n":
//         return <Sun className="w-20 h-20 text-yellow-500 opacity-75" />;
//       case "02n":
//       case "03n":
//       case "04n":
//         return <Cloud className="w-20 h-20 text-gray-500" />;
//       case "09n":
//       case "10n":
//         return <CloudRain className="w-20 h-20 text-blue-500" />;
//       case "11n":
//         return <CloudLightning className="w-20 h-20 text-yellow-500" />;
//       case "13n":
//         return <CloudSnow className="w-20 h-20 text-blue-400" />;
//       case "50n":
//         return <Tornado className="w-20 h-20 text-gray-600" />;
//       default:
//         return <Cloud className="w-20 h-20 text-gray-400" />;
//     }
//   };

//   const fetchWeather = async (city: string) => {
//     if (!API_KEY) {
//       setError("API ключ не настроен. Добавьте его в переменные окружения.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(
//         `https://api.openweathermap.org/data/2.5/weather`,
//         {
//           params: {
//             q: city,
//             units: "metric",
//             appid: API_KEY,
//             lang: "ru",
//           },
//         }
//       );
//       const data = response.data;
//       setWeather({
//         temperature: Math.round(data.main.temp),
//         description: data.weather[0].description,
//         icon: data.weather[0].icon,
//         city: data.name,
//         windSpeed: data.wind.speed,
//         humidity: data.main.humidity,
//         pressure: data.main.pressure,
//         visibility: data.visibility / 1000, // в километрах
//       });
//       localStorage.setItem("defaultCity", data.name);
//     } catch (err: any) {
//       console.error("Ошибка получения данных о погоде:", err);
//       if (err.response && err.response.status === 404) {
//         setError("Город не найден.");
//       } else {
//         setError("Не удалось загрузить погоду.");
//       }
//       setWeather(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWeather(searchCity);
//   }, []);

//   return (
//     <div className="p-6 bg-white dark:bg-stone-800 rounded-xl shadow-md flex flex-col w-full relative">
//       {loading ? (
//         <div className="flex items-center justify-center mt-12">
//           <Cloud className="w-12 h-12 text-gray-400 animate-pulse" />
//         </div>
//       ) : error ? (
//         <p className="text-sm text-red-400 mt-12">{error}</p>
//       ) : weather ? (
//         <div className="flex flex-col items-center">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               fetchWeather(searchCity.trim());
//             }}
//             className="px-3 py-1 rounded-md bg-gray-100 dark:bg-stone-700 text-sm flex"
//           >
//             <input
//               type="text"
//               value={searchCity}
//               onChange={(e) => setSearchCity(e.target.value)}
//               placeholder="Введите город..."
//               className="bg-transparent outline-none placeholder-gray-400 "
//             />
//             <button
//               type="submit"
//               title="Найти"
//               className="text-gray-400 hover:text-black dark:hover:text-white"
//             >
//               <Search className="w-5 h-5" />
//             </button>
//           </form>

//           <div className="mt-4">{getWeatherIcon(weather.icon)}</div>

//           <p className="text-lg font-medium mt-2 capitalize">
//             {weather.description}
//           </p>

//           <div className="flex justify-between items-center w-full mt-4">
//             <div className="text-left text-sm text-gray-700 dark:text-gray-300 space-y-1">
//               <p className="flex items-center gap-2">
//                 <Wind className="w-4 h-4 text-blue-500" />
//                 Ветер:{" "}
//                 <span className="font-semibold">{weather.windSpeed} м/с</span>
//               </p>
//               <p className="flex items-center gap-2">
//                 <Droplets className="w-4 h-4 text-blue-400" />
//                 Влажность:{" "}
//                 <span className="font-semibold">{weather.humidity}%</span>
//               </p>
//               <p className="flex items-center gap-2">
//                 <Gauge className="w-4 h-4 text-red-400" />
//                 Давление:{" "}
//                 <span className="font-semibold">{weather.pressure} гПа</span>
//               </p>
//               <p className="flex items-center gap-2">
//                 <Eye className="w-4 h-4 text-gray-500" />
//                 Видимость:{" "}
//                 <span className="font-semibold">
//                   {weather.visibility / 1000} км
//                 </span>
//               </p>
//             </div>

//             <div className="text-6xl font-medium">{weather.temperature}°</div>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default WeatherWidget;

import React, { useEffect, useState } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  Wind,
  CloudFog,
  CloudDrizzle,
  Search,
  Droplets,
  Eye,
} from "lucide-react";
import axios from "axios";

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  city: string;
  windSpeed: number;
  humidity: number;
  pressure: number;
  visibility: number;
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
        return <Sun className="w-14 h-14 text-yellow-400" />;
      case "01n":
        return <Sun className="w-14 h-14 text-yellow-500 opacity-75" />;
      case "02d":
      case "02n":
        return <Cloud className="w-14 h-14 text-gray-300" />;
      case "03d":
      case "03n":
        return <Cloud className="w-14 h-14 text-gray-400" />;
      case "04d":
      case "04n":
        return <Cloud className="w-14 h-14 text-gray-500" />;
      case "09d":
      case "09n":
        return <CloudDrizzle className="w-14 h-14 text-blue-500" />;
      case "10d":
      case "10n":
        return <CloudRain className="w-14 h-14 text-blue-400" />;
      case "11d":
      case "11n":
        return <CloudLightning className="w-14 h-14 text-yellow-500" />;
      case "13d":
      case "13n":
        return <CloudSnow className="w-14 h-14 text-blue-400" />;
      case "50d":
      case "50n":
        return <CloudFog className="w-14 h-14 text-gray-400" />;
      default:
        return <Cloud className="w-14 h-14 text-gray-400" />;
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
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        city: data.name,
        windSpeed: data.wind.speed,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // в километрах
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
    <div className="p-6 bg-white dark:bg-stone-800 rounded-xl shadow-md flex flex-col w-full relative">
      {loading ? (
        <div className="flex items-center justify-center mt-12">
          <Cloud className="w-12 h-12 text-gray-400 animate-pulse" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-400 mt-12">{error}</p>
      ) : weather ? (
        <div className="flex flex-col items-center">
          {/* Поле ввода */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchWeather(searchCity.trim());
            }}
            className="w-full flex items-center justify-center"
          >
            <div className="relative w-4/5">
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Введите город..."
                className="bg-gray-100 dark:bg-stone-700 px-2 py-1 text-sm rounded-md outline-none w-full"
              />
              <button
                type="submit"
                title="Найти"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Иконка погоды */}
          <div className="mt-4">{getWeatherIcon(weather.icon)}</div>

          <p className="text-lg font-medium mt-2 capitalize">
            {weather.description}
          </p>

          {/* Данные о погоде */}
          <div className="flex justify-between items-end w-full mt-4">
            <div className="text-left text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-blue-500" />
                Ветер:{" "}
                <span className="font-semibold">{weather.windSpeed} м/с</span>
              </p>
              <p className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                Влажность:{" "}
                <span className="font-semibold">{weather.humidity}%</span>
              </p>
              <p className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-500" />
                Видимость:{" "}
                <span className="font-semibold">{weather.visibility} км</span>
              </p>
            </div>

            {/* Температура */}
            <div className="text-6xl font-medium text-right">
              {weather.temperature}°
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WeatherWidget;
