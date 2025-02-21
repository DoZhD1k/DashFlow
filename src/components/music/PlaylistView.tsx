// import { useState, useEffect } from "react";
// import { invoke } from "@tauri-apps/api/core";
// import { Track, Playlist } from "../../types/music";

// interface PlaylistViewProps {
//   playlist: Playlist;
//   setCurrentTrack: React.Dispatch<React.SetStateAction<Track | null>>;
//   addToQueue: (tracks: Track[]) => void;
//   goBack: () => void;
// }

// export default function PlaylistView({
//   playlist,
//   setCurrentTrack,
//   addToQueue,
//   goBack,
// }: PlaylistViewProps) {
//   const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);

//   useEffect(() => {
//     const fetchPlaylistTracks = async () => {
//       try {
//         const response: { data: Track[] } = await invoke(
//           "get_playlist_tracks_audius_command",
//           {
//             playlistId: playlist.id,
//           }
//         );
//         setPlaylistTracks(response.data.map(normalizeTrack));
//       } catch (error) {
//         console.error("Ошибка загрузки треков плейлиста:", error);
//       }
//     };

//     fetchPlaylistTracks();
//   }, [playlist.id]);

//   const normalizeTrack = (track: any): Track => ({
//     type: "track",
//     id: track.id || "unknown",
//     title: track.title || "Без названия",
//     user: {
//       name: track.user?.name || "Неизвестный исполнитель",
//     },
//     artwork: track.artwork || { "1000x1000": "/default-cover.jpg" },
//     stream_url: track.stream_url || "",
//     duration: track.duration || 0,
//   });

//   const playPlaylist = () => {
//     if (playlistTracks.length > 0) {
//       setCurrentTrack(playlistTracks[0]);
//       addToQueue(playlistTracks.slice(1));
//     }
//   };

//   return (
//     <div className="flex flex-col dark:bg-stone-800 rounded-lg overflow-hidden">
//       <div className="relative w-full h-64 bg-gradient-to-b dark:from-stone-900 dark:to-stone-800 p-6 flex items-center gap-6">
//         <img
//           src={playlist.artwork?.["1000x1000"] || "/default-cover.jpg"}
//           alt={playlist.playlist_name}
//           className="w-56 h-56 object-cover rounded-lg shadow-lg"
//         />
//         <div className="flex flex-col justify-center">
//           <h1 className="text-4xl font-bold">{playlist.playlist_name}</h1>
//           <p className="text-gray-400 text-lg mt-2">By {playlist.user.name}</p>
//           <p className="text-gray-400 text-sm mt-2">{playlist.description}</p>

//           <div className="mt-4 flex items-center gap-4">
//             <button
//               onClick={playPlaylist}
//               className="px-6 py-3 bg-purple-600 rounded-lg text-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
//             >
//               ▶ Play
//             </button>

//             <button
//               onClick={goBack}
//               className="text-gray-400 hover:text-gray-200 transition"
//             >
//               ← Назад
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="p-6 overflow-y-auto custom-scrollbar">
//         <h2 className="text-xl font-bold mb-4">Треки</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 gap-4">
//           {playlistTracks.map((track, index) => (
//             <div
//               key={track.id}
//               className="bg-gray-100 dark:bg-stone-900 p-4 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-stone-600 transition cursor-pointer flex items-center gap-4"
//               onClick={() => setCurrentTrack(track)}
//             >
//               <span className="text-gray-400 text-lg">{index + 1}.</span>
//               <img
//                 src={track.artwork?.["150x150"] || "/default-cover.jpg"}
//                 alt={track.title}
//                 className="w-12 h-12 object-cover rounded-md"
//               />
//               <div className="flex-1">
//                 <p className="font-semibold truncate">{track.title}</p>
//                 <p className="text-sm text-gray-400">{track.user.name}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Track, Playlist } from "../../types/music";
import Loader from "../Loader";

interface PlaylistViewProps {
  playlist: Playlist;
  setCurrentTrack: React.Dispatch<React.SetStateAction<Track | null>>;
  addToQueue: (tracks: Track[]) => void;
  goBack: () => void;
}

export default function PlaylistView({
  playlist,
  setCurrentTrack,
  addToQueue,
  goBack,
}: PlaylistViewProps) {
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true); // ✅ Добавляем состояние загрузки

  useEffect(() => {
    const fetchPlaylistTracks = async () => {
      setIsLoading(true); // ✅ Начинаем загрузку
      try {
        const response: { data: Track[] } = await invoke(
          "get_playlist_tracks_audius_command",
          {
            playlistId: playlist.id,
          }
        );
        setPlaylistTracks(response.data.map(normalizeTrack));
      } catch (error) {
        console.error("Ошибка загрузки треков плейлиста:", error);
      } finally {
        setIsLoading(false); // ✅ Завершаем загрузку
      }
    };

    fetchPlaylistTracks();
  }, [playlist.id]);

  const normalizeTrack = (track: any): Track => ({
    type: "track",
    id: track.id || "unknown",
    title: track.title || "Без названия",
    user: {
      name: track.user?.name || "Неизвестный исполнитель",
    },
    artwork: track.artwork || { "1000x1000": "/default-cover.jpg" },
    stream_url: track.stream_url || "",
    duration: track.duration || 0,
  });

  const playPlaylist = () => {
    if (playlistTracks.length > 0) {
      setCurrentTrack(playlistTracks[0]);
      addToQueue(playlistTracks.slice(1));
    }
  };

  return (
    <div className="flex flex-col dark:bg-stone-800 rounded-lg overflow-hidden">
      <div className="relative w-full h-64 bg-gradient-to-b dark:from-stone-900 dark:to-stone-800 p-6 flex items-center gap-6">
        <img
          src={playlist.artwork?.["1000x1000"] || "/default-cover.jpg"}
          alt={playlist.playlist_name}
          className="w-56 h-56 object-cover rounded-lg shadow-lg"
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold">{playlist.playlist_name}</h1>
          <p className="text-gray-400 text-lg mt-2">By {playlist.user.name}</p>
          <p className="text-gray-400 text-sm mt-2">{playlist.description}</p>

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={playPlaylist}
              className="px-6 py-3 bg-purple-600 rounded-lg text-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
            >
              ▶ Play
            </button>

            <button
              onClick={goBack}
              className="text-gray-400 hover:text-gray-200 transition"
            >
              ← Назад
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Loader, если идет загрузка */}
      {isLoading ? (
        <div className="flex justify-center items-center h-full min-h-[400px]">
          <Loader />
        </div>
      ) : (
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <h2 className="text-xl font-bold mb-4">Треки</h2>
          <div className="grid grid-cols-1 gap-4">
            {playlistTracks.map((track, index) => (
              <div
                key={track.id}
                className="bg-gray-100 dark:bg-stone-900 p-4 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-stone-600 transition cursor-pointer flex items-center gap-4"
                onClick={() => setCurrentTrack(track)}
              >
                <span className="text-gray-400 text-lg">{index + 1}.</span>
                <img
                  src={track.artwork?.["150x150"] || "/default-cover.jpg"}
                  alt={track.title}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="flex-1">
                  <p className="font-semibold truncate">{track.title}</p>
                  <p className="text-sm text-gray-400">{track.user.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
