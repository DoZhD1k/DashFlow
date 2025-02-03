import { FC } from "react";
import { Editor as TiptapEditor } from "@tiptap/react";
import HeadingSelector from "./HeadingSelector";
import AlignmentSelector from "./AlignmentSelector";
import TextStyles from "./TextStyles";
import InsertTools from "./InsertTools";
import ActionsTools from "./ActionsTools";
import ExportPDFButton from "./ExportPDF";

interface ToolsProps {
  editor: TiptapEditor | null;
  onGenerateText: (text: string) => Promise<string>;
}

const Tools: FC<ToolsProps> = ({ editor, onGenerateText }) => {
  return (
    <div className="flex flex-wrap items-center space-x-4 bg-white dark:bg-stone-700 p-2 rounded shadow border">
      <HeadingSelector editor={editor} />
      <AlignmentSelector editor={editor} />
      <div className="w-px h-8 bg-gray-300 dark:bg-stone-500 mx-2"></div>
      <TextStyles editor={editor} />
      <div className="w-px h-8 bg-gray-300 dark:bg-stone-500 mx-2"></div>
      <InsertTools editor={editor} />
      <div className="w-px h-8 bg-gray-300 dark:bg-stone-500 mx-2"></div>
      <ActionsTools editor={editor} onGenerateText={onGenerateText} />
      <div className="w-px h-8 bg-gray-300 dark:bg-stone-500 mx-2"></div>
      <ExportPDFButton editor={editor} />
    </div>
  );
};

export default Tools;
