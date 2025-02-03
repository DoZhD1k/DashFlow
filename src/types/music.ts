export interface Artwork {
  "150x150"?: string;
  "480x480"?: string;
  "1000x1000"?: string;
}

export interface Track {
  type: "track"; // ⬅️ Поле 'type' ОБЯЗАТЕЛЬНО
  id: string;
  title: string;
  user: {
    name: string;
  };
  artwork?: Artwork;
  stream_url: string;
  duration: number;
}

export interface Playlist {
  type: "playlist"; // Указываем строгое значение
  id: string;
  playlist_name: string;
  description?: string;
  artwork?: Artwork;
  track_count: number;
  playlist_contents: { trackId: string }[];
  user: {
    id: string;
    name: string;
    handle: string;
    profile_picture?: Artwork;
  };
}

export type SearchResultItem = Track | Playlist;
