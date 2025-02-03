// import React, { useState, useRef } from "react";
// import { Video, VideoOff, Save, X, FolderOpen } from "lucide-react";
// import { invoke } from "@tauri-apps/api/core";

// const ScreenRecorderWidget: React.FC = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<Blob[]>([]);

//   // 🔹 Начинаем запись экрана
//   const startRecording = async () => {
//     try {
//       // ✅ Запрашиваем захват экрана с аудио
//       const screenStream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//         audio: {
//           sampleRate: 48000, // ✅ Высокая частота дискретизации
//           channelCount: 2, // ✅ Стерео
//           echoCancellation: false, // ✅ Отключаем подавление эха
//           noiseSuppression: false, // ✅ Отключаем шумоподавление
//           autoGainControl: false, // ✅ Отключаем автоматическую регулировку громкости
//         },
//       });

//       // ✅ Получаем аудио-треки (системный звук)
//       const audioTracks = screenStream.getAudioTracks();
//       if (audioTracks.length === 0) {
//         console.warn("Звук не найден, возможно, браузер его не передаёт.");
//       }

//       // ✅ Создаём MediaStream с видео + аудио
//       const combinedStream = new MediaStream([
//         ...screenStream.getVideoTracks(),
//         ...audioTracks,
//       ]);

//       const mediaRecorder = new MediaRecorder(combinedStream, {
//         mimeType: "video/webm; codecs=vp9,opus", // ✅ Выбираем кодек VP9 + Opus (лучше для звука)
//         audioBitsPerSecond: 192000, // ✅ Повышаем битрейт аудио (192 kbps)
//         videoBitsPerSecond: 5000000, // ✅ Повышаем битрейт видео (5 Mbps)
//       });

