import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/DashboardLayout";
import { Home } from "./pages/Home";
import { Games } from "./pages/Games";
import Notes from "./pages/Notes";
import Music from "./pages/Music";
import { Profiles } from "./pages/Profiles";
import KanbanBoard from "./pages/KanbanBoard";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // При переключении темы меняем класс "dark" на <html>
  useEffect(() => {
    const htmlEl = document.documentElement;
    if (isDarkMode) {
      htmlEl.classList.add("dark");
    } else {
      htmlEl.classList.remove("dark");
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
        {/* <PlayerProvider> */}
        {/* <ScreenRecordingProvider> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/music" element={<Music />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/kanban" element={<KanbanBoard />} />
        </Routes>
        {/* </ScreenRecordingProvider> */}
        {/* </PlayerProvider> */}
      </Layout>
    </BrowserRouter>
  );
}

export default App;
