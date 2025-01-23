// Note.tsx
import React, { useState, useEffect } from "react";
import SearchBar from "../components/notes/SearchBar";
import NoteList from "../components/notes/NoteList";
import NoteView from "../components/notes/NoteView";
import NoteEditor from "../components/notes/NoteEditor";
import { invoke } from "@tauri-apps/api/core";

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchNotes = async () => {
    try {
      console.log("Fetching notes..."); // Проверка начала запроса
      const response = await invoke<Note[]>("get_notes_command");
      console.log("Fetched notes:", response); // Лог данных из API
      setNotes(response);
    } catch (error) {
      console.error("Failed to fetch notes:", error); // Лог ошибки
    }
  };

  useEffect(() => {
    console.log("useEffect called, fetching notes...");
    fetchNotes();
  }, []);

  const handleSaveNote = async (title: string, content: string) => {
    try {
      if (selectedNoteId) {
        await invoke("update_note_command", {
          id: selectedNoteId,
          title,
          content,
        });
      } else {
        await invoke("add_note_command", { title, content });
      }
      setIsEditing(false);
      fetchNotes();
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNoteId) return;
    try {
      await invoke("delete_note_command", { id: selectedNoteId });
      setSelectedNoteId(null);
      fetchNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const filteredNotes = notes.filter((note) =>
    note?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null;

  return (
    <div className="flex flex-col p-6 gap-4">
      {/* Верхняя панель с поиском и кнопкой добавления */}
      <div className="flex items-center justify-between">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button
          onClick={() => {
            setSelectedNoteId(null); // Сбрасываем выбранную заметку
            setIsEditing(true); // Открываем редактор для добавления новой заметки
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Add Note
        </button>
      </div>

      <div className="flex gap-4">
        {/* Список заметок */}
        <NoteList
          notes={filteredNotes}
          selectedNoteId={selectedNoteId}
          setSelectedNoteId={setSelectedNoteId}
        />

        {/* Просмотр или редактирование заметки */}
        {isEditing ? (
          <NoteEditor
            note={selectedNote || { title: "", content: "" }}
            onSave={handleSaveNote}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <NoteView note={selectedNote} onEdit={() => setIsEditing(true)} />
        )}
      </div>
    </div>
  );
};

export default Notes;
