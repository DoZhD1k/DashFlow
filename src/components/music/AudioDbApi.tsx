import axios from "axios";

const API_KEY = process.env.REACT_APP_AUDIO_DB_API_KEY || "2";
const BASE_URL = "https://www.theaudiodb.com/api/v1/json";

export const searchArtist = async (artistName: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${API_KEY}/search.php`, {
      params: { s: artistName },
    });
    return response.data.artists;
  } catch (error) {
    console.error("Error searching artist:", error);
    return null;
  }
};

export const searchAlbum = async (artistName: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${API_KEY}/searchalbum.php`, {
      params: { s: artistName },
    });
    return response.data.album;
  } catch (error) {
    console.error("Error searching album:", error);
    return null;
  }
};

export const searchTrack = async (trackName: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${API_KEY}/searchtrack.php`, {
      params: { t: trackName },
    });
    return response.data.track;
  } catch (error) {
    console.error("Error searching track:", error);
    return null;
  }
};
