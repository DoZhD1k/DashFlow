import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Анимированный круг */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 w-full h-full animate-spin">
          <svg
            className="w-full h-full text-gray-300 dark:text-gray-600"
            viewBox="0 0 50 50"
          >
            <circle
              className="stroke-current opacity-30"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="5"
            />
            <circle
              className="stroke-current text-blue-500 dark:text-blue-400 animate-loader-stroke"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="5"
              strokeDasharray="100"
              strokeDashoffset="75"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Текст загрузки */}
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
        Загрузка...
      </p>

      {/* Добавляем кастомную анимацию */}
      <style>
        {`
          @keyframes loader-stroke {
            0% { stroke-dashoffset: 100; }
            50% { stroke-dashoffset: 50; }
            100% { stroke-dashoffset: 100; }
          }
          .animate-loader-stroke {
            animation: loader-stroke 1.5s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
