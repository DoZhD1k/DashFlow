// import axios from "axios";
// import { Track, Album, Artist } from "../../types/types";
import { invoke } from "@tauri-apps/api/core";

// const JAMENDO_API_URL = "https://api.jamendo.com";
// const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID;
// const JAMENDO_API_KEY = process.env.JAMENDO_API_KEY;

// Инициализация клиента
// const apiClient = axios.create({
//   baseURL: JAMENDO_API_URL,
//   params: {
//     client_id: JAMENDO_CLIENT_ID,
//     format: "json",
//   },
// });

// Получение треков
export const SearchTracks = async (
  query: string
): Promise<{ results: any[] }> => {
  try {
    const response = await invoke("search_tracks", { query });
    return response as { results: any[] }; // Приводим к ожидаемому типу
  } catch (error) {
    console.error("Ошибка при вызове search_tracks:", error);
    return { results: [] }; // Возвращаем пустой массив в случае ошибки
  }
};

// // Получение альбомов
// export const GetAlbums = async (query: string): Promise<Album[]> => {
//   try {
//     const response = await apiClient.get("/v3.0/albums", {
//       params: {
//         name: query,
//         client_secret: JAMENDO_API_KEY,
//         limit: 10,
//       },
//     });
//     return response.data.results as Album[];
//   } catch (error) {
//     console.error("Ошибка получения альбомов:", error);
//     return [];
//   }
// };

// // Получение исполнителей
// export const GetArtists = async (query: string): Promise<Artist[]> => {
//   try {
//     const response = await apiClient.get("/v3.0/artists", {
//       params: {
//         name: query,
//         client_secret: JAMENDO_API_KEY,
//         limit: 10,
//       },
//     });
//     return response.data.results as Artist[];
//   } catch (error) {
//     console.error("Ошибка получения исполнителей:", error);
//     return [];
//   }
// };
