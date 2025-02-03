import React, { createContext, useContext, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

// ✅ Создаём интерфейс для контекста
interface ScreenRecordingContextType {
  isRecording: boolean;
  videoBlob: Blob | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  saveRecording: () => Promise<void>;
  openFolder: () => Promise<void>; // ✅ Функция открытия папки
}

// ✅ Создаём контекст с дефолтным значением
const ScreenRecordingContext = createContext<ScreenRecordingContextType | null>(
  null
);

// ✅ Провайдер контекста
export const ScreenRecordingProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // ✅ Запуск записи экрана
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          sampleRate: 48000,
          channelCount: 2,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9,opus",
        audioBitsPerSecond: 192000,
        videoBitsPerSecond: 5000000,
      });

      chunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setVideoBlob(new Blob(chunksRef.current, { type: "video/webm" }));
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Ошибка при записи экрана:", err);
    }
  };

  // ✅ Остановка записи
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // ✅ Сохранение видео через бэкенд
  const saveRecording = async () => {
    if (!videoBlob) return;
    try {
      const buffer = await videoBlob.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);

      const filePath: string = await invoke("save_video", {
        videoData: Array.from(uint8Array),
      });

      alert(`Видео сохранено в ${filePath}`);
    } catch (error) {
      console.error("Ошибка сохранения файла:", error);
    }
  };

  // ✅ Открытие папки с видео
  const openFolder = async () => {
    try {
      await invoke("open_dashflow_folder");
    } catch (error) {
      console.error("Ошибка открытия папки:", error);
    }
  };

  return (
    <ScreenRecordingContext.Provider
      value={{
        isRecording,
        videoBlob,
        startRecording,
        stopRecording,
        saveRecording,
        openFolder,
      }}
    >
      {children}
    </ScreenRecordingContext.Provider>
  );
};

export const useScreenRecording = () => {
  const context = useContext(ScreenRecordingContext);
  if (!context) {
    throw new Error(
      "useScreenRecording должен быть использован внутри ScreenRecordingProvider"
    );
  }
  return context;
};
