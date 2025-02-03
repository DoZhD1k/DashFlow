import React, { useState } from "react";
import { formatDate } from "../../utils/dateUtils";
import { Plus, Trash } from "lucide-react";

interface Note {
  id: number;
  title: string;
  content: any;
  createdAt: string;
  updatedAt: string;
}

interface NoteListProps {
  notes: Note[];
  selectedNoteId: number | null;
  setSelectedNoteId: (id: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
  onUpdateTitle: (id: number, newTitle: string) => void; // Функция обновления названия
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  selectedNoteId,
  setSelectedNoteId,
  searchQuery,
  setSearchQuery,
  onAdd,
  onDelete,
  onUpdateTitle,
}) => {
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null); // ID редактируемой заметки
  const [newTitle, setNewTitle] = useState<string>(""); // Новое название

  const handleTitleChange = (id: number) => {
    if (newTitle.trim() !== "") {
      onUpdateTitle(id, newTitle); // Сохраняем новое название
    }
    setEditingNoteId(null); // Завершаем редактирование
    setNewTitle(""); // Сбрасываем временное значение
  };

  return (
    <div className="w-full lg:w-1/3 rounded-lg shadow-md p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Поиск заметок..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-xl p-2 pl-4 pr-10 bg-transparent border-b border-gray-300 dark:text-white text-gray-900 focus:outline-none placeholder-gray-400"
        />
        <button
          onClick={onAdd}
          title="Добавить Заметку"
          className="p-2 text-green-500  rounded-full ml-2"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`p-4 mb-2 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 hover:dark:bg-white/15 ${
              selectedNoteId === note.id
                ? "bg-blue-200 dark:bg-white/10"
                : "bg-white dark:bg-stone-800"
            }`}
            onClick={() => setSelectedNoteId(note.id)}
          >
            <div className="flex justify-between items-center">
              {editingNoteId === note.id ? (
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => handleTitleChange(note.id)}
                  placeholder="Название"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTitleChange(note.id);
                  }}
                  className="p-1 border rounded-md w-full"
                  autoFocus
                />
              ) : (
                <h4
                  onDoubleClick={() => {
                    setEditingNoteId(note.id);
                    setNewTitle(note.title);
                  }}
                  className="cursor-pointer"
                >
                  {note.title}
                </h4>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Остановить клик, чтобы не выбрать заметку
                  onDelete(note.id);
                }}
                title="Удалить заметку"
              >
                <Trash className="h-5 w-5 text-red-500" />
              </button>
            </div>
            <p className="text-sm text-gray-500">
              {formatDate(note.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteList;
