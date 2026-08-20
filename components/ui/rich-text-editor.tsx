"use client";

import { EditorContent, useEditor, Extension } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEffect, useState, useRef } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Strikethrough,
  Underline as UnderlineIcon,
  Code,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Type,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Custom FontSize extension
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write something...",
  className,
}: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:pointer-events-none before:h-0 before:block before:text-start before:text-muted-foreground before:content-[attr(data-placeholder)]",
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[140px] w-full border-0 bg-white px-3 py-2 text-start text-sm outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Sync editor content when value changes from outside
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  // Handle click outside color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showColorPicker]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg border border-border",
        className,
      )}
    >
      <div className="flex flex-wrap gap-1 border-b border-border bg-primary/10 p-2">
        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <Undo className="size-3 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <Redo className="size-3 text-muted-foreground" />
        </Button>

        <div className="w-px bg-border mx-1" />

        {/* Text Formatting */}
        <Button
          type="button"
          variant={editor.isActive("bold") ? "default" : "ghost"}
          size="xs"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <Bold className="size-3 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="xs"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <Italic className="size-3 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("underline") ? "default" : "ghost"}
          size="xs"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <UnderlineIcon className="size-3 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("strike") ? "default" : "ghost"}
          size="xs"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <Strikethrough className="size-3 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("code") ? "default" : "ghost"}
          size="xs"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <Code className="size-3 text-muted-foreground" />
        </Button>

        <div className="w-px bg-border mx-1" />

        {/* Font Size */}
        <Select
          value={editor.getAttributes("textStyle").fontSize || "16px"}
          onValueChange={(size) => {
            if (size === "default") {
              editor.chain().focus().unsetFontSize().run();
            } else {
              editor.chain().focus().setFontSize(size).run();
            }
          }}
        >
          <SelectTrigger className="h-8 w-20 text-xs">
            <Type className="size-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="12px">12px</SelectItem>
            <SelectItem value="14px">14px</SelectItem>
            <SelectItem value="16px">16px</SelectItem>
            <SelectItem value="18px">18px</SelectItem>
            <SelectItem value="20px">20px</SelectItem>
            <SelectItem value="24px">24px</SelectItem>
            <SelectItem value="28px">28px</SelectItem>
            <SelectItem value="32px">32px</SelectItem>
            <SelectItem value="36px">36px</SelectItem>
          </SelectContent>
        </Select>

        {/* Color Picker */}
        <div className="relative" ref={colorPickerRef}>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="h-8 w-8 p-0 text-foreground"
          >
            <Palette className="size-3 text-muted-foreground" />
          </Button>
          {showColorPicker && (
            <div className="absolute top-10 left-0 z-50 bg-white border border-border rounded-lg shadow-lg p-3">
              <div className="grid grid-cols-6 gap-1.5 mb-2">
                {[
                  "#000000",
                  "#4B5563",
                  "#6B7280",
                  "#9CA3AF",
                  "#D1D5DB",
                  "#FFFFFF",
                  "#EF4444",
                  "#F97316",
                  "#F59E0B",
                  "#EAB308",
                  "#84CC16",
                  "#22C55E",
                  "#10B981",
                  "#14B8A6",
                  "#06B6D4",
                  "#0EA5E9",
                  "#3B82F6",
                  "#6366F1",
                  "#8B5CF6",
                  "#A855F7",
                  "#D946EF",
                  "#EC4899",
                  "#F43F5E",
                  "#DC2626",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="w-full text-xs"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
              >
                Reset Color
              </Button>
            </div>
          )}
        </div>

        <div className="w-px bg-border mx-1" />

        {/* Headings */}
        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 2 }) ? "default" : "ghost"
          }
          size="xs"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="h-8 w-8 p-0 text-foreground"
        >
          <Heading2 className="size-3 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 3 }) ? "default" : "ghost"
          }
          size="xs"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className="h-8 w-8 p-0 text-foreground"
        >
          <Heading3 className="size-3 text-muted-foreground" />
        </Button>

        <div className="w-px bg-border mx-1" />

        {/* Lists and Quotes */}
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "default" : "ghost"}
          size="xs"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <List className="size-3 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          size="xs"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <ListOrdered className="size-3 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("blockquote") ? "default" : "ghost"}
          size="xs"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <Quote className="size-3 text-muted-foreground" />
        </Button>

        <div className="w-px bg-border mx-1" />

        {/* Alignment */}
        <Button
          type="button"
          variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"}
          size="xs"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <AlignLeft className="size-3 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "center" }) ? "default" : "ghost"
          }
          size="xs"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <AlignCenter className="size-3 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "right" }) ? "default" : "ghost"
          }
          size="xs"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <AlignRight className="size-3 text-muted-foreground" />
        </Button>

        <div className="w-px bg-border mx-1" />

        {/* Horizontal Rule */}
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="h-8 w-8 p-0 text-foreground"
        >
          <Minus className="size-3 text-muted-foreground" />
        </Button>
      </div>

      <div className="bg-white">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none 
          [&_.ProseMirror]:min-h-28 
          [&_.ProseMirror]:border-0 
          [&_.ProseMirror]:outline-none 
          [&_.ProseMirror]:bg-white
          [&_.ProseMirror_ul]:list-disc 
          [&_.ProseMirror_ul]:pl-6 
          [&_.ProseMirror_ul]:my-2
          [&_.ProseMirror_ol]:list-decimal 
          [&_.ProseMirror_ol]:pl-6 
          [&_.ProseMirror_ol]:my-2
          [&_.ProseMirror_li]:my-1
          [&_.ProseMirror_blockquote]:border-l-4
          [&_.ProseMirror_blockquote]:border-gray-300
          [&_.ProseMirror_blockquote]:pl-4
          [&_.ProseMirror_blockquote]:italic
          [&_.ProseMirror_blockquote]:my-2
          [&_.ProseMirror_h2]:text-2xl
          [&_.ProseMirror_h2]:font-bold
          [&_.ProseMirror_h2]:mt-4
          [&_.ProseMirror_h2]:mb-2
          [&_.ProseMirror_h3]:text-xl
          [&_.ProseMirror_h3]:font-bold
          [&_.ProseMirror_h3]:mt-3
          [&_.ProseMirror_h3]:mb-2
          [&_.ProseMirror_code]:bg-gray-100
          [&_.ProseMirror_code]:px-1
          [&_.ProseMirror_code]:py-0.5
          [&_.ProseMirror_code]:rounded
          [&_.ProseMirror_code]:text-sm
          [&_.ProseMirror_hr]:border-t
          [&_.ProseMirror_hr]:border-gray-300
          [&_.ProseMirror_hr]:my-4"
        />
      </div>
    </div>
  );
}
