import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Focus from "@tiptap/extension-focus";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import { all, createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import css from "highlight.js/lib/languages/css";
import java from "highlight.js/lib/languages/java";
import rust from "highlight.js/lib/languages/rust";
import python from "highlight.js/lib/languages/python";

const lowlight = createLowlight(all);
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("css", css);
lowlight.register("java", java);
lowlight.register("rust", rust);
lowlight.register("python", python);

const configureExtensions = () => [
  Document,
  Paragraph,
  Text,
  Bold,
  Italic,
  Underline,
  Superscript,
  Subscript,
  Highlight,
  TextStyle,
  Color,
  Heading.configure({
    levels: [1, 2, 3],
  }),
  BulletList,
  OrderedList,
  ListItem,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Blockquote,
  HorizontalRule,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Placeholder.configure({
    placeholder: "Начните писать здесь...",
  }),
  Link,
  Image,
  CodeBlockLowlight.configure({
    lowlight,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  FontFamily.configure(),
  Focus.configure({
    mode: "all",
  }),
];

export default configureExtensions;
