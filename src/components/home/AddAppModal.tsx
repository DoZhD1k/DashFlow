import React, { useState } from "react";

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (app: { name: string; path: string }) => void;
}

const AddAppModal: React.FC<AddAppModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");

  const sanitizeInput = (input: string) => input.replace(/["'`]/g, "");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
      <div className="bg-white dark:bg-stone-700 p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4">Добавить приложение</h3>
        <input
          type="text"
          placeholder="Название"
          value={name}
          onChange={(e) => setName(sanitizeInput(e.target.value))}
          className="border border-gray-300 rounded w-full p-2 mt-4 bg-transparent"
        />
        <input
          type="text"
          placeholder="Путь к приложению"
          value={path}
          onChange={(e) => setPath(sanitizeInput(e.target.value))}
          className="border border-gray-300 rounded w-full p-2 mt-4 bg-transparent"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-md mt-4"
          >
            Отмена
          </button>
          <button
            onClick={() =>
              onAdd({ name: sanitizeInput(name), path: sanitizeInput(path) })
            }
            className="px-4 py-2 bg-blue-500 rounded-md mt-4"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAppModal;
