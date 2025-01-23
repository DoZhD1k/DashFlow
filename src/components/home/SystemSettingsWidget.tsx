import React, { useEffect, useState } from "react";
import { Settings, Wifi, Moon, Power } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

interface SettingItem {
  name: string;
  icon: JSX.Element;
  action: () => void;
}

export const SystemSettingsWidget: React.FC = () => {
  const [hotspotEnabled, setHotspotEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHotspotStatus = async () => {
      try {
        const status = await invoke<boolean>("get_hotspot_status");
        setHotspotEnabled(status);
      } catch (error) {
        console.error("Ошибка при получении статуса хот-спота:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotspotStatus();
  }, []);

  const toggleHotspot = async (enabled: boolean) => {
    try {
      const response = await invoke<string>(
        enabled ? "enable_hotspot" : "disable_hotspot"
      );
      alert(response);
      setHotspotEnabled(enabled);
    } catch (error) {
      console.error(
        `Ошибка при ${enabled ? "включении" : "отключении"} хот-спота:`,
        error
      );
      alert(`Не удалось изменить статус хот-спота: ${error}`);
    }
  };

  const settings: SettingItem[] = [
    {
      name: "Спящий режим",
      icon: <Moon className="w-5 h-5 text-white" />,
      action: async () => {
        try {
          const response = await invoke<string>("sleep_mode");
          alert(response);
        } catch (error) {
          console.error("Ошибка:", error);
        }
      },
    },
    {
      name: "Выключить",
      icon: <Power className="w-5 h-5 text-red-500" />,
      action: async () => {
        try {
          const response = await invoke<string>("shutdown");
          alert(response);
        } catch (error) {
          console.error("Ошибка:", error);
        }
      },
    },
  ];

  return (
    <div className="p-4 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
        <Settings className="w-5 h-5 mr-2 text-indigo-500" />
        Системные настройки
      </h3>

      {/* Переключатель Хот-спота */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-white">
          <Wifi className="w-5 h-5 mr-2" />
          <span>Включить Хот-спот</span>
        </div>
        {loading ? (
          <span className="text-sm text-gray-500">Загрузка...</span>
        ) : (
          <label
            htmlFor="hotspot-toggle"
            className="relative inline-flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              id="hotspot-toggle"
              className="sr-only peer"
              checked={hotspotEnabled}
              onChange={(e) => toggleHotspot(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer dark:peer-focus:ring-blue-800 peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-500">
              <div
                className={`w-4 h-4 bg-gray-300 rounded-full shadow transform transition-transform duration-200 ${
                  hotspotEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              ></div>
            </div>
          </label>
        )}
      </div>

      {/* Остальные настройки */}
      <ul>
        {settings.map((setting) => (
          <li
            key={setting.name}
            className="flex items-center mb-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            onClick={setting.action}
          >
            {setting.icon}
            <span className="ml-3 text-white">{setting.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
