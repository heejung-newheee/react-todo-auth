import type { EditorThemeClasses } from "lexical";

export const editorTheme: EditorThemeClasses = {
  paragraph: "mb-1",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-gray-100 rounded px-1 py-0.5 font-mono text-sm",
  },
  heading: {
    h1: "text-4xl font-bold mb-4",
    h2: "text-3xl font-bold mb-3",
    h3: "text-2xl font-bold mb-2",
    h4: "text-xl font-bold mb-2",
    h5: "text-lg font-bold mb-1",
  },
  list: {
    listitem: "ml-8",
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal",
    ul: "list-disc",
  },
  link: "text-blue-600 underline hover:text-blue-800",
  code: "bg-gray-900 text-gray-100 p-4 rounded block font-mono text-sm my-2",
  quote: "border-l-4 border-gray-300 pl-4 italic my-2",
};
