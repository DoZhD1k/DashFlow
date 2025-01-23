// // src/components/MusicPlayerWidget.tsx
// import React, { useState } from "react";
// import { Play, Pause, Volume2 } from "lucide-react";

// const tracks = [
//   {
//     title: "Track 1",
//     src: "/tracks/track1.mp3",
//   },
//   {
//     title: "Track 2",
//     src: "/tracks/track2.mp3",
//   },
//   // Добавьте больше треков по необходимости
// ];

// const MusicPlayerWidget: React.FC = () => {
//   const [currentTrack, setCurrentTrack] = useState<number>(0);
//   const [isPlaying, setIsPlaying] = useState<boolean>(false);
//   const audioRef = React.useRef<HTMLAudioElement>(null);

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
//     setCurrentTrack((prev) => (prev + 1) % tracks.length);
//     setIsPlaying(false);
//   };

//   const prevTrack = () => {
//     setCurrentTrack((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
//     setIsPlaying(false);
//   };

//   return (
//     <div className="p-4 bg-white dark:bg-white/5 rounded-lg shadow-md transition-colors duration-300">
//       <h3 className="text-lg font-semibold mb-3 flex items-center">
//         <Play className="w-5 h-5 mr-2" />
//         Музыкальный Плеер
//       </h3>
//       <audio
//         ref={audioRef}
//         src={tracks[currentTrack].src}
//         onEnded={() => setIsPlaying(false)}
//       ></audio>
//       <div className="flex items-center justify-between">
//         <span>{tracks[currentTrack].title}</span>
//         <div className="flex items-center space-x-2">
//           <button onClick={prevTrack}>
//             <Play className="w-4 h-4 rotate-180" />
//           </button>
//           <button onClick={togglePlayPause}>
//             {isPlaying ? (
//               <Pause className="w-5 h-5" />
//             ) : (
//               <Play className="w-5 h-5" />
//             )}
//           </button>
//           <button onClick={nextTrack}>
//             <Play className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MusicPlayerWidget;

// src/components/MusicPlayerWidget.tsx
import React, { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from "lucide-react";

const tracks = [
  {
    title: "Track 1",
    src: "/tracks/track1.mp3",
  },
  {
    title: "Track 2",
    src: "/tracks/track2.mp3",
  },
];

const MusicPlayerWidget: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const audioRef = React.useRef<HTMLAudioElement>(null);

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
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setIsPlaying(false);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
        <Play className="w-5 h-5 mr-2" />
        Музыкальный Плеер
      </h3>
      <audio
        ref={audioRef}
        src={tracks[currentTrack].src}
        onEnded={nextTrack}
      ></audio>
      <div className="flex flex-col items-center text-white">
        <span className="mb-2 text-sm font-medium">
          {tracks[currentTrack].title}
        </span>
        <div className="flex items-center space-x-4">
          <button
            onClick={prevTrack}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlayPause}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={nextTrack}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 w-full flex items-center space-x-3">
          {volume === 0 ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerWidget;
