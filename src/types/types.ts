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
