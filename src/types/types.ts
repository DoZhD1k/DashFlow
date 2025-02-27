// types.ts
export interface Track {
  id: string;
  name: string;
  artist_name: string;
  audio: string;
  duration: number;
  album_name: string;
}

export interface Album {
  id: string;
  name: string;
  artist_name: string;
  image: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  music_count: number;
}

export interface DetectedGame {
  name: string | null;
  description: string | null;
  path: string | null;
  platform: string | null;
  url: string | null;
  cover: string | null;
  genres: string[] | null; // Исправлено с string | null на string[] | null
  developers: string[] | null; // Исправлено с string | null на string[] | null
  platforms: string[] | null; // Исправлено с string | null на string[] | null
}
