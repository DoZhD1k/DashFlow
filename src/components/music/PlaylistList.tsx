import { Playlist } from "../../types/music";

interface PlaylistListProps {
  playlists: Playlist[];
  onSelectPlaylist: (playlistId: string) => void;
}

export default function PlaylistList({
  playlists,
  onSelectPlaylist,
}: PlaylistListProps) {
  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Плейлисты</h2>
      {playlists.length === 0 ? (
        <p className="text-gray-400">Нет плейлистов</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-gray-800 p-3 rounded-lg shadow-lg hover:bg-gray-600 transition cursor-pointer"
              onClick={() => onSelectPlaylist(playlist.id)}
            >
              <img
                src={playlist.artwork?.["480x480"] || "/default-cover.jpg"}
                alt={playlist.playlist_name}
                className="w-full h-32 object-cover rounded-md"
              />
              <div className="mt-2">
                <p className="font-semibold text-sm">
                  {playlist.playlist_name}
                </p>
                {playlist.description && (
                  <p className="text-xs text-gray-400 truncate">
                    {playlist.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
