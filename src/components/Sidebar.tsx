// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   Home,
//   Gamepad2,
//   Edit3,
//   ListChecks,
//   Sun,
//   Moon,
//   ChevronsLeft,
//   ChevronsRight,
//   Music,
//   UsersRound,
//   Github,
//   Linkedin,
//   Globe,
//   ChevronDown,
//   ChevronUp,
//   Settings,
// } from "lucide-react";
// import { invoke } from "@tauri-apps/api/core";

// interface SidebarProps {
//   isCollapsed: boolean;
//   toggleSidebar: () => void;
//   isDarkMode: boolean;
//   toggleTheme: () => void;
// }

// const navItems = [
//   { to: "/", label: "Главная", icon: <Home className="w-5 h-5" /> },
//   { to: "/notes", label: "Заметки", icon: <Edit3 className="w-5 h-5" /> },
//   {
//     to: "/kanban",
//     label: "Доска задач",
//     icon: <ListChecks className="w-5 h-5" />,
//   },
//   { to: "/games", label: "Игры", icon: <Gamepad2 className="w-5 h-5" /> },
//   { to: "/music", label: "Музыка", icon: <Music className="w-5 h-5" /> },
//   {
//     to: "/profiles",
//     label: "Профили",
//     icon: <UsersRound className="w-5 h-5" />,
//   },
//   {
//     to: "/settings",
//     label: "Настройки",
//     icon: <Settings className="w-5 h-5" />,
//   },
// ];

// export const Sidebar: React.FC<SidebarProps> = ({
//   isCollapsed,
//   toggleSidebar,
//   isDarkMode,
//   toggleTheme,
// }) => {
//   const appVersion = import.meta.env.VITE_APP_VERSION;
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const openInBrowser = async (url: string) => {
//     try {
//       await invoke("open_url", { url });
//       console.log(`URL открыт: ${url}`);
//     } catch (err) {
//       console.error("Ошибка при открытии URL:", err);
//       alert(`Не удалось открыть URL: ${err}`);
//     }
//   };

//   return (
//     <aside
//       className={`
//         flex flex-col
//         bg-white dark:bg-stone-800
//         backdrop-blur-xl
//         border-r border-white/10
//         shadow-lg
//         transition-all duration-300
//         ${isCollapsed ? "w-16" : "w-48"}
//         h-screen p-4
//       `}
//     >
//       <button
//         onClick={toggleSidebar}
//         className="bg-gray-200 dark:bg-stone-700 dark:hover:bg-stone-600 hover:bg-gray-300 transition rounded-xl p-2 text-black dark:text-white flex items-center justify-center mb-4"
//       >
//         {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
//       </button>

//       {!isCollapsed && (
//         <div className="mb-8 text-center">
//           <h2 className="text-2xl font-bold">
//             DashFlow{" "}
//             <span className="text-sm text-gray-500">v{appVersion}</span>
//           </h2>

//           {/* Кнопка-дропдаун */}
//           <button
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             className="mt-2 flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition"
//           >
//             by DoZhD1k{" "}
//             {isDropdownOpen ? (
//               <ChevronUp className="w-4 h-4" />
//             ) : (
//               <ChevronDown className="w-4 h-4" />
//             )}
//           </button>

//           {/* Дропдаун со ссылками */}
//           {isDropdownOpen && (
//             <div className="mt-2 flex flex-col items-center gap-2 bg-gray-200 dark:bg-stone-700 p-2 rounded-lg">
//               <button
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
//                 onClick={() => openInBrowser("https://github.com/DoZhD1k")}
//               >
//                 <Github className="w-4 h-4" /> GitHub
//               </button>
//               <button
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
//                 onClick={() =>
//                   openInBrowser(
//                     "https://www.linkedin.com/in/arlen-chereshnikov-967880256"
//                   )
//                 }
//               >
//                 <Linkedin className="w-4 h-4" /> LinkedIn
//               </button>
//               <button
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
//                 onClick={() => openInBrowser("https://arlenchereshnikov.com")}
//               >
//                 <Globe className="w-4 h-4" /> Portfolio
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       <nav className="flex flex-col gap-2">
//         {navItems.map((item) => (
//           <NavLink
//             key={item.to}
//             to={item.to}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-3 py-2 rounded-lg dark:hover:bg-stone-600 hover:bg-gray-300 transition text-black dark:text-white ${
//                 isActive ? "bg-gray-200 dark:bg-stone-700" : ""
//               } ${isCollapsed ? "justify-center" : ""}`
//             }
//           >
//             <span>{item.icon}</span>
//             {!isCollapsed && <span>{item.label}</span>}
//           </NavLink>
//         ))}
//       </nav>

//       <div className="mt-auto">
//         <button
//           onClick={toggleTheme}
//           className="bg-gray-200 dark:bg-stone-700 dark:hover:bg-stone-600 hover:bg-gray-300 transition rounded-xl p-2 w-full flex items-center justify-center text-black dark:text-white"
//         >
//           {isDarkMode ? (
//             <Sun className="w-5 h-5" />
//           ) : (
//             <Moon className="w-5 h-5" />
//           )}
//           {!isCollapsed && (
//             <span className="ml-2">
//               {isDarkMode ? "Светлая тема" : "Тёмная тема"}
//             </span>
//           )}
//         </button>
//       </div>
//     </aside>
//   );
// };

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Gamepad2,
  Edit3,
  ListChecks,
  Sun,
  Moon,
  ChevronsLeft,
  ChevronsRight,
  Music,
  UsersRound,
  Github,
  Linkedin,
  Globe,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

interface SidebarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isCollapsed: boolean; // ✅ Добавляем проп
  toggleSidebar: () => void; // ✅ Добавляем функцию переключения
}

