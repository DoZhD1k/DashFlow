// components/notes/NoteView.tsx
import React from "react";
import { formatDate } from "../../utils/dateUtils";
import { Pencil, Trash } from "lucide-react";

interface Note {
  id: number;
  title: string;
  content: string; // Форматированный контент в HTML
  createdAt: string;
  updatedAt: string;
}

interface NoteViewProps {
  note: Note | null;
  onEdit: () => void;
  onDelete: () => void;
}

const NoteView: React.FC<NoteViewProps> = ({ note, onEdit, onDelete }) => {
  if (!note) {
    return (
      <div className="flex flex-col justify-center items-center text-center text-gray-500 p-6 dark:bg-stone-800 h-full rounded-lg shadow-md">
        <p className="text-2xl font-semibold">Выберите заметку для просмотра</p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg shadow-md p-6 flex flex-col h-full dark:bg-stone-800 overflow-hidden">
      {/* Заголовок и кнопки */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {note.title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition flex items-center gap-2"
          >
            <Pencil className="h-5 w-5" />
            Редактировать
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition flex items-center gap-2"
          >
            <Trash className="h-5 w-5" />
            Удалить
          </button>
        </div>
      </div>

      {/* Метаданные */}
      <div className="bg-gray-100 dark:bg-stone-800 p-2 rounded-lg mb-4 w-full max-w-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Создана: {formatDate(note.createdAt)} | Обновлена:{" "}
          {formatDate(note.updatedAt)}
        </p>
      </div>

      {/* Разделитель */}
      <hr className="border-gray-300 dark:border-gray-700 mb-4" />

      {/* Рендер форматированного текста */}
      <div
        className="p-4 bg-gray-50 dark:bg-stone-800 rounded-lg flex-1 overflow-y-auto whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200 custom-scrollbar"
        dangerouslySetInnerHTML={{ __html: note.content }}
      ></div>
    </div>
  );
};

export default NoteView;
