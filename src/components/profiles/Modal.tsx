import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  name: string;
  setName: (value: string) => void;
  login: string;
  setLogin: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  name,
  setName,
  login,
  setLogin,
  password,
  setPassword,
  note,
  setNote,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-70 z-50">
      <div className="bg-white dark:bg-stone-700 p-6 rounded-lg shadow-2xl w-96">
        <h2 className="text-2xl font-semibold mb-6">
          Изменить/Добавить профиль
        </h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Название платформы
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите название платформы..."
            className="border border-gray-300 rounded w-full p-2 mt-1 bg-transparent"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Логин
          </label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите ваш логин..."
            className="border border-gray-300 rounded w-full p-2 mt-1 bg-transparent"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Пароль
          </label>
          <input
            type="password"
            value={password}
            placeholder="Введите ваш пароль..."
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded w-full p-2 mt-1 bg-transparent"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Доп. информация (необязательно)
          </label>
          <textarea
            title="Дополнительная информация (необязательно)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border border-gray-300 rounded w-full p-2 mt-1 bg-transparent"
            rows={3}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-gray-300 rounded-md hover:bg-gray-500 transition"
          >
            Отмена
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
