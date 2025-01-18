// import React from "react";

// const songs = [
//   {
//     id: 1,
//     name: "Young as the Morning old as the Sea",
//     artist: "Passenger",
//     album: "Young as the Morning",
//     dateAdded: "May 31, 2022",
//     duration: "3:26",
//     cover: "images/song-cover.jpeg",
//   },
//   {
//     id: 2,
//     name: "Song Title 2",
//     artist: "Artist 2",
//     album: "Album 2",
//     dateAdded: "June 1, 2022",
//     duration: "3:15",
//     cover: "images/song-cover.jpeg",
//   },
//   {
//     id: 3,
//     name: "Song Title 3",
//     artist: "Artist 3",
//     album: "Album 3",
//     dateAdded: "June 2, 2022",
//     duration: "4:05",
//     cover: "images/song-cover.jpeg",
//   },
// ];

// const trendingSongs = [
//   {
//     id: 1,
//     name: "Trending Song 1",
//     artist: "Artist 1",
//     cover: "images/song-cover.jpeg",
//   },
//   {
//     id: 2,
//     name: "Trending Song 2",
//     artist: "Artist 2",
//     cover: "images/song-cover.jpeg",
//   },
// ];

// const recommendedPlaylists = [
//   {
//     id: 1,
//     name: "Chill Vibes",
//     description: "Relax and unwind with this chill playlist.",
//     cover: "images/playlist-cover.png",
//   },
//   {
//     id: 2,
//     name: "Workout Beats",
//     description: "Pump up your energy during workouts.",
//     cover: "images/playlist-cover.png",
//   },
// ];

// const recentlyPlayed = [
//   {
//     id: 1,
//     name: "Recently Played 1",
//     artist: "Artist 1",
//     cover: "images/song-cover.jpeg",
//   },
//   {
//     id: 2,
//     name: "Recently Played 2",
//     artist: "Artist 2",
//     cover: "images/song-cover.jpeg",
//   },
// ];

// export const MusicPage: React.FC = () => {
//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900">
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center space-x-4">
//               <button className="p-2 bg-gray-700 rounded-full">
//                 <img
//                   src="assets/LeftArrow.svg"
//                   alt="Back"
//                   className="w-4 h-4"
//                 />
//               </button>
//               <button className="p-2 bg-gray-700 rounded-full">
//                 <img
//                   src="assets/RightArrow.svg"
//                   alt="Forward"
//                   className="w-4 h-4"
//                 />
//               </button>
//             </div>
//             <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full text-gray-200">
//               <img src="assets/Profile.svg" alt="Profile" className="w-6 h-6" />
//               <span>servet.gulnaro...</span>
//             </div>
//           </div>

//           {/* Playlist Info */}
//           <div className="flex items-end space-x-6">
//             <img
//               src="images/playlist-cover.png"
//               alt="Playlist Cover"
//               className="w-64 h-64 shadow-lg"
//             />
//             <div>
//               <p className="text-sm uppercase font-bold text-gray-300">
//                 Public Playlist
//               </p>
//               <h1 className="text-4xl font-extrabold">
//                 Classic Road Trip Songs
//               </h1>
//               <p className="text-gray-400 mt-2">
//                 A soundtrack to fuel your good mood while on the road.
//               </p>
//               <p className="text-gray-400 mt-4">
//                 <span className="font-bold text-white">Spotify ·</span>{" "}
//                 5,131,321 likes · 100 songs, 6 hr 57 min
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Search Section */}
//         <div className="p-6 bg-gray-900">
//           <h2 className="text-2xl font-bold text-white mb-4">Search</h2>
//           <input
//             type="text"
//             placeholder="Search for songs, artists, or playlists..."
//             className="w-full p-2 rounded-lg bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
//           />
//         </div>

