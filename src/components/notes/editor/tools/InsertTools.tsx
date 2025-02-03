import { FC } from "react";
import {
  Code,
  SquareSplitVertical,
  ListChecks,
  ListOrdered,
  List,
  Quote,
} from "lucide-react";
import { Editor as TiptapEditor } from "@tiptap/react";
import TableTools from "./TableTools";

interface InsertToolsProps {
  editor: TiptapEditor | null;
}

const InsertTools: FC<InsertToolsProps> = ({ editor }) => {
  if (!editor) return null;

  const toggleTaskList = () => {
    editor.chain().focus().toggleTaskList().run();
  };

  const toggleBlockquote = () => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .toggleBlockquote() // Вставляем блок цитаты
      .insertContent("<p></p>") // Вставляем пустую строку (параграф)
      .run();
  };

  const toggleCodeBlock = () => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .toggleCodeBlock() // Вставляем блок кода
      .insertContent("<p></p>") // Вставляем пустую строку (параграф)
      .run();
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition ${
          editor.isActive("bulletList") ? "bg-gray-200" : ""
        }`}
        title="Маркированный список"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition ${
          editor.isActive("orderedList") ? "bg-gray-200" : ""
        }`}
        title="Нумерованный список"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={toggleTaskList}
        className={`flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition ${
          editor.isActive("taskList") ? "bg-gray-200" : ""
        }`}
        title="Список задач"
      >
        <ListChecks className="w-4 h-4" />
      </button>
      <button
        onClick={toggleBlockquote}
        className={`flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition ${
          editor.isActive("blockquote") ? "bg-gray-200" : ""
        }`}
        title="Блок цитаты"
      >
        <Quote className="w-4 h-4" />
      </button>
      <TableTools editor={editor} />
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition"
        title="Горизонтальная линия"
      >
        <SquareSplitVertical className="w-4 h-4" />
      </button>
      <button
        onClick={toggleCodeBlock}
        className={`flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition ${
          editor.isActive("codeBlock") ? "bg-gray-200" : ""
        }`}
        title="Код"
      >
        <Code className="w-4 h-4" />
      </button>
    </div>
  );
};

export default InsertTools;
