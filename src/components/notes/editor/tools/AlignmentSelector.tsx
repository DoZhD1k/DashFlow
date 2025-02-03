import { FC, useState, useRef, useEffect } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Editor as TiptapEditor } from "@tiptap/react";

interface AlignmentSelectorProps {
  editor: TiptapEditor | null;
}

const AlignmentSelector: FC<AlignmentSelectorProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAlignmentChange = (alignment: "left" | "center" | "right") => {
    editor?.chain().focus().setTextAlign(alignment).run();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!editor) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-8 rounded-md hover:bg-gray-100 transition dark:text-white"
        title="Text Alignment"
      >
        {editor.isActive({ textAlign: "left" }) ? (
          <AlignLeft className="w-4 h-4" />
        ) : editor.isActive({ textAlign: "center" }) ? (
          <AlignCenter className="w-4 h-4" />
        ) : editor.isActive({ textAlign: "right" }) ? (
          <AlignRight className="w-4 h-4" />
        ) : (
          <AlignLeft className="w-4 h-4" />
        )}
        {isOpen ? (
          <ChevronUp className="w-4 h-4 ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        )}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 left-0 bg-white dark:bg-stone-700 shadow-md rounded-md border border-gray-300 dark:border-stone-600 p-2 w-40">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            ALIGNMENT
          </p>
          {["left", "center", "right"].map((alignment) => (
            <button
              key={alignment}
              onClick={() =>
                handleAlignmentChange(alignment as "left" | "center" | "right")
              }
              className={`flex items-center w-full px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-stone-600 transition ${
                editor.isActive({ textAlign: alignment })
                  ? "bg-gray-200 dark:bg-stone-500"
                  : ""
              }`}
            >
              {alignment === "left" ? (
                <AlignLeft className="w-4 h-4 mr-2" />
              ) : alignment === "center" ? (
                <AlignCenter className="w-4 h-4 mr-2" />
              ) : (
                <AlignRight className="w-4 h-4 mr-2" />
              )}
              Align {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlignmentSelector;
