import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { getMarkdownContent } from '../../editor/markdown-serializer';
import { PageBreak } from '../../editor/page-break-extension';
import { Button } from '../ui';

interface TiptapEditorProps {
  content?: string;
  onUpdate?: (content: string) => void;
  placeholder?: string;
}

function TiptapEditor({
  content = '',
  onUpdate,
  placeholder = 'Start writing your markdown...',
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      PageBreak,
    ],
    content,
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        // Get markdown content using custom serializer
        const markdown = getMarkdownContent(editor);
        onUpdate(markdown);
      }
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] max-w-none p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* Text formatting */}
        <Button
          size="sm"
          variant={editor.isActive('bold') ? 'primary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          type="button"
        >
          <strong>B</strong>
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('italic') ? 'primary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          type="button"
        >
          <em>I</em>
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('strike') ? 'primary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          type="button"
        >
          <s>S</s>
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('code') ? 'primary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleCode().run()}
          type="button"
        >
          {'</>'}
        </Button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Headings */}
        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 1 }) ? 'primary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          type="button"
        >
          H1
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'primary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          type="button"
        >
          H2
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 3 }) ? 'primary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          type="button"
        >
          H3
        </Button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Lists */}
        <Button
          size="sm"
          variant={editor.isActive('bulletList') ? 'primary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type="button"
        >
          • List
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('orderedList') ? 'primary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          type="button"
        >
          1. List
        </Button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Blocks */}
        <Button
          size="sm"
          variant={editor.isActive('blockquote') ? 'primary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          type="button"
        >
          Quote
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('codeBlock') ? 'primary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          type="button"
        >
          Code Block
        </Button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Horizontal rule */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          type="button"
        >
          ---
        </Button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Page break */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().setPageBreak().run()}
          type="button"
          title="Insert page break (Cmd/Ctrl+Enter)"
        >
          📄 Break
        </Button>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  );
}

export default TiptapEditor;
