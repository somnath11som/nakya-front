import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";

// Icons
import { FaBold, FaItalic, FaUnderline, FaListUl, FaAlignLeft, FaAlignCenter, FaAlignRight, FaHeading } from "react-icons/fa";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-2  p-2 border-b border-gray-600">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-700 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-700" : ""}`}
        title="Toggle Heading"
      >
        <FaHeading />
      </button>
      <div className="w-px bg-gray-600 mx-1" />
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-gray-700 ${editor.isActive("bold") ? "bg-gray-700" : ""}`} title="Bold">
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-700 ${editor.isActive("italic") ? "bg-gray-700" : ""}`}
        title="Italic"
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-700 ${editor.isActive("underline") ? "bg-gray-700" : ""}`}
        title="Underline"
      >
        <FaUnderline />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-700 ${editor.isActive("bulletList") ? "bg-gray-700" : ""}`}
        title="Bullet List"
      >
        <FaListUl />
      </button>
      <div className="w-px bg-gray-600 mx-1" />
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded hover:bg-gray-700 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-700" : ""}`}
        title="Align Left"
      >
        <FaAlignLeft />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded hover:bg-gray-700 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-700" : ""}`}
        title="Align Center"
      >
        <FaAlignCenter />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded hover:bg-gray-700 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-700" : ""}`}
        title="Align Right"
      >
        <FaAlignRight />
      </button>
    </div>
  );
};

const TiptapEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["paragraph", "heading"],
      }),
      BulletList,
      ListItem,
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "prose max-w-none p-1 text-black [&_*]:text-black [&_h1]:text-sm [&_h1]:text-[#818181] [&_h1]:font-normal [&_h1]:mb-1 [&_p]:leading-[1.2] [&_li]:leading-[1.2] [&_ul]:space-y-0.5",
      },
    },
    onCreate: ({ editor }) => {
      if (!content) {
        editor.commands.setContent('<h5 class="text-gray-400">Enter Description here...</h5><p></p>');
      }
    },
    onFocus: ({ editor }) => {
      const currentContent = editor.getHTML();
      if (currentContent.includes("Enter Description here...")) {
        editor.commands.setContent("<p></p>");
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="bg-white rounded-lg border border-gray-600 text-black">
      <MenuBar editor={editor} />
      <div className="max-h-[200px] overflow-auto overflow-x-auto [&_.ProseMirror_p]:leading-[1.2] [&_.ProseMirror_li]:leading-[1.2] [&_.ProseMirror_ul]:space-y-0.5 [&_.ProseMirror_h1]:text-sm [&_.ProseMirror_h1]:text-[#818181] [&_.ProseMirror_h1]:font-normal">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
