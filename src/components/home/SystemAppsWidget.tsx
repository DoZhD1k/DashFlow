import React from "react";
import { Settings, Cpu, Sliders, Folder } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

interface SettingItem {
  name: string;
  icon: JSX.Element;
  action: () => void;
}

export const SystemAppsWidget: React.FC = () => {
  const settings: SettingItem[] = [
    {
      name: "Диспетчер задач",
      icon: <Cpu className="w-5 h-5" />,
      action: async () => {
        try {
          const response = await invoke<string>("open_task_manager");
          alert(response);
        } catch (error) {
          console.error("Ошибка открытия диспетчера задач:", error);
        }
      },
    },
    {
      name: "Настройки Windows",
      icon: <Sliders className="w-5 h-5" />,
      action: async () => {
        try {
          const response = await invoke<string>("open_settings");
          alert(response);
        } catch (error) {
          console.error("Ошибка открытия настроек Windows:", error);
        }
      },
    },
    {
      name: "Проводник",
      icon: <Folder className="w-5 h-5" />,
      action: async () => {
        try {
          const response = await invoke<string>("open_explorer");
          alert(response);
        } catch (error) {
          console.error("Ошибка открытия проводника:", error);
        }
      },
    },
  ];

  return (
    <div className="p-4 bg-white dark:bg-stone-800 rounded-lg shadow-lg transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2 text-indigo-500" />
        Системные Приложения
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
