import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Calendar as CalendarIcon } from "lucide-react";
import { Trash, CalendarPlus } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
}

const CalendarWidget: React.FC = () => {
  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const monthOfYear = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(
    currentDate.toISOString().split("T")[0]
  );
  const [events, setEvents] = useState<Event[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const rawFirstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const firstDayOfMonth = rawFirstDayOfMonth === 0 ? 6 : rawFirstDayOfMonth - 1;

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) =>
      currentMonth === 0 ? prevYear - 1 : prevYear
    );
  };

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) =>
      currentMonth === 11 ? prevYear + 1 : prevYear
    );
  };

  // Получение событий для выбранной даты
  const fetchEventsByDate = async (date: string) => {
    try {
      const fetchedEvents = await invoke<Event[]>(
        "get_events_by_date_command",
        {
          date,
        }
      );
      console.log(`События для даты ${date}:`, fetchedEvents); // Лог для проверки
      setEvents(fetchedEvents); // Заменяем текущие события
    } catch (err) {
      console.error("Ошибка получения событий:", err);
    }
  };

  // Добавление нового события
  const addEvent = async () => {
    if (!newEventTitle.trim()) {
      alert("Введите название события!");
      return;
    }
    try {
      await invoke("add_event_command", {
        date: selectedDate,
        title: newEventTitle,
        description: newEventDescription,
      });
      setNewEventTitle(""); // Очистка полей
      setNewEventDescription("");
      setIsModalOpen(false);
      fetchEventsByDate(selectedDate);
      console.log("Добавляем событие:", {
        date: selectedDate,
        title: newEventTitle,
        description: newEventDescription,
      }); // Перезагрузка событий
    } catch (err) {
      console.error("Ошибка добавления события:", err);
    }
  };

  // Удаление события
  const deleteEvent = async (id: number) => {
    console.log("Удаляем событие с id:", id); // Логируем id
    try {
      await invoke("delete_event_command", { id });
      fetchEventsByDate(selectedDate);
    } catch (err) {
      console.error("Ошибка удаления события:", err);
    }
  };

  // Получение событий при изменении выбранной даты
  useEffect(() => {
    fetchEventsByDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    console.log("Текущие события:", events);
  }, [events]);

  return (
    <div className="w-full min-h-96 bg-white dark:bg-stone-800 rounded-xl p-4 flex flex-col items-center">
      {/* Навигация по месяцам */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-light dark:text-gray-300 items-center">
            {monthOfYear[currentMonth]},
          </h2>
          <h2 className="text-lg font-light dark:text-gray-300">
            {currentYear}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center bg-stone-700 rounded-full text-purple-400 hover:bg-stone-600"
          >
            &lt;
          </button>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center bg-stone-700 rounded-full text-purple-400 hover:bg-stone-600"
          >
            &gt;
          </button>
        </div>
      </div>
      {/* Дни недели */}
      <div className="w-full flex justify-between mb-3">
        {daysOfWeek.map((day, index) => (
          <span
            key={`day-${index}`}
            className="flex justify-center text-gray-500 uppercase text-xs font-medium w-full"
          >
            {day}
          </span>
        ))}
      </div>
      {/* Дни месяца */}
      <div className="grid grid-cols-7 gap-1 w-full">
        {[...Array(firstDayOfMonth).keys()].map((_, index) => (
          <div key={`empty-${index}`} className="w-full"></div>
        ))}
        {[...Array(daysInMonth).keys()].map((day) => (
          <div
            key={`day-${day + 1}`}
            onClick={() =>
              setSelectedDate(
                `${currentYear}-${String(currentMonth + 1).padStart(
                  2,
                  "0"
                )}-${String(day + 1).padStart(2, "0")}`
              )
            }
            className={`w-full flex items-center justify-center cursor-pointer text-sm dark:text-gray-300 ${
              day + 1 === parseInt(selectedDate.split("-")[2]) &&
              currentMonth === parseInt(selectedDate.split("-")[1]) - 1 &&
              currentYear === parseInt(selectedDate.split("-")[0])
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-full"
                : "hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full"
            }`}
          >
            {day + 1}
          </div>
        ))}
      </div>
      {/* События */}
      <div className="mt-4 w-full">
        {/* Заголовок и кнопка */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold dark:text-gray-300">
            События на {selectedDate}
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            title="Добавить событие"
            className=" py-2 px-4 rounded-md"
          >
            <CalendarPlus className="w-7 h-7 text-purple-400 hover:text-purple-500" />
          </button>
        </div>
        {/* Список событий */}
        <div className="max-h-44 overflow-y-auto custom-scrollbar">
          {events.length > 0 ? (
            <ul className="space-y-2 m-2">
              {events.map((event) => (
                <li
                  key={`event-${event.id}`}
                  className="p-2 dark:bg-stone-900 dark:hover:bg-stone-700  rounded-lg shadow-sm text-gray-700 dark:text-gray-200 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold">{event.title}</h4>
                    <p className="text-sm">{event.description}</p>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    title="Удалить событие"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="w-6 h-6" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">На эту дату событий нет.</p>
          )}
        </div>
      </div>

      {/* Добавить событие */}

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-stone-700 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              Новое событие
            </h3>
            <input
              type="text"
              placeholder="Название события"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="border border-gray-300 rounded w-full p-2 mt-1 bg-transparent my-2"
            />
            <textarea
              placeholder="Описание события"
              value={newEventDescription}
              onChange={(e) => setNewEventDescription(e.target.value)}
              className="border border-gray-300 rounded w-full p-2 mt-1 bg-transparent my-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-700"
              >
                Отмена
              </button>
              <button
                onClick={addEvent}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;
