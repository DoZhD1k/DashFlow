import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./globals.css";
import "./prosemirror.css";
import { PlayerProvider } from "./context/PlayerContext";
import { ScreenRecordingProvider } from "./context/ScreenRecordingContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PlayerProvider>
      <ScreenRecordingProvider>
        <App />
      </ScreenRecordingProvider>
    </PlayerProvider>
  </React.StrictMode>
);
