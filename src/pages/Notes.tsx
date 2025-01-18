import React from "react";

export const Notes: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Заметки</h1>
      <div
        className="
        bg-white/5 dark:bg-white/5
        backdrop-blur-xl
        border border-white/10
        rounded-2xl
        p-6
        shadow-lg
      "
      >
        <p className="opacity-80 mb-2">
          Тут будет текстовый редактор (Quill/TipTap/CKEditor)...
        </p>
        <textarea
          className="
            w-full h-40 
            bg-transparent
            outline-none
            border border-white/20
            rounded-xl
            p-2
          "
          placeholder="Пока обычный textarea..."
        />
      </div>
    </div>
  );
};
