import { SearchResultItem, Track } from "../../types/music";

interface TrackListProps {
  searchResults: SearchResultItem[];
  setCurrentTrack: React.Dispatch<React.SetStateAction<Track | null>>;
  addToQueue: (track: Track) => void;
}

export default function TrackList({
  searchResults,
  setCurrentTrack,
  addToQueue,
}: TrackListProps) {
  return (
    <div className="bg-gray-700 rounded-lg p-4 flex-1">
      <h2 className="text-xl font-bold mb-4">Результаты поиска</h2>
      {searchResults.length === 0 ? (
        <p className="text-gray-400">Ничего не найдено.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-3">
          {searchResults.map((item) => {
            if (item.type === "track") {
              return (
                <div
                  key={item.id}
                  className="bg-gray-800 p-3 rounded-lg shadow-lg hover:bg-gray-600 transition cursor-pointer"
                  onClick={() => setCurrentTrack(item)}
                >
                  <img
                    src={item.artwork?.["480x480"] || "/default-cover.jpg"}
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <div className="mt-2">
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.user.name}</p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <button className="px-3 py-1 bg-green-500 rounded-md hover:bg-green-600 transition text-sm">
                      ▶
                    </button>
                    <button
                      onClick={() => addToQueue(item)}
                      className="px-3 py-1 bg-gray-500 rounded-md hover:bg-gray-400 transition text-sm"
                    >
                      ➕
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
