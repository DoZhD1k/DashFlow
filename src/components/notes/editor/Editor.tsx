import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import FloatingMenu from "./FloatingMenuComponent";
import BubbleMenu from "./BubbleMenuComponent";
import Tools from "./tools/Tools";
import configureExtensions from "./configureExtensions";
import { generateText } from "./utils/genAI";

interface EditorProps {
  content: any; // JSON tiptap
  onContentChange: (content: any) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

const Editor: React.FC<EditorProps> = ({
  content,
  onContentChange,
  title,
  onTitleChange,
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  const editor = useEditor({
    extensions: configureExtensions(),
    content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getJSON();
      onContentChange(newContent);
    },
  });

  // Синхронизация содержимого редактора
  useEffect(() => {
    if (editor && content) {
      const currentContent = editor.getJSON();
      if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  // Синхронизация заголовка
  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  if (!editor) return null;

  return (
    <div className="relative w-full shadow-md flex flex-col h-full overflow-hidden p-4 bg-white dark:bg-stone-800">
      {/* Заголовок */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 dark:bg-zinc-700 border-gray-200 dark:border-white/10 mb-4 rounded-md">
        {editingTitle ? (
          <input
            type="text"
            placeholder="Название"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            onBlur={() => {
              setEditingTitle(false);
              onTitleChange(currentTitle);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditingTitle(false);
                onTitleChange(currentTitle);
              }
            }}
            className="w-full p-2 text-lg font-semibold border rounded-md bg-white 
                       dark:bg-stone-800 dark:text-gray-200 
                       border-gray-300 dark:border-gray-600 
                       focus:outline-none focus:ring"
            autoFocus
          />
        ) : (
          <h1
            className="text-lg font-semibold flex-grow cursor-pointer text-gray-900 dark:text-gray-100"
            onDoubleClick={() => setEditingTitle(true)}
          >
            {title || "Без названия"}
          </h1>
        )}
      </div>
      <Tools
        editor={editor}
        onGenerateText={async (text) => {
          try {
            const generated = await generateText(text);
            return generated;
          } catch (error) {
            console.error("Ошибка генерации текста:", error);
            return "";
          }
        }}
      />
      <FloatingMenu editor={editor} onGenerateText={generateText} />
      <BubbleMenu editor={editor} onGenerateText={generateText} />
      <EditorContent
        editor={editor}
        className="border p-4 rounded shadow overflow-y-auto custom-scrollbar h-screen"
      />
    </div>
  );
};

export default Editor;