//         {/* Trending Songs */}
//         <div className="p-6 bg-gray-900">
//           <h2 className="text-2xl font-bold text-white mb-4">Trending Songs</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {trendingSongs.map((song) => (
//               <div
//                 key={song.id}
//                 className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-200"
//               >
//                 <img
//                   src={song.cover}
//                   alt={song.name}
//                   className="w-full h-40 object-cover rounded-lg mb-2"
//                 />
//                 <p className="text-white font-bold">{song.name}</p>
//                 <p className="text-gray-400 text-sm">{song.artist}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Recommended Playlists */}
//         <div className="p-6 bg-gray-900">
//           <h2 className="text-2xl font-bold text-white mb-4">
//             Recommended Playlists
//           </h2>
//           <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
//             {recommendedPlaylists.map((playlist) => (
//               <div
//                 key={playlist.id}
//                 className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-200 w-60"
//               >
//                 <img
//                   src={playlist.cover}
//                   alt={playlist.name}
//                   className="w-full h-40 object-cover rounded-lg mb-2"
//                 />
//                 <p className="text-white font-bold">{playlist.name}</p>
//                 <p className="text-gray-400 text-sm">{playlist.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Recently Played */}
//         <div className="p-6 bg-gray-900">
//           <h2 className="text-2xl font-bold text-white mb-4">
//             Recently Played
//           </h2>
//           <div className="flex flex-col space-y-4">
//             {recentlyPlayed.map((song) => (
//               <div
//                 key={song.id}
//                 className="flex items-center bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-200"
//               >
//                 <img
//                   src={song.cover}
//                   alt={song.name}
//                   className="w-16 h-16 object-cover rounded-lg mr-4"
//                 />
//                 <div>
//                   <p className="text-white font-bold">{song.name}</p>
//                   <p className="text-gray-400 text-sm">{song.artist}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Songs List */}
//         <div className="flex-1 bg-gray-900 p-6 overflow-y-auto">
//           <table className="w-full text-left text-gray-400">
//             <thead>
//               <tr className="border-b border-gray-700">
//                 <th>#</th>
//                 <th>Title</th>
//                 <th>Album</th>
//                 <th>Date Added</th>
//                 <th>
//                   <img
//                     src="assets/Duration.svg"
//                     alt="Duration"
//                     className="w-6 h-6"
//                   />
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {songs.map((song) => (
//                 <tr key={song.id} className="hover:bg-gray-800">
//                   <td className="py-2">{song.id}</td>
//                   <td className="py-2 flex items-center space-x-4">
//                     <img
//                       src={song.cover}
//                       alt="Song Cover"
//                       className="w-12 h-12"
//                     />
//                     <div>
//                       <p className="font-bold text-white">{song.name}</p>
//                       <p className="text-sm">{song.artist}</p>
//                     </div>
//                   </td>
//                   <td className="py-2">{song.album}</td>
//                   <td className="py-2">{song.dateAdded}</td>
//                   <td className="py-2">{song.duration}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// import React, { useEffect, useState } from "react";

// interface Song {
//   id: number;
//   name: string;
//   artist: string;
//   album: string;
//   dateAdded: string;
//   duration: string;
// }

// export const MusicPage: React.FC = () => {
//   const [songs, setSongs] = useState<Song[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchSongs = async () => {
//       try {
//         const response = await fetch(
//           `https://theaudiodb.com/api/v1/json/${process.env.REACT_APP_AUDIO_DB_API_KEY}/trending.php?country=us&type=itunes&format=singles`
//         );
//         const data = await response.json();
//         if (data.trending) {
//           // Преобразуем данные в наш формат
//           const formattedSongs: Song[] = data.trending.map(
//             (item: any, index: number) => ({
//               id: index + 1,
//               name: item.strTrack || "Unknown Track",
//               artist: item.strArtist || "Unknown Artist",
//               album: item.strAlbum || "Unknown Album",
//               dateAdded: new Date().toLocaleDateString(),
//               duration: "3:30", // Можете заменить на значение из API, если доступно
//             })
//           );
//           setSongs(formattedSongs);
//         }
//       } catch (error) {
//         console.error("Failed to fetch songs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSongs();
//   }, []);

//   if (loading) {
//     return <div className="text-white">Loading...</div>;
//   }

//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center space-x-4">
//               <button className="p-2 bg-gray-700 rounded-full">
//                 <img
//                   src="assets/LeftArrow.svg"
//                   alt="Back"
//                   className="w-4 h-4"
//                 />
//               </button>
//               <button className="p-2 bg-gray-700 rounded-full">
//                 <img
//                   src="assets/RightArrow.svg"
//                   alt="Forward"
//                   className="w-4 h-4"
//                 />
//               </button>
//             </div>
//             <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full text-gray-200">
//               <img src="assets/Profile.svg" alt="Profile" className="w-6 h-6" />
//               <span>servet.gulnaro...</span>
//             </div>
//           </div>

//           {/* Playlist Info */}
//           <div className="flex items-end space-x-6">
//             <img
//               src="images/playlist-cover.png"
//               alt="Playlist Cover"
//               className="w-64 h-64 shadow-lg"
//             />
//             <div>
//               <p className="text-sm uppercase font-bold text-gray-300">
//                 Public Playlist
//               </p>
//               <h1 className="text-4xl font-extrabold">Trending Songs</h1>
//               <p className="text-gray-400 mt-2">
//                 Discover the most popular songs right now.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Songs List */}
//         <div className="flex-1 bg-gray-900 p-6 overflow-y-auto">
//           <table className="w-full text-left text-gray-400">
//             <thead>
//               <tr className="border-b border-gray-700">
//                 <th>#</th>
//                 <th>Title</th>
//                 <th>Album</th>
//                 <th>Artist</th>
//                 <th>Date Added</th>
//                 <th>Duration</th>
//               </tr>
//             </thead>
//             <tbody>
//               {songs.map((song) => (
//                 <tr key={song.id} className="hover:bg-gray-800">
//                   <td className="py-2">{song.id}</td>
//                   <td className="py-2">{song.name}</td>
//                   <td className="py-2">{song.album}</td>
//                   <td className="py-2">{song.artist}</td>
//                   <td className="py-2">{song.dateAdded}</td>
//                   <td className="py-2">{song.duration}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// interface Song {
//   id: string;
//   name: string;
//   album: string;
//   artist: string;
//   duration: string;
// }

// const SPOTIFY_API_URL = "https://api.spotify.com/v1";

// export const MusicPage: React.FC = () => {
//   const [songs, setSongs] = useState<Song[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [token, setToken] = useState<string>("");

//   // Получение токена доступа
//   const fetchAccessToken = async () => {
//     const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID!;
//     const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET!;
//     const authString = `${clientId}:${clientSecret}`;
//     const authBase64 = btoa(authString);

//     try {
//       const response = await axios.post(
//         "https://accounts.spotify.com/api/token",
//         new URLSearchParams({ grant_type: "client_credentials" }),
//         {
//           headers: {
//             Authorization: `Basic ${authBase64}`,
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//         }
//       );
//       setToken(response.data.access_token);
//     } catch (error) {
//       console.error("Failed to fetch access token:", error);
//     }
//   };

//   // Получение треков из Spotify
//   const fetchSongs = async () => {
//     if (!token) return;

//     try {
//       const response = await axios.get(
//         `${SPOTIFY_API_URL}/playlists/37i9dQZF1DXcBWIGoYBM5M`, // ID плейлиста (например, "Today's Top Hits")
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const tracks = response.data.tracks.items.map((item: any) => ({
//         id: item.track.id,
//         name: item.track.name,
//         album: item.track.album.name,
//         artist: item.track.artists.map((artist: any) => artist.name).join(", "),
//         duration: formatDuration(item.track.duration_ms),
//       }));

//       setSongs(tracks);
//     } catch (error) {
//       console.error("Failed to fetch songs:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDuration = (ms: number): string => {
//     const minutes = Math.floor(ms / 60000);
//     const seconds = ((ms % 60000) / 1000).toFixed(0);
//     return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
//   };

//   useEffect(() => {
//     fetchAccessToken();
//   }, []);

//   useEffect(() => {
//     if (token) {
//       fetchSongs();
//     }
//   }, [token]);

//   // if (loading) {
//   //   return <div className="text-white">Loading...</div>;
//   // }

//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center space-x-4">
//               <button className="p-2 bg-gray-700 rounded-full">
//                 <img
//                   src="assets/LeftArrow.svg"
//                   alt="Back"
//                   className="w-4 h-4"
//                 />
//               </button>
//               <button className="p-2 bg-gray-700 rounded-full">
//                 <img
//                   src="assets/RightArrow.svg"
//                   alt="Forward"
//                   className="w-4 h-4"
//                 />
//               </button>
//             </div>
//             <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full text-gray-200">
//               <img src="assets/Profile.svg" alt="Profile" className="w-6 h-6" />
//               <span>Spotify User</span>
//             </div>
//           </div>

//           {/* Playlist Info */}
//           <div className="flex items-end space-x-6">
//             <img
//               src="images/playlist-cover.png"
//               alt="Playlist Cover"
//               className="w-64 h-64 shadow-lg"
//             />
//             <div>
//               <p className="text-sm uppercase font-bold text-gray-300">
//                 Public Playlist
//               </p>
//               <h1 className="text-4xl font-extrabold">Today's Top Hits</h1>
//               <p className="text-gray-400 mt-2">
//                 Discover the most popular songs right now.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Songs List */}
//         <div className="flex-1 bg-gray-900 p-6 overflow-y-auto">
//           <table className="w-full text-left text-gray-400">
//             <thead>
//               <tr className="border-b border-gray-700">
//                 <th>#</th>
//                 <th>Title</th>
//                 <th>Album</th>
//                 <th>Artist</th>
//                 <th>Duration</th>
//               </tr>
//             </thead>
//             <tbody>
//               {songs.map((song, index) => (
//                 <tr key={song.id} className="hover:bg-gray-800">
//                   <td className="py-2">{index + 1}</td>
//                   <td className="py-2">{song.name}</td>
//                   <td className="py-2">{song.album}</td>
//                   <td className="py-2">{song.artist}</td>
//                   <td className="py-2">{song.duration}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// import React, { useState } from "react";
// import { SearchTracks } from "../components/music/JamendoApi";
// import { Track } from "../types/types";

// export const MusicPage: React.FC = () => {
//   const [query, setQuery] = useState("");
//   const [tracks, setTracks] = useState<Track[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const results = await SearchTracks(query);
//       setTracks(results);
//     } catch (err) {
//       setError("Ошибка загрузки данных. Проверьте консоль.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-900 text-white h-screen">
//       <h1 className="text-2xl font-bold mb-4">Музыкальный поиск</h1>
//       <div className="flex space-x-4 mb-6">
//         <input
//           type="text"
//           placeholder="Введите название трека..."
//           className="p-2 rounded bg-gray-800 text-white flex-1"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <button
//           onClick={handleSearch}
//           className="p-2 bg-green-500 text-white rounded"
//         >
//           Найти
//         </button>
//       </div>
//       {loading ? (
//         <p>Загрузка...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : tracks.length > 0 ? (
//         <div>
//           <h2 className="text-xl font-bold mb-4">Результаты поиска:</h2>
//           <ul>
//             {tracks.map((track) => (
//               <li key={track.id} className="mb-4">
//                 <p className="font-bold">{track.name}</p>
//                 <p>Исполнитель: {track.artist_name}</p>
//                 <audio controls className="mt-2">
//                   <source src={track.audio} type="audio/mpeg" />
//                 </audio>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>Введите запрос для поиска треков.</p>
//       )}
//     </div>
//   );
// };

import React from "react";
import { MusicSearch } from "~/components/music/MusicSearch";

export const Music: React.FC = () => {
  return (
    <div className="h-screen">
      <MusicSearch />
    </div>
  );
};
