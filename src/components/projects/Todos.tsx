import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Plus } from "lucide-react";

type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Загружаем задачи при монтировании компонента
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const result = await invoke<Todo[]>("get_todos");
      setTodos(result);
    } catch (err) {
      console.error("Ошибка загрузки задач:", err);
    }
  };

  const addTodo = async () => {
    try {
      await invoke("add_todo", {
        title: newTitle,
        description: newDescription,
      });
      setNewTitle("");
      setNewDescription("");
      setShowModal(false); // Закрываем модальное окно
      loadTodos(); // Обновляем список задач
    } catch (err) {
      console.error("Ошибка добавления задачи:", err);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      await invoke("update_todo", { id, completed: !completed });
      loadTodos();
    } catch (err) {
      console.error("Ошибка обновления задачи:", err);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await invoke("delete_todo", { id });
      loadTodos();
    } catch (err) {
      console.error("Ошибка удаления задачи:", err);
    }
  };

  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">To-Do Задачи</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-500 transition text-white px-3 py-1 rounded-md"
        >
          <Plus className="w-5 h-5" />
          Добавить задачу
        </button>
      </div>

      <ul className="list-disc list-inside text-sm">
        {todos.map((todo) => (
          <li key={todo.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
              />
              <span className={todo.completed ? "line-through" : ""}>
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-600 hover:underline ml-auto"
              >
                Удалить
              </button>
            </div>
            <p className="text-xs text-gray-500">{todo.description}</p>
          </li>
        ))}
      </ul>

      {/* Модальное окно для добавления задачи */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Оверлей */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white dark:bg-[#1a1a1a] text-black dark:text-white rounded-xl p-6 w-full max-w-md shadow-lg z-10">
            <h2 className="text-xl font-bold mb-4">Добавить задачу</h2>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Название задачи"
                className="bg-white/10 dark:bg-white/10 rounded-md px-3 py-2 text-sm outline-none border border-white/20"
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Описание задачи"
                className="bg-white/10 dark:bg-white/10 rounded-md px-3 py-2 text-sm outline-none border border-white/20 h-20"
              />
              <div className="flex gap-3 mt-4 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-400 text-white rounded-md transition"
                >
                  Отмена
                </button>
                <button
                  onClick={addTodo}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md transition"
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
