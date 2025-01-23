// src/components/SystemMetricsWidget.tsx
import React, { useEffect, useState } from "react";
import { Cpu, Monitor } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

const SystemMetricsWidget: React.FC = () => {
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [memoryUsed, setMemoryUsed] = useState<number>(0);
  const [memoryTotal, setMemoryTotal] = useState<number>(0);

  const fetchMetrics = async () => {
    try {
      const cpu = await invoke<number>("get_cpu_usage");
      const [usedMem, totalMem] = await invoke<[number, number]>(
        "get_memory_usage"
      );
      setCpuUsage(cpu);
      setMemoryUsed(usedMem);
      setMemoryTotal(totalMem);
    } catch (error) {
      console.error("Ошибка при получении системных метрик:", error);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Обновление каждые 5 секунд
    return () => clearInterval(interval);
  }, []);

  const memoryPercentage = memoryTotal ? (memoryUsed / memoryTotal) * 100 : 0;

  return (
    <div className="p-4 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
        <Cpu className="w-5 h-5 mr-2 text-indigo-500" />
        Системные Метрики
      </h3>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white">CPU Usage</span>
          <span className="text-sm font-semibold text-white">
            {cpuUsage.toFixed(1)}%
          </span>
        </div>
        <div className="relative w-full bg-gray-700 rounded-full h-3">
          <div
            className="absolute top-0 left-0 h-3 bg-blue-500 rounded-full"
            style={{ width: `${cpuUsage}%` }}
          ></div>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white">Memory Usage</span>
          <span className="text-sm font-semibold text-white">
            {memoryPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="relative w-full bg-gray-700 rounded-full h-3">
          <div
            className="absolute top-0 left-0 h-3 bg-green-500 rounded-full"
            style={{ width: `${memoryPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SystemMetricsWidget;
