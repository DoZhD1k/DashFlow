// NoteList.tsx

import React from "react";

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteListProps {
  notes: Note[];
  selectedNoteId: number | null;
  setSelectedNoteId: (id: number) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  selectedNoteId,
  setSelectedNoteId,
}) => {
  return (
    <div className="w-1/3 bg-gray-100 rounded-lg shadow-md p-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`p-4 mb-2 rounded-lg cursor-pointer ${
            selectedNoteId === note.id ? "bg-blue-200" : "bg-white"
          } hover:bg-blue-100`}
          onClick={() => setSelectedNoteId(note.id)}
        >
          <h2 className="text-lg font-semibold">{note.title}</h2>
          <p className="text-sm text-gray-500">{note.createdAt}</p>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
