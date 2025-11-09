import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { marked } from 'marked';
import { useEffect, useRef, useState } from 'react';
import { Image } from '../../editor/image-extension';
import { getMarkdownContent } from '../../editor/markdown-serializer';
import { PageBreak } from '../../editor/page-break-extension';
import { Button } from '../ui';

interface TiptapEditorProps {
  content?: string;
  onUpdate?: (content: string) => void;
  placeholder?: string;
  projectId?: string; // Required for image uploads
}

// Common emojis grouped by category
const EMOJI_CATEGORIES = {
  Smileys: [
    '😀',
    '😃',
    '😄',
    '😁',
    '😅',
    '😂',
    '🤣',
    '😊',
    '😇',
    '🙂',
    '🙃',
    '😉',
    '😌',
    '😍',
    '🥰',
    '😘',
  ],
  Gestures: [
    '👍',
    '👎',
    '👌',
    '✌️',
    '🤞',
    '🤟',
    '🤘',
    '🤙',
    '👈',
    '👉',
    '👆',
    '👇',
    '☝️',
    '✋',
    '🤚',
    '🖐️',
  ],
  Objects: [
    '💼',
    '📁',
    '📂',
    '📄',
    '📝',
    '📊',
    '📈',
    '📉',
    '🗂️',
    '📅',
    '📆',
    '🗓️',
    '📇',
    '🗃️',
    '📋',
    '📌',
  ],
  Symbols: [
    '❤️',
    '💯',
    '✅',
    '❌',
    '⭐',
    '🔥',
    '💡',
    '⚡',
    '🎯',
    '🚀',
    '💪',
    '🎉',
    '🎊',
    '✨',
    '💥',
    '⚠️',
  ],
};

function TiptapEditor({
  content = '',
  onUpdate,
  placeholder = 'Start writing your markdown...',
  projectId,
}: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmojiPicker]);

  // Handle image file upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor || !projectId) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      console.error('File is not an image');
      return;
    }

    try {
      // Read file as data URL
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;

        // Save image to project assets folder
        const response = await window.electronAPI.file.saveImage({
          projectId,
          imageDataUrl: dataUrl,
          fileName: file.name,
        });

        if (response.success) {
          // Insert image into editor using relative path
          console.log('✅ Image saved to:', response.data.relativePath);
          editor.chain().focus().setImage({ src: response.data.relativePath }).run();
        } else {
          console.error('❌ Failed to save image:', response.error);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const extensions = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
    }),
    Placeholder.configure({
      placeholder,
    }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    PageBreak,
    Image.configure({
      inline: false,
      allowBase64: true, // Allow base64 data URLs for displaying loaded images
    }),
  ];

  const editor = useEditor({
    extensions,
    content: '', // Start empty, will set content after mount
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        // Get markdown content using custom serializer
        const markdown = getMarkdownContent(editor);
        console.log('🔄 Editor serialized content (first 500 chars):', markdown.substring(0, 500));
        onUpdate(markdown);
      }
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] max-w-none p-4',
      },
      handlePaste: (view, event) => {
        // Handle pasted images
        const items = event.clipboardData?.items;
        if (!items || !projectId) return false;

        for (const item of Array.from(items)) {
          if (item.type.startsWith('image/')) {
            event.preventDefault();

            const file = item.getAsFile();
            if (!file) continue;

            // Read file as data URL
            const reader = new FileReader();
            reader.onload = async (e) => {
              const dataUrl = e.target?.result as string;

              // Save image to project assets folder
              const response = await window.electronAPI.file.saveImage({
                projectId,
                imageDataUrl: dataUrl,
                fileName: file.name || 'pasted-image.png',
              });

              if (response.success) {
                console.log('✅ Pasted image saved to:', response.data.relativePath);
                // Insert image into editor using relative path
                view.dispatch(
                  view.state.tr.replaceSelectionWith(
                    view.state.schema.nodes.image.create({
                      src: response.data.relativePath,
                    })
                  )
                );
              } else {
                console.error('❌ Failed to save pasted image:', response.error);
              }
            };

            reader.readAsDataURL(file);
            return true; // Handled
          }
        }

        return false; // Not handled, let default paste behavior proceed
      },
    },
  });

  // Set projectId on window for ImageNodeView to access
  useEffect(() => {
    if (projectId) {
      (
        window as unknown as { __inkforge_current_project_id__?: string }
      ).__inkforge_current_project_id__ = projectId;
    }
    return () => {
      (
        window as unknown as { __inkforge_current_project_id__?: string }
      ).__inkforge_current_project_id__ = undefined;
    };
  }, [projectId]);

  // Convert markdown to HTML and set editor content on initial load
  useEffect(() => {
    if (editor && content && !editor.state.doc.textContent) {
      // Only set content if editor is empty (initial load)
      const loadContent = async () => {
        try {
          // Replace custom page break markers with HTML that Tiptap can parse
          const processedContent = content.replace(
            /---PAGE_BREAK---/g,
            '<div data-type="page-break"><hr data-page-break="true"></div>'
          );

          const html = await marked.parse(processedContent);
          // Set content without adding to history or triggering update
          // Images will keep their relative paths (assets/...)
          editor.commands.setContent(html, { emitUpdate: false });
        } catch (error) {
          console.error('Error loading content:', error);
        }
      };

      loadContent();
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar - Sticky */}
      <div className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1 shadow-sm">
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
        <Button
          size="sm"
          variant={editor.isActive('paragraph') ? 'primary' : 'ghost'}
          onClick={() => editor.chain().focus().setParagraph().run()}
          type="button"
          title="Convert to paragraph"
        >
          ¶
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
        <Button
          size="sm"
          variant={editor.isActive('taskList') ? 'primary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          type="button"
        >
          ☐ Tasks
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

        <div className="w-px bg-gray-300 mx-1" />

        {/* Table controls */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          type="button"
          title="Insert table"
        >
          📊 Table
        </Button>
        {editor.isActive('table') && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              type="button"
              title="Add column before"
            >
              ⬅️ Col
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              type="button"
              title="Add column after"
            >
              ➡️ Col
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              type="button"
              title="Delete column"
            >
              ❌ Col
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              type="button"
              title="Add row before"
            >
              ⬆️ Row
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              type="button"
              title="Add row after"
            >
              ⬇️ Row
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().deleteRow().run()}
              type="button"
              title="Delete row"
            >
              ❌ Row
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().deleteTable().run()}
              type="button"
              title="Delete table"
            >
              🗑️ Table
            </Button>
          </>
        )}

        <div className="w-px bg-gray-300 mx-1" />

        {/* Emoji picker */}
        <div className="relative" ref={emojiPickerRef}>
          <Button
            size="sm"
            variant={showEmojiPicker ? 'primary' : 'ghost'}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            type="button"
            title="Insert emoji"
          >
            😀 Emoji
          </Button>
          {showEmojiPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50 w-80 max-h-64 overflow-y-auto">
              {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                <div key={category} className="mb-3">
                  <div className="text-xs font-semibold text-gray-600 mb-1 px-1">{category}</div>
                  <div className="flex flex-wrap gap-1">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                        onClick={() => {
                          editor?.chain().focus().insertContent(emoji).run();
                          setShowEmojiPicker(false);
                        }}
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Image upload */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          type="button"
          title="Insert image"
          disabled={!projectId}
        >
          🖼️ Image
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Editor content - Scrollable */}
      <div className="flex-1 overflow-auto border border-gray-300 rounded-b-lg bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default TiptapEditor;
