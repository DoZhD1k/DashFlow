// import { createContext, useContext, useState, useRef, useEffect } from "react";
// import { invoke } from "@tauri-apps/api/core";
// import { Track } from "../types/music";

// interface PlayerContextProps {
//   currentTrack: Track | null;
//   setCurrentTrack: (track: Track | null) => void;
//   queue: Track[];
//   setQueue: (queue: Track[]) => void;
//   addToQueue: (tracks: Track | Track[]) => void;
//   isPlaying: boolean;
//   togglePlayPause: () => void;
//   nextTrack: () => void;
//   volume: number;
//   setVolume: (volume: number) => void;
//   currentTime: number;
//   duration: number;
//   seekTo: (time: number) => void;
// }

// const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

// export function PlayerProvider({ children }: { children: React.ReactNode }) {
//   const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
//   const [queue, setQueue] = useState<Track[]>([]);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [volume, setVolume] = useState(() =>
//     parseFloat(localStorage.getItem("player_volume") || "1.0")
//   );
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   useEffect(() => {
//     if (currentTrack) {
//       fetchStreamUrl(currentTrack.id);
//     }
//   }, [currentTrack]);

//   const fetchStreamUrl = async (trackId: string) => {
//     try {
//       const streamUrl: string = await invoke("get_track_stream_url_command", {
//         trackId,
//       });

//       if (!audioRef.current) {
//         audioRef.current = new Audio(streamUrl);
//       } else {
//         audioRef.current.src = streamUrl;
//       }

//       audioRef.current.volume = volume;
//       audioRef.current
//         .play()
//         .catch((error) => console.error("Ошибка воспроизведения:", error));
//       setIsPlaying(true);

//       audioRef.current.onended = () => nextTrack();
//       audioRef.current.onloadedmetadata = () =>
//         setDuration(audioRef.current?.duration || 0);
//       audioRef.current.ontimeupdate = () =>
//         setCurrentTime(audioRef.current?.currentTime || 0);
//     } catch (error) {
//       console.error("Ошибка загрузки стрим-URL:", error);
//     }
//   };

//   const togglePlayPause = () => {
//     if (!audioRef.current) return;

//     if (isPlaying) {
//       audioRef.current.pause();
//     } else {
//       audioRef.current.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const nextTrack = () => {
//     if (queue.length > 0) {
//       setCurrentTrack(queue[0]);
//       setQueue(queue.slice(1));
//     } else {
//       setCurrentTrack(null);
//     }
//   };

//   const addToQueue = (tracks: Track | Track[]) => {
//     setQueue((prev) => [
//       ...prev,
//       ...(Array.isArray(tracks) ? tracks : [tracks]),
//     ]);
//   };

//   const changeVolume = (newVolume: number) => {
//     setVolume(newVolume);
//     if (audioRef.current) {
//       audioRef.current.volume = newVolume;
//     }
//     localStorage.setItem("player_volume", newVolume.toString());
//   };

//   const seekTo = (time: number) => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = time;
//       setCurrentTime(time);
//     }
//   };

//   return (
//     <PlayerContext.Provider
//       value={{
//         currentTrack,
//         setCurrentTrack,
//         queue,
//         setQueue,
//         addToQueue,
//         isPlaying,
//         togglePlayPause,
//         nextTrack,
//         volume,
//         setVolume: changeVolume,
//         currentTime,
//         duration,
//         seekTo,
//       }}
//     >
//       {children}
//     </PlayerContext.Provider>
//   );
// }

// export function usePlayer() {
//   const context = useContext(PlayerContext);
//   if (!context) {
//     throw new Error("usePlayer must be used within a PlayerProvider");
//   }
//   return context;
// }

import { createContext, useContext, useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Track } from "../types/music";

interface PlayerContextProps {
  currentTrack: Track | null;
  setCurrentTrack: (track: Track | null) => void;
  queue: Track[];
  setQueue: (queue: Track[]) => void;
  addToQueue: (tracks: Track | Track[]) => void;
  isPlaying: boolean;
  togglePlayPause: () => void;
  nextTrack: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  currentTime: number;
  duration: number;
  seekTo: (time: number) => void;
  isBuffering: boolean; // ✅ Добавляем состояние буферизации
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() =>
    parseFloat(localStorage.getItem("player_volume") || "1.0")
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false); // ✅ Новый флаг буферизации
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentTrack) {
      fetchStreamUrl(currentTrack.id);
    }
  }, [currentTrack]);

  const fetchStreamUrl = async (trackId: string) => {
    try {
      setIsBuffering(true); // ✅ Включаем состояние буферизации перед загрузкой

      const streamUrl: string = await invoke("get_track_stream_url_command", {
        trackId,
      });

      if (!audioRef.current) {
        audioRef.current = new Audio(streamUrl);
      } else {
        audioRef.current.src = streamUrl;
      }

      audioRef.current.volume = volume;

      audioRef.current.oncanplaythrough = () => {
        setIsBuffering(false); // ✅ Отключаем буферизацию, когда трек можно воспроизвести
        audioRef.current?.play();
        setIsPlaying(true);
      };

      audioRef.current.onended = () => nextTrack();
      audioRef.current.onloadedmetadata = () =>
        setDuration(audioRef.current?.duration || 0);
      audioRef.current.ontimeupdate = () =>
        setCurrentTime(audioRef.current?.currentTime || 0);
    } catch (error) {
      console.error("Ошибка загрузки стрим-URL:", error);
      setIsBuffering(false); // ✅ Убираем флаг даже в случае ошибки
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (queue.length > 0) {
      setCurrentTrack(queue[0]);
      setQueue(queue.slice(1));
    } else {
      setCurrentTrack(null);
    }
  };

  const addToQueue = (tracks: Track | Track[]) => {
    setQueue((prev) => [
      ...prev,
      ...(Array.isArray(tracks) ? tracks : [tracks]),
    ]);
  };

  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    localStorage.setItem("player_volume", newVolume.toString());
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        setCurrentTrack,
        queue,
        setQueue,
        addToQueue,
        isPlaying,
        togglePlayPause,
        nextTrack,
        volume,
        setVolume: changeVolume,
        currentTime,
        duration,
        seekTo,
        isBuffering, // ✅ Теперь передаем в контекст
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
