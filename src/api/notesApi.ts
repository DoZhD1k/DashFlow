import { invoke } from "@tauri-apps/api/core";

interface Note {
  id: number;
  title: string;
  content: any; // JSON-объект
  createdAt: string;
  updatedAt: string;
}

// Получение всех заметок
export const getNotes = async (): Promise<Note[]> => {
  try {
    const notes = await invoke<Note[]>("get_notes_command");
    return notes.map((note) => ({
      ...note,
      content:
        typeof note.content === "string"
          ? JSON.parse(note.content)
          : note.content, // Десериализуем content
    }));
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    throw error;
  }
};

// Добавление новой заметки
export const addNote = async (title: string, content: any): Promise<void> => {
  try {
    await invoke("add_note_command", {
      title,
      content: JSON.stringify(content), // Сериализуем JSON
    });
  } catch (error) {
    console.error("Failed to add note:", error);
    throw error;
  }
};

// Обновление заметки
export const updateNote = async (
  id: number,
  title: string,
  content: any
): Promise<void> => {
  try {
    // Сериализуем JSON перед отправкой на бэкенд
    await invoke("update_note_command", {
      id,
      title,
      content: JSON.stringify(content), // Сохраняем корректно сериализованный JSON
    });
  } catch (error) {
    console.error("Failed to update note:", error);
    throw error;
  }
};

// Удаление заметки
export const deleteNote = async (id: number): Promise<void> => {
  try {
    await invoke("delete_note_command", { id });
  } catch (error) {
    console.error("Failed to delete note:", error);
    throw error;
  }
};
