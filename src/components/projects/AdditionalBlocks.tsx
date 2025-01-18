import React from "react";
import { ExternalLink } from "lucide-react";

export const AdditionalBlocks: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="dashboard-card">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Открыть в браузере
        </h2>
        <p className="text-sm mb-2">
          Если проект — это веб-приложение, можно запускать локальный сервер и
          открывать URL.
        </p>
        <button
          className="bg-purple-600 hover:bg-purple-500 transition text-white px-3 py-2 rounded-md text-sm"
          onClick={() => {
            console.log("Нажата кнопка: Открыть localhost:3000");
            alert("Открываем http://localhost:3000");
          }}
        >
          Открыть http://localhost:3000
        </button>
      </div>

      <div className="dashboard-card">
        <h2 className="text-xl font-semibold mb-3">Что-то ещё</h2>
        <p className="text-sm">
          Тут можно разместить любые дополнительные инструменты, статистику
          коммитов, ссылки на CI/CD и т.д.
        </p>
      </div>
    </div>
  );
};
