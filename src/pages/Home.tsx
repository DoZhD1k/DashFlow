import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import TimeWidget from "../components/home/TimeWidget";
import WeatherWidget from "../components/home/WeatherWidget";
import HotLinksWidget from "../components/home/HotLinksWidget";
import { SystemSettingsWidget } from "../components/home/SystemSettingsWidget";
import CalendarWidget from "../components/home/CalendarWidget";
import { SystemAppsWidget } from "~/components/home/SystemAppsWidget";
import SystemMetricsWidget from "~/components/home/SystemMetricsWidget";
import MusicPlayerWidget from "~/components/home/MusicPlayerWidget";
import { CurrencyRatesWidget } from "~/components/home/CurrencyRatesWidget";
import AppLauncherWidget from "~/components/home/AppLauncherWidget";
import ScreenRecorderWidget from "~/components/home/ScreenRecorderWidget";
export const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Симуляция загрузки данных
    setTimeout(() => {
      setIsLoading(false);
    }, 150); // Можно убрать задержку, если не нужна
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-stone-900">
        <Loader />
      </div>
    );
  }
  return (
    <div className="min-h-screen max-h-screen p-8 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 transition-colors duration-300 bg-gray-100 dark:bg-stone-900 overflow-y-auto custom-scrollbar">
      {/* 🔹 Левая колонка (3/4 экрана, теперь с row-структурой) */}
      <div className="col-span-3 grid grid-rows-4 gap-4 md:gap-6 ">
        {/* 🔹 Верхний блок (заголовки) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 row-span-1">
          <TimeWidget />
          <CurrencyRatesWidget />
          <WeatherWidget />
        </div>

        {/* 🔹 Нижний блок (основной контент) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 row-span-3">
          <ScreenRecorderWidget />
          <AppLauncherWidget />
          <HotLinksWidget />

          <SystemAppsWidget />
          <SystemMetricsWidget />
          <SystemSettingsWidget />
        </div>
      </div>

      {/* 🔹 Правая колонка (1/4 экрана, вертикальный стек) */}
      <div className="grid grid-rows-2 gap-4 md:gap-6">
        <CalendarWidget />
        <MusicPlayerWidget />
      </div>
    </div>
  );
};
