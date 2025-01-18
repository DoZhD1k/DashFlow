import axios from "axios";

const REACT_APP_SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const REACT_APP_SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

let accessToken = "";

// Получить токен доступа
export const getAccessToken = async () => {
  if (accessToken) return accessToken;

  const body = new URLSearchParams({
    grant_type: "client_credentials",
  }).toString();

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    body,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(
          `${REACT_APP_SPOTIFY_CLIENT_ID}:${REACT_APP_SPOTIFY_CLIENT_SECRET}`
        )}`,
      },
    }
  );

  accessToken = response.data.access_token;
  return accessToken;
};

// Функция для поиска треков
export const searchTracks = async (query: string) => {
  const token = await getAccessToken();
  const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query,
      type: "track",
      limit: 10,
    },
  });

  return response.data.tracks.items;
};

// Функция для получения плейлиста
export const getPlaylist = async (playlistId: string) => {
  const token = await getAccessToken();
  const response = await axios.get(
    `${SPOTIFY_API_URL}/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
