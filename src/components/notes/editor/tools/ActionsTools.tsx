// import { FC, useState } from "react";
// import { Wand, Highlighter, Link } from "lucide-react";
// import { Editor as TiptapEditor } from "@tiptap/react";
// import { toast } from "react-toastify";

// interface ActionsToolsProps {
//   editor: TiptapEditor | null;
//   onGenerateText: (text: string) => Promise<string>;
// }

// const ActionsTools: FC<ActionsToolsProps> = ({ editor, onGenerateText }) => {
//   const [loading, setLoading] = useState(false);

//   if (!editor) return null;

//   const addLink = () => {
//     const url = prompt("Введите URL:");
//     if (url) {
//       editor.chain().focus().setLink({ href: url }).run();
//     }
//   };

//   const handleGenerateText = async () => {
//     if (!editor) return;

//     const selectedText = editor.getText();
//     if (!selectedText.trim()) {
//       alert("Выделите текст для генерации.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const generatedContent = await onGenerateText(selectedText);

//       if (!generatedContent) {
//         toast.error("Генерация текста не удалась. Попробуйте снова.");
//         return;
//       }

//       // Вставляем HTML в редактор
//       editor.chain().focus().insertContent(generatedContent).run();
//       toast.success("Текст успешно сгенерирован!");
//     } catch (error) {
//       console.error("Ошибка генерации текста:", error);
//       toast.error("Ошибка при генерации текста.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center space-x-2">
//       <button
//         onClick={() => editor.chain().focus().toggleHighlight().run()}
//         className={`flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition ${
//           editor.isActive("highlight") ? "bg-yellow-200" : ""
//         }`}
//         title="Highlight"
//       >
//         <Highlighter className="w-4 h-4" />
//       </button>
//       <button
//         onClick={addLink}
//         className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition"
//         title="Add Link"
//       >
//         <Link className="w-4 h-4" />
//       </button>
//       <button
//         onClick={handleGenerateText}
//         disabled={loading}
//         className={`flex items-center justify-center px-3 py-1 rounded-md hover:bg-gray-100 transition ${
//           loading ? "opacity-50 cursor-not-allowed" : ""
//         }`}
//         title="Generate Text"
//       >
//         {loading ? "..." : <Wand className="w-4 h-4" />}
//       </button>
//     </div>
//   );
// };

// export default ActionsTools;

import { FC, useState } from "react";
import { Wand, Highlighter, Link } from "lucide-react";
import { Editor as TiptapEditor } from "@tiptap/react";
import { toast } from "react-toastify";

interface ActionsToolsProps {
  editor: TiptapEditor | null;
  onGenerateText: (text: string) => Promise<string>;
}

const ActionsTools: FC<ActionsToolsProps> = ({ editor, onGenerateText }) => {
  const [loading, setLoading] = useState(false);

  if (!editor) return null;

  const addLink = () => {
    const url = prompt("Введите URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleGenerateText = async () => {
    if (!editor) return;

    const selectedText = editor.getText();
    if (!selectedText.trim()) {
      toast.error("Выделите текст для генерации.");
      return;
    }

    setLoading(true);
    try {
      const generatedContent = await onGenerateText(selectedText);

      if (!generatedContent) {
        toast.error("Генерация текста не удалась. Попробуйте снова.");
        return;
      }

      let currentText = "";
      const existingContent = editor.getHTML(); // Получаем текущий HTML контент

      for (let i = 0; i < generatedContent.length; i++) {
        currentText += generatedContent[i];

        // Обновляем контент редактора без замены всей структуры
        editor.commands.setContent(`${existingContent}${currentText}`);
        await new Promise((resolve) => setTimeout(resolve, 1)); // Задержка 50мс
      }

      toast.success("Текст успешно сгенерирован!");
    } catch (error) {
      console.error("Ошибка генерации текста:", error);
      toast.error("Ошибка при генерации текста.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition ${
          editor.isActive("highlight") ? "bg-yellow-200" : ""
        }`}
        title="Highlight"
      >
        <Highlighter className="w-4 h-4" />
      </button>
      <button
        onClick={addLink}
        className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition"
        title="Add Link"
      >
        <Link className="w-4 h-4" />
      </button>
      <button
        onClick={handleGenerateText}
        disabled={loading}
        className={`flex items-center justify-center px-3 py-1 rounded-md hover:bg-gray-100 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title="Generate Text"
      >
        {loading ? "..." : <Wand className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default ActionsTools;
