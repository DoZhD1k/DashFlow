import { FC } from "react";
import { BubbleMenu, Editor as TiptapEditor } from "@tiptap/react";
import Tools from "./tools/Tools";

interface BubbleMenuProps {
  editor: TiptapEditor | null;
  onGenerateText: (text: string) => Promise<string>;
}

const BubbleMenuComponent: FC<BubbleMenuProps> = ({
  editor,
  onGenerateText,
}) => {
  if (!editor) return null;

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <Tools editor={editor} onGenerateText={onGenerateText} />
    </BubbleMenu>
  );
};

export default BubbleMenuComponent;
