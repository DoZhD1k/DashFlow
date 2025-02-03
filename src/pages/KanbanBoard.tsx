import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Edit, Trash2 } from "lucide-react";
import Loader from "../components/Loader";

// ОПРЕДЕЛЯЕМ ТИП ЗАДАЧИ
interface Task {
  id: number;
  title: string;
  description?: string;
  date?: string;
  col: string;
}

// ТИП КОЛОНКИ
interface Column {
  colId: string;
  name: string;
  items: Task[];
}

// ИСХОДНЫЕ ТРИ КОЛОНКИ (без задач)
const initialColumns: Column[] = [
  { colId: "todo", name: "Надо Сделать", items: [] },
  { colId: "inProgress", name: "В Процессе", items: [] },
  { colId: "done", name: "Завершено", items: [] },
];

export default function KanbanBoard() {
  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const [modalDate, setModalDate] = useState("");
  const [targetColId, setTargetColId] = useState("todo");
  const [editTaskId, setEditTaskId] = useState<number | null>(null);

  // При первом рендере загружаем задачи с бэка
  useEffect(() => {
    fetchAllTasks();
  }, []);

  /**
   * Загружаем все задачи и раскладываем по колонкам
   */
  async function fetchAllTasks() {
    try {
      const rawTasks = (await invoke("kanban_list_tasks_command")) as any[]; // Получаем "сырые" данные
      console.log("Загруженные задачи:", rawTasks);

      // Преобразуем массив в объекты
      const tasks: Task[] = rawTasks.map((t) => ({
        id: t[0], // id
        title: t[1], // title
        description: t[2], // description
        date: t[3], // date
        col: t[4], // col
      }));

      // Раскладываем задачи по колонкам
      const newColumns = initialColumns.map((col) => {
        const filtered = tasks.filter((t) => t.col === col.colId);
        return { ...col, items: filtered };
      });

      setColumns(newColumns); // Обновляем состояние
    } catch (err) {
      console.error("Failed to load tasks from backend:", err);
    }
  }

  /**
   * Обработчик Drag & Drop
   */
  async function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!destination) return; // за пределы
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; // тот же индекс, ничего не делаем
    }

    // Нахоdим исходную и конечную колонку
    const sourceColIndex = columns.findIndex(
      (c) => c.colId === source.droppableId
    );
    const destColIndex = columns.findIndex(
      (c) => c.colId === destination.droppableId
    );
    if (sourceColIndex < 0 || destColIndex < 0) return;

    const sourceCol = columns[sourceColIndex];
    const destCol = columns[destColIndex];
    const sourceItems = [...sourceCol.items];
    const [movedTask] = sourceItems.splice(source.index, 1);

    if (sourceCol === destCol) {
      // Перенос внутри одной колонки
      sourceItems.splice(destination.index, 0, movedTask);
      const updatedCol: Column = { ...sourceCol, items: sourceItems };
      const newCols = [...columns];
      newCols[sourceColIndex] = updatedCol;
      setColumns(newCols);
      // Если вы хотите сохранять порядок в БД, нужно использовать sort_order
      // и обновлять в таблице. Но в минимальном примере можно пропустить.
    } else {
      // Перенос между колонками
      const destItems = [...destCol.items];
      destItems.splice(destination.index, 0, movedTask);
      movedTask.col = destCol.colId; // изменяем локально колонку

      const newSourceCol: Column = { ...sourceCol, items: sourceItems };
      const newDestCol: Column = { ...destCol, items: destItems };
      const newCols = [...columns];
      newCols[sourceColIndex] = newSourceCol;
      newCols[destColIndex] = newDestCol;
      setColumns(newCols);

      // Обновляем поле col в БД
      try {
        await invoke("kanban_update_task_command", {
          id: movedTask.id,
          title: movedTask.title,
          description: movedTask.description ?? "",
          date: movedTask.date ?? null,
          col: movedTask.col, // новое значение
        });
      } catch (err) {
        console.error("Failed to update col:", err);
      }
    }
  }

  /**
   * Открыть модалку для добавления задачи в colId
   */
  function handleOpenAddModal() {
    setIsModalOpen(true);
    setEditTaskId(null);
    setTargetColId("todo");
    setModalTitle("");
    setModalDesc("");
    setModalDate("");
  }

  /**
   * Открыть модалку для редактирования существующей задачи
   */
  function handleOpenEditModal(colId: string, task: Task) {
    setIsModalOpen(true);
    setEditTaskId(task.id);
    setTargetColId(colId);
    setModalTitle(task.title);
    setModalDesc(task.description ?? "");
    setModalDate(task.date ?? "");
  }

  /**
   * Удалить задачу
   */
  async function handleDeleteTask(colId: string, taskId: number) {
    try {
      await invoke("kanban_delete_task_command", { id: taskId });
      // Удаляем локально
      setColumns((prev) =>
        prev.map((col) => {
          if (col.colId === colId) {
            const filteredItems = col.items.filter((t) => t.id !== taskId);
            return { ...col, items: filteredItems };
          }
          return col;
        })
      );
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }

  /**
   * Сохранение задачи (добавление / редактирование)
   */
  async function handleSaveTask() {
    try {
      if (editTaskId) {
        // Редактируем задачу
        await invoke("kanban_update_task_command", {
          id: editTaskId,
          title: modalTitle,
          description: modalDesc,
          date: modalDate || null,
          col: targetColId,
        });
      } else {
        // Добавляем задачу
        await invoke("kanban_add_task_command", {
          title: modalTitle,
          description: modalDesc,
          date: modalDate || null,
          col: targetColId,
        });
      }

      // Закрываем модалку
      setIsModalOpen(false);
      setEditTaskId(null);
      setModalTitle("");
      setModalDesc("");
      setModalDate("");

      // Перезагружаем задачи с бэкенда
      await fetchAllTasks();
    } catch (err) {
      console.error("Failed to save task:", err);
    }
  }

  useEffect(() => {
    // Симуляция загрузки данных
    setTimeout(() => {
      setIsLoading(false);
    }); // Можно убрать задержку, если не нужна
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-stone-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen p-4 flex flex-col items-center gap-4 dark:bg-stone-900 overflow-y-auto custom-scrollbar">
      <h1 className="text-2xl font-bold">Kanban Board</h1>

      {/* Кнопка для добавления задачи */}
      <button
        onClick={handleOpenAddModal}
        title="Добавить задачу"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        + Добавить задачу
      </button>

      {/* DragDropContext — для DnD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-7xl">
          {columns.map((col) => (
            <div key={col.colId} className=" rounded p-4 flex flex-col">
              {/* Заголовок и кнопка Add */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-lg">{col.name}</h2>
              </div>

              {/* Droppable для задач */}
              <Droppable droppableId={col.colId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[100px] p-2 rounded transition-colors ${
                      snapshot.isDraggingOver
                        ? "bg-blue-50 dark:bg-stone-700"
                        : "bg-gray-50 dark:bg-stone-800"
                    }`}
                  >
                    {col.items.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={String(task.id)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-2 p-2 rounded border bg-white dark:bg-stone-700 shadow flex flex-col ${
                              snapshot.isDragging ? "opacity-75" : ""
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">
                                {task.title}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditModal(col.colId, task);
                                  }}
                                  title="Изменить"
                                  className="p-1 text-gray-600 dark:text-gray-900 hover:text-gray-900 dark:hover:text-gray-400"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTask(col.colId, task.id);
                                  }}
                                  title="Удалить"
                                  className="p-1 text-gray-600 dark:text-gray-900 hover:text-red-600 dark:hover:text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {task.date && (
                              <div className="text-sm text-gray-500 dark:text-gray-300">
                                Дата: {task.date}
                              </div>
                            )}

                            {task.description && (
                              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300 truncate max-w-full">
                                {task.description}
                              </p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Модалка */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-stone-700 rounded p-6 shadow-lg w-[90%] max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">
              {editTaskId ? "Редактировать задачу" : "Новая задача"}
            </h2>

            <label className="block mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ">
                Название:
              </span>
              <input
                type="text"
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
                className="border border-gray-300 rounded w-full p-2 mt-1 bg-transparent"
                placeholder="Введите заголовок"
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Описание:
              </span>
              <textarea
                value={modalDesc}
                onChange={(e) => setModalDesc(e.target.value)}
                className="border border-gray-300 rounded w-full p-2 mt-1 bg-transparent"
                placeholder="Подробнее о задаче..."
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Дата (deadline):
              </span>
              <input
                type="date"
                value={modalDate}
                onChange={(e) => setModalDate(e.target.value)}
                className="border border-gray-300 rounded w-full p-2 mt-1 bg-transparent"
              />
            </label>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2 hover:bg-gray-300"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveTask}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
