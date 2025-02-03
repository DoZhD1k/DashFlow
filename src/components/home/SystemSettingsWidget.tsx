import React from "react";
import { Settings, Moon, Power, RefreshCw, Lock } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

interface SettingItem {
  name: string;
  icon: JSX.Element;
  action: () => void;
}

export const SystemSettingsWidget: React.FC = () => {
  const settings: SettingItem[] = [
    {
      name: "Блокировка экрана",
      icon: <Lock className="w-5 h-5" />,
      action: async () => {
        try {
          const response = await invoke<string>("lock");
          alert(response);
        } catch (error) {
          console.error("Ошибка блокировки экрана:", error);
        }
      },
    },
    {
      name: "Спящий режим",
      icon: <Moon className="w-5 h-5" />,
      action: async () => {
        try {
          const response = await invoke<string>("sleep_mode");
          console.log(response);
        } catch (error) {
          console.error("Ошибка перехода в спящий режим:", error);
        }
      },
    },
    {
      name: "Перезагрузить",
      icon: <RefreshCw className="w-5 h-5" />,
      action: async () => {
        const confirmRestart = window.confirm(
          "Вы действительно хотите перезагрузить компьютер?"
        );
        if (confirmRestart) {
          try {
            const response = await invoke<string>("restart");
            alert(response);
          } catch (error) {
            console.error("Ошибка перезагрузки:", error);
          }
        }
      },
    },
    {
      name: "Выключить",
      icon: <Power className="w-5 h-5 text-red-500" />,
      action: async () => {
        const confirmShutdown = window.confirm(
          "Вы действительно хотите выключить компьютер?"
        );
        if (confirmShutdown) {
          try {
            const response = await invoke<string>("shutdown");
            alert(response);
          } catch (error) {
            console.error("Ошибка при выключении системы:", error);
          }
        }
      },
    },
  ];

  return (
    <div className="p-4 bg-white dark:bg-stone-800 rounded-lg shadow-lg transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2 text-indigo-500" />
        Системные Настройки
      </h3>
      <ul>
        {settings.map((setting) => (
          <li
            key={setting.name}
            className="flex items-center mb-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            onClick={setting.action}
          >
            {setting.icon}
            <span className="ml-3">{setting.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
