import React, { useState, useEffect } from "react";
import SearchBar from "../components/music/SearchBar";
import TrackList from "../components/music/TrackList";
import CurrentTrack from "../components/music/CurrentTrack";
import PlaybackControls from "../components/music/PlaybackControls";
import { invoke } from "@tauri-apps/api/core";

interface Track {
  name: string;
  artist: string;
  albumCover: string;
  uri: string;
}

export const Music: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null); // Текущий воспроизводимый трек
  const [isPlaying, setIsPlaying] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Отладка токена
  useEffect(() => {
    console.log("Access Token Updated:", accessToken);
  }, [accessToken]);

  const handleAuthorize = async () => {
    try {
      console.log("Запрашиваем URL авторизации...");
      const authUrl = await invoke<string>("get_auth_url");
      console.log("Получен URL авторизации:", authUrl);
      window.location.href = authUrl;
    } catch (error) {
      console.error("Ошибка при получении URL авторизации:", error);
    }
  };

  const handleAuthCallback = async (code: string) => {
    try {
      console.log("Начало обработки колбэка авторизации...");
      console.log("Переданный код:", code);
      console.log("Redirect URI:", "http://localhost:1420/music");

      const response = await invoke<string>("auth_callback", {
        code,
        redirectUri: "http://localhost:1420/music",
      });

      console.log("Ответ от auth_callback:", response);

      const tokenData = JSON.parse(response);
      console.log("Полученные данные токена:", tokenData);

      setAccessToken(tokenData.access_token);
    } catch (error) {
      console.error("Ошибка при обработке колбэка авторизации:", error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");

    if (code) {
      handleAuthCallback(code).then(() => {
        // Удаляем код из URL
        window.history.replaceState({}, document.title, "/music");
      });
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      const fetchUserProfile = async () => {
        try {
          const response = await invoke<string>("get_user_profiles", {
            accessToken,
          });
          console.log("Данные профиля пользователя:", response);
        } catch (error) {
          console.error("Ошибка при получении профиля пользователя:", error);
        }
      };

      fetchUserProfile();
    }
  }, [accessToken]);

  const handleSearch = async (query: string) => {
    if (!accessToken) {
      console.warn("Авторизация требуется для поиска треков");
      return;
    }

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      console.log("Поисковый запрос:", query);
      const response = await invoke<string>("search_tracks", {
        query,
        accessToken,
      });
      console.log("Ответ от search_tracks:", response);

      const data = JSON.parse(response);
      const tracks = data.tracks.items.map((item: any) => ({
        name: item.name,
        artist: item.artists[0]?.name || "Unknown Artist",
        albumCover: item.album.images[0]?.url || "",
        uri: item.uri,
      }));

      console.log("Извлеченные треки:", tracks);
      setSearchResults(tracks);
    } catch (error) {
      console.error("Ошибка при поиске треков:", error);
    }
  };

  const handleSelectTrack = async (track: Track) => {
    try {
      console.log("Выбран трек:", track);
      setCurrentTrack(track); // Устанавливаем выбранный трек как текущий

      // Отправляем запрос на воспроизведение через Spotify API
      if (accessToken) {
        await invoke("play_tracks", {
          trackUri: track.uri,
          accessToken,
        });
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Ошибка при воспроизведении трека:", error);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (accessToken && currentTrack) {
        if (isPlaying) {
          await invoke("pause_playbacks", { accessToken });
        } else {
          await invoke("play_tracks", {
            trackUri: currentTrack.uri,
            accessToken,
          });
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error("Ошибка управления воспроизведением:", error);
    }
  };

  const handleSkipNext = async () => {
    try {
      if (accessToken) {
        await invoke("skip_tracks", { accessToken });
      }
    } catch (error) {
      console.error("Ошибка при пропуске трека:", error);
    }
  };

  const handleSkipPrevious = async () => {
    try {
      if (accessToken) {
        await invoke("previous_tracks", { accessToken });
      }
    } catch (error) {
      console.error("Ошибка при возврате к предыдущему треку:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 grid grid-rows-[auto,1fr] grid-cols-[3fr,1fr] gap-6">
      {!accessToken ? (
        <div className="col-span-2 text-center">
          <button
            onClick={handleAuthorize}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Войти через Spotify
          </button>
        </div>
      ) : (
        <>
          <div className="col-span-2">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="overflow-y-auto">
            <TrackList
              tracks={searchResults}
              onSelectTrack={handleSelectTrack}
            />
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col gap-4">
            {currentTrack ? (
              <CurrentTrack
                track={currentTrack}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onSkipNext={handleSkipNext}
                onSkipPrevious={handleSkipPrevious}
              />
            ) : (
              <div className="text-center text-gray-400">Выберите трек</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Music;
