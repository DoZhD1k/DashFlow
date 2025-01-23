// NoteView.tsx

import React from "react";

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteViewProps {
  note: Note | null;
  onEdit: () => void;
}

const NoteView: React.FC<NoteViewProps> = ({ note, onEdit }) => {
  if (!note) {
    return (
      <div className="w-2/3 text-center text-gray-500">
        Select a note to view
      </div>
    );
  }

  return (
    <div className="w-2/3 bg-gray-50 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{note.title}</h2>
      <p className="text-sm text-gray-400 mb-4">
        Created: {note.createdAt} | Updated: {note.updatedAt}
      </p>
      <div className="mb-4">{note.content}</div>
      <button
        onClick={onEdit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Edit Note
      </button>
    </div>
  );
};

export default NoteView;
