import React, { useState, useEffect } from "react";
import NoteList from "../components/notes/NoteList";
import Editor from "../components/notes/editor/Editor"; // Новый редактор
import { getNotes, addNote, updateNote, deleteNote } from "../api/notesApi";
import Loader from "~/components/Loader";

interface Note {
  id: number;
  title: string;
  content: any; // JSON tiptap
  createdAt: string;
  updatedAt: string;
}

const Notes: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const handleSelectNote = (id: number) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setSelectedNoteId(id);
      setSelectedContent(note.content);
    }
  };

  const handleAddNote = async () => {
    try {
      await addNote("Новая заметка", { type: "doc", content: [] });
      await fetchNotes();
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await deleteNote(id);
      await fetchNotes();
      setSelectedNoteId(null);
      setSelectedContent(null);
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleNoteChange = async (newContent: any) => {
    if (!selectedNoteId) return;

    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId ? { ...n, content: newContent } : n
      )
    );
    setSelectedContent(newContent);

    try {
      const note = notes.find((n) => n.id === selectedNoteId);
      const currentTitle = note?.title || "Без названия";
      await updateNote(selectedNoteId, currentTitle, newContent);
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const handleTitleChange = async (id: number, newTitle: string) => {
    if (!id) return; // Если ID нет — выходим

    try {
      const currentContent = notes.find((note) => note.id === id)?.content || {
        type: "doc",
        content: [],
      };
      await updateNote(id, newTitle, currentContent);

      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, title: newTitle } : n))
      );
    } catch (error) {
      console.error("Failed to update title:", error);
    }
  };

  useEffect(() => {
    // Симуляция загрузки данных
    setTimeout(() => {
      setIsLoading(false);
    }); // Можно убрать задержку, если не нужна
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-stone-900">
        <Loader />
      </div>
    );
  }
  return (
    <div className="min-h-screen lg:flex-row bg-white dark:bg-stone-900">
      <div className="grid grid-cols-3 md:grid-cols-4 dark:bg-stone-900 lg:flex-row bg-white">
        <NoteList
          notes={notes.filter((note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          selectedNoteId={selectedNoteId}
          setSelectedNoteId={handleSelectNote}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAdd={handleAddNote}
          onDelete={handleDeleteNote}
          onUpdateTitle={handleTitleChange} // 🔥 Добавлено для исправления ошибки
        />

        <div className="overflow-hidden col-span-2 md:col-span-3">
          {selectedNoteId && selectedContent ? (
            <Editor
              key={selectedNoteId}
              content={selectedContent}
              onContentChange={handleNoteChange}
              title={
                notes.find((n) => n.id === selectedNoteId)?.title ||
                "Без названия"
              }
              onTitleChange={(newTitle) => {
                if (selectedNoteId) {
                  handleTitleChange(selectedNoteId, newTitle);
                }
              }} // 🔥 Оборачиваем функцию
            />
          ) : (
            <div className="flex justify-center items-center min-h-screen max-h-screen">
              <p className="text-gray-500 dark:text-gray-400 text-2xl">
                Выберите заметку или создайте новую
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
