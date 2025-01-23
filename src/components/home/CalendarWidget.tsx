import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

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
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Корректировка первого дня недели для понедельника
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

  return (
    <div className="w-full bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 flex flex-col items-center">
      {/* Навигация по месяцам */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-light text-gray-300 items-center">
            {monthOfYear[currentMonth]},
          </h2>
          <h2 className="text-lg font-light text-gray-300">{currentYear}</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-purple-400 hover:bg-gray-600"
          >
            &lt;
          </button>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-purple-400 hover:bg-gray-600"
          >
            &gt;
          </button>
        </div>
      </div>
      {/* Дни недели */}
      <div className="w-full flex justify-between mb-3">
        {daysOfWeek.map((day) => (
          <span
            key={day}
            className="flex justify-center text-gray-500 uppercase text-xs font-medium w-full"
          >
            {day}
          </span>
        ))}
      </div>
      {/* Дни месяца */}
      <div className="grid grid-cols-7 gap-1 w-full">
        {/* Пустые ячейки перед первым днем месяца */}
        {[...Array(firstDayOfMonth).keys()].map((_, index) => (
          <div key={`empty-${index}`} className="w-full"></div>
        ))}
        {/* Дни месяца */}
        {[...Array(daysInMonth).keys()].map((day) => (
          <div
            key={day + 1}
            className={`w-full flex items-center justify-center cursor-pointer text-sm text-gray-300 ${
              day + 1 === currentDate.getDate() &&
              currentMonth === currentDate.getMonth() &&
              currentYear === currentDate.getFullYear()
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-full"
                : "hover:bg-gray-700 rounded-full"
            }`}
          >
            {day + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;
