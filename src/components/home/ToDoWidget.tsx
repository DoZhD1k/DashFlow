// src/components/ToDoWidget.tsx
import React, { useState } from "react";
import { Check, Trash2, Plus } from "lucide-react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const ToDoWidget: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: newTask.trim(), completed: false },
    ]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="p-4 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-md transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-3 flex items-center text-white">
        <Plus className="w-5 h-5 mr-2 text-blue-500" />
        Список Задач
      </h3>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow p-2 rounded-l-md border border-gray-300 dark:border-gray-600  bg-gray-900 text-gray-100 focus:ring focus:ring-blue-500 outline-none"
          placeholder="Добавить новую задачу"
        />
        <button
          onClick={addTask}
          className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between mb-2 p-3 bg-gray-50 dark:bg-gray-900 rounded shadow-sm"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="mr-3 w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring focus:ring-blue-500"
              />
              <span
                className={`text-gray-800 dark:text-gray-100 ${
                  task.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {task.text}
              </span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoWidget;
