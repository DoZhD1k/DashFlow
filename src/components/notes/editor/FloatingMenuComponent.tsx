import { FC } from "react";
import { FloatingMenu, Editor as TiptapEditor } from "@tiptap/react";
import Tools from "./tools/Tools";

interface FloatingMenuProps {
  editor: TiptapEditor | null;
  onGenerateText: (text: string) => Promise<string>;
}

const FloatingMenuComponent: FC<FloatingMenuProps> = ({
  editor,
  onGenerateText,
}) => {
  if (!editor) return null;

  return (
    <FloatingMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      shouldShow={({ state }) => {
        const { $from } = state.selection;
        return $from.depth === 1 && $from.parent.content.size === 0;
      }}
    >
      <Tools editor={editor} onGenerateText={onGenerateText} />
    </FloatingMenu>
  );
};

export default FloatingMenuComponent;
