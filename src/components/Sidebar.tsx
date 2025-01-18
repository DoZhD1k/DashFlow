import React from "react";
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
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const navItems = [
  { to: "/", label: "Главная", icon: <Home className="w-5 h-5" /> },
  { to: "/games", label: "Игры", icon: <Gamepad2 className="w-5 h-5" /> },
  { to: "/notes", label: "Заметки", icon: <Edit3 className="w-5 h-5" /> },
  {
    to: "/projects",
    label: "Проекты",
    icon: <ListChecks className="w-5 h-5" />,
  },
  { to: "/music", label: "Музыка", icon: <Music className="w-5 h-5" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  isDarkMode,
  toggleTheme,
}) => {
  return (
    <aside
      className={`
        flex flex-col
        bg-white/5
        dark:bg-white/5
        backdrop-blur-xl
        border-r border-white/10 
        shadow-lg
        transition-all duration-300
        ${isCollapsed ? "w-16" : "w-46"}
        h-screen
        p-4
      `}
    >
      {/* Кнопка сворачивания/разворачивания */}
      <button
        onClick={toggleSidebar}
        className="
          bg-white/10
          hover:bg-white/20
          transition
          rounded-xl
          p-2
          text-black dark:text-white
          flex
          items-center
          justify-center
          mb-4
        "
      >
        {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
      </button>

      {/* Заголовок (виден, если не свёрнуто) */}
      {!isCollapsed && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </div>
      )}

      {/* Навигация */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `
                flex items-center gap-3
                px-3 py-2
                rounded-lg
                hover:bg-white/20
                transition
                text-black dark:text-white
                ${isActive ? "bg-white/20" : ""}
                ${isCollapsed ? "justify-center" : ""}
              `
            }
          >
            <span>{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Кнопка переключения темы (внизу) */}
      <div className="mt-auto">
        <button
          onClick={toggleTheme}
          className="
            bg-white/10
            hover:bg-white/20
            transition
            rounded-xl
            p-2
            w-full
            flex items-center
            justify-center
            text-black dark:text-white
          "
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
