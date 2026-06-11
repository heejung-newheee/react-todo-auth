"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import type { EditorState, SerializedEditorState } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { Toolbar } from "./toolbar";

const theme = {
  paragraph: "mb-1",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
  },
  heading: {
    h1: "text-4xl font-bold mb-4",
    h2: "text-3xl font-bold mb-3",
    h3: "text-2xl font-bold mb-2",
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
};

function onError(error: Error) {
  console.error(error);
}

interface EditorStateLoaderProps {
  editorSerializedState?: SerializedEditorState;
}

function EditorStateLoader({ editorSerializedState }: EditorStateLoaderProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (editorSerializedState) {
      const initialEditorState = editor.parseEditorState(editorSerializedState);
      editor.setEditorState(initialEditorState);
    }
  }, [editor, editorSerializedState]);

  return null;
}

interface EditorProps {
  editorSerializedState?: SerializedEditorState;
  onSerializedChange?: (editorState: SerializedEditorState) => void;
}

export function Editor({
  editorSerializedState,
  onSerializedChange,
}: EditorProps) {
  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative rounded-lg border bg-background overflow-hidden">
        <Toolbar />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[400px] p-4 outline-none" />
          }
          placeholder={
            <div className="pointer-events-none absolute left-4 top-14 text-muted-foreground">
              내용을 입력하세요...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        {editorSerializedState && (
          <EditorStateLoader editorSerializedState={editorSerializedState} />
        )}
        {onSerializedChange && (
          <OnChangePlugin
            onChange={(editorState: EditorState) => {
              onSerializedChange(editorState.toJSON());
            }}
          />
        )}
      </div>
    </LexicalComposer>
  );
}
