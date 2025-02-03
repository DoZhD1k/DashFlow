import { FC } from "react";
import { Bold, Italic, Underline } from "lucide-react";
import { Editor as TiptapEditor } from "@tiptap/react";

interface TextStylesProps {
  editor: TiptapEditor | null;
}

const TextStyles: FC<TextStylesProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition ${
          editor.isActive("bold") ? "bg-gray-200 font-bold" : ""
        }`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition ${
          editor.isActive("italic") ? "bg-gray-200 italic" : ""
        }`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition ${
          editor.isActive("underline") ? "bg-gray-200 underline" : ""
        }`}
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TextStyles;
