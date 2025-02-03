import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Columns,
  Rows,
  Table,
  Trash2,
  Merge,
  Split,
} from "lucide-react";
import { Editor as TiptapEditor } from "@tiptap/react";

interface TableToolsProps {
  editor: TiptapEditor | null;
}

const TableTools: React.FC<TableToolsProps> = ({ editor }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!editor) return null;

  const insertTable = () => {
    const rows = 2;
    const cols = 2;
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .insertContent("<p></p>")
      .run();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-center w-10 h-8 rounded-md hover:bg-gray-100 transition dark:text-white"
        title="Таблица"
      >
        <Table className="w-4 h-4" />
        {isDropdownOpen ? (
          <ChevronUp className="w-4 h-4 ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        )}
      </button>
      {isDropdownOpen && (
        <div className="absolute z-10 top-10 left-0 bg-white dark:bg-stone-700 shadow-md rounded-md border border-gray-300 dark:border-stone-600 p-2 w-48">
          {/* Таблицы */}
          <div className="mb-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Таблица
            </p>
            <button
              onClick={insertTable}
              className="flex items-center w-full py-1 rounded-md hover:bg-gray-100 dark:hover:bg-stone-600 transition"
              title="Вставить таблицу"
            >
              <Table className="w-4 h-4 mr-2" />
              Вставить таблицу
            </button>
          </div>
          {/* Столбцы */}
          <div className="mb-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Столбцы
            </p>
            <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="flex items-center w-full py-1 rounded-md hover:bg-gray-100 dark:hover:bg-stone-600 transition"
              title="Добавить столбец"
            >
              <Columns className="w-4 h-4 mr-2" />
              Добавить столбец
            </button>
            <button
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="flex items-center w-full py-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-300 rounded transition"
              title="Удалить столбец"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить столбец
            </button>
          </div>
          {/* Строки */}
          <div className="mb-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Строки
            </p>
            <button
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="flex items-center w-full py-1 rounded-md hover:bg-gray-100 dark:hover:bg-stone-600 transition"
              title="Добавить строку"
            >
              <Rows className="w-4 h-4 mr-2" />
              Добавить строку
            </button>
            <button
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="flex items-center w-full py-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-300 rounded transition"
              title="Удалить строку"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить строку
            </button>
          </div>
          {/* Ячейки */}
          <div className="mb-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Ячейки
            </p>
            <button
              onClick={() => editor.chain().focus().mergeCells().run()}
              className="flex items-center w-full  py-1 rounded-md hover:bg-gray-100 dark:hover:bg-stone-600 transition"
              title="Объединить ячейки"
            >
              <Merge className="w-4 h-4 mr-2" />
              Объединить ячейки
            </button>
            <button
              onClick={() => editor.chain().focus().splitCell().run()}
              className="flex items-center w-full py-1 rounded-md hover:bg-gray-100 dark:hover:bg-stone-600 transition"
              title="Разделить ячейки"
            >
              <Split className="w-4 h-4 mr-2" />
              Разделить ячейки
            </button>
          </div>
          {/* Дополнительное */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Дополнительно
            </p>
            <button
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="flex items-center w-full py-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-300 rounded transition"
              title="Удалить таблицу"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить таблицу
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableTools;
