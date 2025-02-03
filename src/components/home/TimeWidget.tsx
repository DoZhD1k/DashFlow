import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const TimeWidget: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [isDay, setIsDay] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      setIsDay(now.getHours() >= 6 && now.getHours() < 18);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Получаем углы для стрелок
  const secondsAngle = (time.getSeconds() / 60) * 360;
  const minutesAngle = (time.getMinutes() / 60) * 360;
  const hoursAngle = ((time.getHours() % 12) / 12) * 360;

  return (
    <div
      className="relative flex flex-col items-center justify-center bg-white dark:bg-stone-800 p-6 rounded-lg shadow-lg transition-all duration-500 ease-in-out 
      dark:shadow-[0px_0px_20px_rgba(255,255,255,0.2)]"
    >
      {/* Анимированные стрелки часов */}
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 100 100"
      >
        {/* Часовая стрелка */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="30"
          stroke="gray"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${hoursAngle} 50 50)`}
          className="transition-transform duration-500 ease-in-out"
        />
        {/* Минутная стрелка */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="20"
          stroke="gray"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${minutesAngle} 50 50)`}
          className="transition-transform duration-500 ease-in-out"
        />
        {/* Секундная стрелка */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="15"
          stroke="red"
          strokeWidth="1"
          strokeLinecap="round"
          transform={`rotate(${secondsAngle} 50 50)`}
          className="transition-transform duration-300 ease-in-out"
        />
      </svg>

      {/* Текущее время */}

      {/* Иконка дня или ночи */}
      <div className="absolute flex bottom-3 justify-start items-center text-center w-full gap-10 px-16">
        <div className="text-4xl font-bold text-black dark:text-white transition-all duration-500 ease-in-out">
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        {isDay ? (
          <Sun className="w-8 h-8 text-yellow-400 animate-pulse" />
        ) : (
          <Moon className="w-8 h-8 text-blue-400 animate-fadeIn" />
        )}{" "}
      </div>
    </div>
  );
};

export default TimeWidget;