const navItems = [
  { to: "/", label: "Главная", icon: <Home className="w-5 h-5" /> },
  { to: "/notes", label: "Заметки", icon: <Edit3 className="w-5 h-5" /> },
  {
    to: "/kanban",
    label: "Доска задач",
    icon: <ListChecks className="w-5 h-5" />,
  },
  { to: "/games", label: "Игры", icon: <Gamepad2 className="w-5 h-5" /> },
  { to: "/music", label: "Музыка", icon: <Music className="w-5 h-5" /> },
  {
    to: "/profiles",
    label: "Профили",
    icon: <UsersRound className="w-5 h-5" />,
  },
  {
    to: "/settings",
    label: "Настройки",
    icon: <Settings className="w-5 h-5" />,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isDarkMode,
  toggleTheme,
}) => {
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Загружаем состояние из `localStorage`
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  // Функция переключения состояния сайдбара
  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarCollapsed", newState.toString());
      return newState;
    });
  };

  const openInBrowser = async (url: string) => {
    try {
      await invoke("open_url", { url });
      console.log(`URL открыт: ${url}`);
    } catch (err) {
      console.error("Ошибка при открытии URL:", err);
      alert(`Не удалось открыть URL: ${err}`);
    }
  };

  return (
    <aside
      className={`flex flex-col
        bg-white dark:bg-stone-800
        backdrop-blur-xl
        border-r border-white/10 
        shadow-lg
        transition-all duration-300
        ${isCollapsed ? "w-16" : "w-48"}
        h-screen p-4`}
    >
      <button
        onClick={toggleSidebar}
        className="bg-gray-200 dark:bg-stone-700 dark:hover:bg-stone-600 hover:bg-gray-300 transition rounded-xl p-2 text-black dark:text-white flex items-center justify-center mb-4"
      >
        {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
      </button>

      {!isCollapsed && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold">
            DashFlow{" "}
            <span className="text-sm text-gray-500">v{appVersion}</span>
          </h2>

          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="mt-2 flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition"
          >
            by DoZhD1k{" "}
            {isDropdownOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {isDropdownOpen && (
            <div className="mt-2 flex flex-col items-center gap-2 bg-gray-200 dark:bg-stone-700 p-2 rounded-lg">
              <button
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                onClick={() => openInBrowser("https://github.com/DoZhD1k")}
              >
                <Github className="w-4 h-4" /> GitHub
              </button>
              <button
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                onClick={() =>
                  openInBrowser(
                    "https://www.linkedin.com/in/arlen-chereshnikov-967880256"
                  )
                }
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </button>
              <button
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                onClick={() => openInBrowser("https://arlenchereshnikov.com")}
              >
                <Globe className="w-4 h-4" /> Portfolio
              </button>
            </div>
          )}
        </div>
      )}

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg dark:hover:bg-stone-600 hover:bg-gray-300 transition text-black dark:text-white ${
                isActive ? "bg-gray-200 dark:bg-stone-700" : ""
              } ${isCollapsed ? "justify-center" : ""}`
            }
          >
            <span>{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={toggleTheme}
          className="bg-gray-200 dark:bg-stone-700 dark:hover:bg-stone-600 hover:bg-gray-300 transition rounded-xl p-2 w-full flex items-center justify-center text-black dark:text-white"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          {!isCollapsed && (
            <span className="ml-2">
              {isDarkMode ? "Светлая тема" : "Тёмная тема"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
