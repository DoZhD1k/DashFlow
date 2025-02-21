import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/DashboardLayout";
import { Home } from "./pages/Home";
import { Games } from "./pages/Games";
import Notes from "./pages/Notes";
import Music from "./pages/Music";
import { Profiles } from "./pages/Profiles";
import KanbanBoard from "./pages/KanbanBoard";
import { Settings } from "./pages/Settings";
import { invoke } from "@tauri-apps/api/core";

function App() {
  useEffect(() => {
    invoke("load_db").catch(console.error);
  }, []);
  // Загружаем тему из localStorage при первой загрузке
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Устанавливаем тему в <html> при изменении `isDarkMode`
  useEffect(() => {
    const htmlEl = document.documentElement;
    if (isDarkMode) {
      htmlEl.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      htmlEl.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <Layout
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/music" element={<Music />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