//       chunksRef.current = [];

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorder.onstop = async () => {
//         const blob = new Blob(chunksRef.current, { type: "video/webm" });
//         setVideoBlob(blob);
//       };

//       mediaRecorder.start();
//       mediaRecorderRef.current = mediaRecorder;
//       setIsRecording(true);
//     } catch (err) {
//       console.error("Ошибка при записи экрана:", err);
//     }
//   };

//   // 🔹 Останавливаем запись
//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   // 🔹 Сохраняем видео в C:\Users\Пользователь\DashFlowVid
//   const saveRecording = async (videoBlob: Blob) => {
//     if (!videoBlob) return;

//     try {
//       const buffer = await videoBlob.arrayBuffer();
//       const uint8Array = new Uint8Array(buffer);

//       // ✅ Отправляем данные в бэкенд
//       const filePath: string = await invoke("save_video", {
//         videoData: Array.from(uint8Array),
//       });

//       alert(`Видео сохранено в ${filePath}`);
//     } catch (error) {
//       console.error("Ошибка сохранения файла:", error);
//     }
//   };

//   // 🔹 Открываем C:\Users\Пользователь\DashFlowVid

//   const openSaveFolder = async () => {
//     try {
//       await invoke("open_dashflow_folder");
//     } catch (error) {
//       console.error("Ошибка открытия папки:", error);
//     }
//   };

//   return (
//     <div className="p-6 bg-white dark:bg-stone-800 rounded-xl shadow-lg flex flex-col transition-shadow duration-300">
//       <h3 className="text-lg font-bold mb-3">Запись экрана</h3>
//       <div className="flex items-center gap-3">
//         <button
//           onClick={openSaveFolder}
//           title="Открыть папку"
//           aria-label="Открыть папку"
//           className="p-2 bg-gray-500 rounded-md hover:bg-gray-600 transition"
//         >
//           <FolderOpen className="w-5 h-5 text-white" />
//         </button>

//         {isRecording ? (
//           <button
//             onClick={stopRecording}
//             title="Остановить запись"
//             aria-label="Остановить запись"
//             className="p-2 bg-red-500 rounded-md hover:bg-red-600 transition"
//           >
//             <VideoOff className="w-5 h-5 text-white" />
//           </button>
//         ) : (
//           <button
//             onClick={startRecording}
//             title="Начать запись"
//             aria-label="Начать запись"
//             className="p-2 bg-green-500 rounded-md hover:bg-green-600 transition"
//           >
//             <Video className="w-5 h-5 text-white" />
//           </button>
//         )}

//         {videoBlob && (
//           <>
//             <button
//               onClick={() => saveRecording(videoBlob)} // ✅ Передаём videoBlob правильно
//               title="Сохранить видео"
//               aria-label="Сохранить видео"
//               className="p-2 bg-blue-500 rounded-md hover:bg-blue-600 transition"
//             >
//               <Save className="w-5 h-5 text-white" />
//             </button>

// <button
//   onClick={() => setVideoBlob(null)}
//   title="Удалить видео"
//   aria-label="Удалить видео"
//   className="p-2 bg-gray-500 rounded-md hover:bg-gray-600 transition"
// >
//   <X className="w-5 h-5 text-white" />
// </button>
//           </>
//         )}
//       </div>

//       {videoBlob && (
//         <video
//           className="mt-4 w-full rounded-lg"
//           controls
//           src={URL.createObjectURL(videoBlob)}
//         />
//       )}
//     </div>
//   );
// };

// export default ScreenRecorderWidget;

// import React from "react";
// import { Video, VideoOff, Save, FolderOpen } from "lucide-react";
// import { useScreenRecording } from "../../context/ScreenRecordingContext"; // ✅ Используем контекст

// const ScreenRecorderWidget: React.FC = () => {
//   const {
//     isRecording,
//     videoBlob,
//     startRecording,
//     stopRecording,
//     saveRecording,
//     openFolder,
//   } = useScreenRecording();

//   return (
//     <div className="p-6 bg-white dark:bg-stone-800 rounded-xl shadow-lg flex flex-col transition-shadow duration-300">
//       <h3 className="text-lg font-bold mb-3">Запись экрана</h3>
//       <div className="flex items-center gap-3">
//         <button
//           onClick={openFolder}
//           title="Открыть папку"
//           className="p-2 bg-gray-500 rounded-md hover:bg-gray-600 transition"
//         >
//           <FolderOpen className="w-5 h-5 text-white" />
//         </button>

//         {isRecording ? (
//           <button
//             onClick={stopRecording}
//             title="Остановить запись"
//             className="p-2 bg-red-500 rounded-md hover:bg-red-600 transition"
//           >
//             <VideoOff className="w-5 h-5 text-white" />
//           </button>
//         ) : (
//           <button
//             onClick={startRecording}
//             title="Начать запись"
//             className="p-2 bg-green-500 rounded-md hover:bg-green-600 transition"
//           >
//             <Video className="w-5 h-5 text-white" />
//           </button>
//         )}

//         {videoBlob && (
//           <button
//             onClick={saveRecording} // ✅ Теперь сохраняем файл
//             title="Сохранить видео"
//             className="p-2 bg-blue-500 rounded-md hover:bg-blue-600 transition"
//           >
//             <Save className="w-5 h-5 text-white" />
//           </button>
//         )}
//       </div>

//       {videoBlob && (
//         <video
//           className="mt-4 w-full rounded-lg"
//           controls
//           src={URL.createObjectURL(videoBlob)}
//         />
//       )}
//     </div>
//   );
// };

// export default ScreenRecorderWidget;

import React from "react";
import { Video, VideoOff, Save, FolderOpen, X } from "lucide-react";
import { useScreenRecording } from "../../context/ScreenRecordingContext"; // ✅ Используем контекст

const ScreenRecorderWidget: React.FC = () => {
  const {
    isRecording,
    videoBlob,
    startRecording,
    stopRecording,
    saveRecording,
    openFolder,
  } = useScreenRecording();

  return (
    <div className="p-6 bg-white dark:bg-stone-800 rounded-xl shadow-lg flex flex-col transition-shadow duration-300">
      <h3 className="text-lg font-bold mb-3">Запись экрана</h3>
      <div className="flex items-center gap-3">
        {/* ✅ Кнопка открытия папки */}
        <button
          onClick={openFolder}
          title="Открыть папку"
          className="p-2 bg-gray-500 rounded-md hover:bg-gray-600 transition"
        >
          <FolderOpen className="w-5 h-5 text-white" />
        </button>

        {/* ✅ Кнопка записи */}
        {isRecording ? (
          <button
            onClick={stopRecording}
            title="Остановить запись"
            className="p-2 bg-red-500 rounded-md hover:bg-red-600 transition"
          >
            <VideoOff className="w-5 h-5 text-white" />
          </button>
        ) : (
          <button
            onClick={startRecording}
            title="Начать запись"
            className="p-2 bg-green-500 rounded-md hover:bg-green-600 transition"
          >
            <Video className="w-5 h-5 text-white" />
          </button>
        )}

        {/* ✅ Кнопка сохранения */}
        {videoBlob && (
          <>
            <button
              onClick={saveRecording}
              title="Сохранить видео"
              className="p-2 bg-blue-500 rounded-md hover:bg-blue-600 transition"
            >
              <Save className="w-5 h-5 text-white" />
            </button>

            {/* ✅ Кнопка удаления видео */}
            <button
              onClick={() => {
                const confirmed = confirm(
                  "Вы уверены, что хотите удалить запись?"
                );
                if (confirmed) {
                  (document.querySelector("video") as HTMLVideoElement).src =
                    "";
                }
              }}
              title="Удалить видео"
              className="p-2 bg-gray-500 rounded-md hover:bg-gray-600 transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </>
        )}
      </div>

      {/* ✅ Видео-плеер */}
      {videoBlob && (
        <video
          className="mt-4 w-full rounded-lg"
          controls
          src={URL.createObjectURL(videoBlob)}
        />
      )}
    </div>
  );
};

export default ScreenRecorderWidget;
