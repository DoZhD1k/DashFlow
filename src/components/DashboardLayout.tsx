import React from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  isDarkMode,
  toggleTheme,
  isSidebarCollapsed,
  toggleSidebar,
}) => {
  return (
    <div className="flex min-h-screen w-screen">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};
