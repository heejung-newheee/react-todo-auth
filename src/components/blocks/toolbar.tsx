import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useCallback, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "../ui/Button";

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      // Check if link
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = (
    format: "bold" | "italic" | "underline" | "strikethrough"
  ) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatAlignment = (
    alignment: "left" | "center" | "right" | "justify"
  ) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  const insertLink = () => {
    if (!isLink) {
      const url = prompt("URL을 입력하세요:");
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  };

  const insertList = (type: "bullet" | "number") => {
    if (type === "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  return (
    <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/50">
      <Button
        variant={isBold ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText("bold")}
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={isItalic ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText("italic")}
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={isUnderline ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText("underline")}
        className="h-8 w-8 p-0"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant={isStrikethrough ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText("strikethrough")}
        className="h-8 w-8 p-0"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatAlignment("left")}
        className="h-8 w-8 p-0"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatAlignment("center")}
        className="h-8 w-8 p-0"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatAlignment("right")}
        className="h-8 w-8 p-0"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatAlignment("justify")}
        className="h-8 w-8 p-0"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => insertList("bullet")}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => insertList("number")}
        className="h-8 w-8 p-0"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-border mx-1" />

      <Button
        variant={isLink ? "default" : "ghost"}
        size="sm"
        onClick={insertLink}
        className="h-8 w-8 p-0"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
