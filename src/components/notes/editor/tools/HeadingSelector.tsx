import { FC, useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { Editor as TiptapEditor } from "@tiptap/react";

interface HeadingSelectorProps {
  editor: TiptapEditor | null;
}

const HeadingSelector: FC<HeadingSelectorProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleHeading = (level: 1 | 2 | 3 | null) => {
    if (level) {
      editor?.chain().focus().toggleHeading({ level }).run();
    } else {
      editor?.chain().focus().setParagraph().run();
    }
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
        title="Hierarchy"
      >
        {editor.isActive("heading", { level: 1 })
          ? "H1"
          : editor.isActive("heading", { level: 2 })
          ? "H2"
          : editor.isActive("heading", { level: 3 })
          ? "H3"
          : "¶"}
        {isOpen ? (
          <ChevronUp className="w-4 h-4 ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        )}
      </button>
      {isOpen && (
        <div className="absolute z-10 top-10 left-0 bg-white dark:bg-stone-700 shadow-md rounded-md border border-gray-300 dark:border-stone-600 p-2 w-40">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            HIERARCHY
          </p>
          <button
            onClick={() => toggleHeading(null)}
            className={`flex items-center w-full px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-stone-600 transition ${
              editor.isActive("paragraph")
                ? "bg-gray-200 dark:bg-stone-500"
                : ""
            }`}
          >
            <Pilcrow className="w-4 h-4 mr-2" />
            Paragraph
          </button>
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() => toggleHeading(level as 1 | 2 | 3)}
              className={`flex items-center w-full px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-stone-600 transition ${
                editor.isActive("heading", { level })
                  ? "bg-gray-200 dark:bg-stone-500"
                  : ""
              }`}
            >
              {level === 1 ? (
                <Heading1 className="w-4 h-4 mr-2" />
              ) : level === 2 ? (
                <Heading2 className="w-4 h-4 mr-2" />
              ) : (
                <Heading3 className="w-4 h-4 mr-2" />
              )}
              Heading {level}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeadingSelector;
