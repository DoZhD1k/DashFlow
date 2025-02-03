// src/components/SystemMetricsWidget.tsx
import React, { useEffect, useState } from "react";
import { Cpu } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

const SystemMetricsWidget: React.FC = () => {
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [memoryUsed, setMemoryUsed] = useState<number>(0);
  const [memoryTotal, setMemoryTotal] = useState<number>(0);
  const [processCount, setProcessCount] = useState<number>(0);
  // Для батареи: если данных нет, устанавливаем -1
  const [batteryPercentage, setBatteryPercentage] = useState<number>(-1);
  const [batteryTime, setBatteryTime] = useState<number>(-1);
  const [error, setError] = useState<string | null>(null);

  // Функция форматирования оставшегося времени батареи
  const formatBatteryTime = (seconds: number): string => {
    if (seconds <= 0) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}ч ${minutes}м`;
  };

  const fetchMetrics = async () => {
    try {
      const cpu = await invoke<number>("get_cpu_usage");
      const [usedMem, totalMem] = await invoke<[number, number]>(
        "get_memory_usage"
      );
      const procCount = await invoke<number>("get_process_count");

      setCpuUsage(cpu);
      setMemoryUsed(usedMem);
      setMemoryTotal(totalMem);
      setProcessCount(procCount);
      setError(null);
    } catch (error) {
      console.error("Ошибка при получении системных метрик:", error);
      setError("Не удалось получить системные метрики");
    }

    // Отдельно пытаемся получить данные о батарее
    try {
      const batteryData = await invoke<[number, number]>("get_battery_info");
      setBatteryPercentage(batteryData[0]);
      setBatteryTime(batteryData[1]);
    } catch (e) {
      console.error("Ошибка получения информации о батарее", e);
      setBatteryPercentage(-1);
      setBatteryTime(-1);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Обновление каждые 5 секунд
    return () => clearInterval(interval);
  }, []);

  const memoryPercentage = memoryTotal ? (memoryUsed / memoryTotal) * 100 : 0;
  // Преобразуем память из килобайт в гигабайты (если sysinfo возвращает значения в КБ)
  const usedMemGB = (memoryUsed / (1024 * 1024)).toFixed(2);
  const totalMemGB = (memoryTotal / (1024 * 1024)).toFixed(2);

  return (
    <div className="p-4 bg-white dark:bg-stone-800 rounded-lg shadow-lg transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Cpu className="w-5 h-5 mr-2 text-indigo-500" />
        Системные Метрики
      </h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* CPU Usage */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">CPU Usage</span>
          <span className="text-sm font-semibold">{cpuUsage.toFixed(1)}%</span>
        </div>
        <div className="relative w-full bg-gray-700 rounded-full h-3">
          <div
            className="absolute top-0 left-0 h-3 bg-blue-500 rounded-full"
            style={{ width: `${cpuUsage}%` }}
          ></div>
        </div>
      </div>

      {/* Memory Usage */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Memory Usage</span>
          <span className="text-sm font-semibold">
            {memoryPercentage.toFixed(1)}% ({usedMemGB} МБ / {totalMemGB} МБ)
          </span>
        </div>
        <div className="relative w-full bg-gray-700 rounded-full h-3">
          <div
            className="absolute top-0 left-0 h-3 bg-green-500 rounded-full"
            style={{ width: `${memoryPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Process Count */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Запущено процессов</span>
          <span className="text-sm font-semibold">{processCount}</span>
        </div>
      </div>

      {/* Battery Info */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Батарея</span>
          <span className="text-sm font-semibold">
            {batteryPercentage >= 0
              ? `${batteryPercentage.toFixed(1)}%`
              : "Нет данных"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Оставшееся время</span>
          <span className="text-sm font-semibold">
            {batteryTime >= 0 ? formatBatteryTime(batteryTime) : "Нет данных"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemMetricsWidget;
