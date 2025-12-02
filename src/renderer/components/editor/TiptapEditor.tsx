import { Extension } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Code,
  FileCode,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Pilcrow,
  Quote,
  SeparatorHorizontal,
  Smile,
  Strikethrough,
  Table as TableIcon,
  Trash2,
  X,
} from 'lucide-react';
import { marked } from 'marked';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image } from '../../editor/image-extension';
import { getMarkdownContent } from '../../editor/markdown-serializer';
import { MermaidDiagram } from '../../editor/mermaid-extension';
import { PageBreak } from '../../editor/page-break-extension';
import { DiagramIcon } from '../icons/DiagramIcon';
import { Button } from '../ui';
import { MermaidModal } from './MermaidModal';

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
  const [mermaidModalOpen, setMermaidModalOpen] = useState(false);
  const [editingDiagramId, setEditingDiagramId] = useState<string | undefined>();
  const [editingDiagramCode, setEditingDiagramCode] = useState<string>('');
  const [editingDiagramCaption, setEditingDiagramCaption] = useState<string>('');

  // Configure marked to render mermaid code blocks as custom elements
  marked.use({
    renderer: {
      code(token: { text: string; lang?: string; escaped?: boolean }) {
        // Check if this is a mermaid diagram
        if (token.lang === 'mermaid') {
          // Generate a unique ID for the diagram
          const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          // Escape quotes in the code
          const escapedCode = token.text.replace(/"/g, '&quot;').replace(/\n/g, '&#10;');
          // Return custom HTML that our MermaidDiagram extension can parse
          return `<div data-type="mermaidDiagram" data-code="${escapedCode}" data-id="${id}"></div>`;
        }
        // For non-mermaid code blocks, return false to use default rendering
        return false;
      },
    },
  });

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

  const handleOpenMermaidModal = (
    diagramId?: string,
    currentCode?: string,
    currentCaption?: string
  ) => {
    setEditingDiagramId(diagramId);
    setEditingDiagramCode(currentCode || '');
    setEditingDiagramCaption(currentCaption || '');
    setMermaidModalOpen(true);
  };

  const handleSaveMermaidDiagram = async (code: string, caption?: string) => {
    console.log('📝 TiptapEditor: handleSaveMermaidDiagram called');
    console.log('   - code length:', code.length);
    console.log('   - caption:', caption);
    console.log('   - editingDiagramId:', editingDiagramId);

    // Generate and save PNG
    let imagePath: string | undefined;

    try {
      console.log('🔍 Checking prerequisites...');
      console.log('   - projectId:', projectId);
      console.log('   - window.electronAPI exists:', !!window.electronAPI);
      console.log('   - window.electronAPI.pdf exists:', !!(window.electronAPI as any)?.pdf);

      if (projectId && window.electronAPI) {
        console.log('🎨 Generating PNG for diagram...');

        // Import mermaid and render to SVG
        const mermaid = (await import('mermaid')).default;

        // Initialize with transparent background
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            background: 'transparent',
          },
          securityLevel: 'strict',
        });

        const renderId = `mermaid-save-${editingDiagramId || 'new'}-${Date.now()}`;
        console.log('   - Rendering SVG with ID:', renderId);
        const { svg } = await mermaid.render(renderId, code);
        console.log('   - SVG rendered, length:', svg.length);

        // Convert SVG to PNG
        console.log('   - Converting SVG to PNG...');
        const pngDataUrl = await svgToPngDataUrl(svg, 2000);
        console.log('   - PNG data URL generated, length:', pngDataUrl.length);

        // Save PNG via IPC
        console.log('   - Saving PNG via IPC...');
        const response = await window.electronAPI.pdf.saveMermaidImage({
          projectId,
          diagramCode: code,
          imageDataUrl: pngDataUrl,
        });
        console.log('   - IPC response:', response);

        if (response.success && response.data?.filePath) {
          console.log('✅ PNG saved to:', response.data.filePath);
          console.log('✅ Using data URL for imagePath, length:', pngDataUrl.length);
          imagePath = pngDataUrl;
        } else {
          console.error('❌ PNG save failed, response:', response);
        }
      } else {
        console.warn('⚠️ Skipping PNG generation - missing prerequisites');
      }
    } catch (err) {
      console.error('❌ Failed to generate PNG:', err);
      // Continue without imagePath
    }

    console.log(
      '   - Final imagePath:',
      imagePath ? `present (${imagePath.length} chars)` : 'undefined'
    );

    if (editingDiagramId) {
      // Update existing diagram
      console.log('🔄 Updating existing diagram:', editingDiagramId);
      editor?.commands.updateMermaidDiagram(editingDiagramId, code, caption, imagePath);
    } else {
      // Insert new diagram
      console.log('➕ Inserting new diagram');
      editor?.commands.insertMermaidDiagram(code, caption, imagePath);
    }
    setMermaidModalOpen(false);
    setEditingDiagramId(undefined);
    setEditingDiagramCode('');
    setEditingDiagramCaption('');
  };

  // Helper function to convert SVG to PNG
  const svgToPngDataUrl = useCallback((svg: string, maxWidth: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (!svgElement) {
        reject(new Error('Invalid SVG'));
        return;
      }

      const viewBox = svgElement.getAttribute('viewBox');
      let width = parseFloat(svgElement.getAttribute('width') || '0');
      let height = parseFloat(svgElement.getAttribute('height') || '0');

      if (!width || !height) {
        if (viewBox) {
          const parts = viewBox.split(' ');
          width = parseFloat(parts[2]);
          height = parseFloat(parts[3]);
        } else {
          width = 600;
          height = 400;
        }
      }

      const scale = maxWidth / width;
      const scaledWidth = Math.floor(width * scale);
      const scaledHeight = Math.floor(height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      const img = new window.Image();

      // Encode SVG as UTF-8 data URL (more reliable than base64 for large SVGs)
      const encodedSvg = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22');
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;

      img.onload = () => {
        // Keep transparent background (no fill)
        ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = () => {
        reject(new Error('Failed to load SVG'));
      };

      img.src = svgDataUrl;
    });
  }, []);

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
    MermaidDiagram.configure({
      draggable: true,
      onOpenModal: handleOpenMermaidModal,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right'],
      defaultAlignment: 'left',
    }),
    Extension.create({
      name: 'customAlignmentShortcuts',
      addKeyboardShortcuts() {
        return {
          'Mod-l': () => this.editor.commands.setTextAlign('left'),
          'Mod-e': () => this.editor.commands.setTextAlign('center'),
          'Mod-r': () => this.editor.commands.setTextAlign('right'),
        };
      },
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

  // Function to regenerate PNG images for mermaid diagrams without imagePath
  const regenerateMermaidImages = useCallback(async () => {
    if (!editor || !projectId) return;

    console.log('🔄 Regenerating mermaid diagram images...');

    const doc = editor.state.doc;
    const updates: { pos: number; attrs: Record<string, unknown> }[] = [];

    // Find all mermaid diagram nodes without imagePath
    doc.descendants((node, pos) => {
      if (node.type.name === 'mermaidDiagram' && !node.attrs.imagePath && node.attrs.code) {
        updates.push({ pos, attrs: node.attrs });
      }
    });

    console.log(`📊 Found ${updates.length} mermaid diagrams without images`);

    // Process each diagram
    for (const { pos, attrs } of updates) {
      try {
        const code = attrs.code as string;
        if (!code) continue;

        console.log(`🎨 Generating PNG for diagram at pos ${pos}...`);

        // Import mermaid and render to SVG
        const mermaid = (await import('mermaid')).default;

        // Initialize with transparent background
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            background: 'transparent',
          },
          securityLevel: 'strict',
        });

        const renderId = `mermaid-regen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(renderId, code);

        // Convert SVG to PNG
        const pngDataUrl = await svgToPngDataUrl(svg, 2000);

        // Save PNG via IPC
        const response = await window.electronAPI.pdf.saveMermaidImage({
          projectId,
          diagramCode: code,
          imageDataUrl: pngDataUrl,
        });

        if (response.success) {
          console.log(`✅ PNG saved for diagram at pos ${pos}`);

          // Update the node with imagePath
          editor.commands.command(({ tr }) => {
            tr.setNodeMarkup(pos, undefined, {
              ...attrs,
              imagePath: pngDataUrl,
            });
            return true;
          });
        }
      } catch (error) {
        console.error(`❌ Failed to regenerate image for diagram at pos ${pos}:`, error);
      }
    }

    console.log('✅ Finished regenerating mermaid images');
  }, [editor, projectId, svgToPngDataUrl]);

  // Set projectId on window for ImageNodeView to access
  useEffect(() => {
    if (projectId) {
      (
        window as unknown as { __inkpot_current_project_id__?: string }
      ).__inkpot_current_project_id__ = projectId;
    }
    return () => {
      (
        window as unknown as { __inkpot_current_project_id__?: string }
      ).__inkpot_current_project_id__ = undefined;
    };
  }, [projectId]);

  // Convert markdown to HTML and set editor content on initial load
  useEffect(() => {
    if (editor && content && !editor.state.doc.textContent) {
      // Only set content if editor is empty (initial load)
      const loadContent = async () => {
        try {
          // Replace custom page break markers with HTML that Tiptap can parse
          let processedContent = content.replace(
            /---PAGE_BREAK---/g,
            '<div data-type="page-break"><hr data-page-break="true"></div>'
          );

          // Convert mermaid blocks to custom nodes
          // First, handle mermaid blocks with captions: ```mermaid\n...code...\n```\n*caption*
          processedContent = processedContent.replace(
            /```mermaid\n([\s\S]*?)```(?:\n\*([^*]+)\*)?/g,
            (_match, code, caption) => {
              const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              // Escape HTML entities for data attribute, but preserve mermaid syntax
              const escapedCode = code
                .trim()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/\n/g, '&#10;');
              if (caption) {
                const escapedCaption = caption.trim().replace(/"/g, '&quot;');
                return `<div data-type="mermaidDiagram" data-code="${escapedCode}" data-id="${id}" data-caption="${escapedCaption}"></div>`;
              }
              return `<div data-type="mermaidDiagram" data-code="${escapedCode}" data-id="${id}"></div>`;
            }
          );

          console.log(
            '📄 Loading content with mermaid blocks:',
            processedContent.includes('```mermaid') || processedContent.includes('mermaidDiagram')
          );
          const html = await marked.parse(processedContent);
          console.log('📄 Parsed HTML contains mermaidDiagram:', html.includes('mermaidDiagram'));
          // Set content without adding to history or triggering update
          // Images will keep their relative paths (assets/...)
          editor.commands.setContent(html, { emitUpdate: false });

          // After content is loaded, regenerate PNG images for mermaid diagrams
          // that don't have imagePath set
          setTimeout(() => {
            regenerateMermaidImages();
          }, 100); // Small delay to ensure editor has rendered
        } catch (error) {
          console.error('Error loading content:', error);
        }
      };

      loadContent();
    }
  }, [editor, content, regenerateMermaidImages]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar - Sticky */}
      <div className="sticky top-0 z-10 border-b border-border bg-card p-2 flex flex-wrap gap-1 items-center">
        {/* Text formatting */}
        <Button
          size="icon"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          type="button"
          title="Bold (Cmd+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          type="button"
          title="Italic (Cmd+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive('strike') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          type="button"
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive('code') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleCode().run()}
          type="button"
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Text Alignment */}
        <Button
          size="icon"
          variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          type="button"
          title="Align Left (Cmd+L)"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          type="button"
          title="Align Center (Cmd+E)"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          type="button"
          title="Align Right (Cmd+R)"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Headings */}
        <Button
          size="icon"
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          type="button"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          type="button"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          type="button"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive('heading', { level: 4 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          type="button"
          title="Heading 4"
        >
          <Heading4 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive('heading', { level: 5 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          type="button"
          title="Heading 5"
        >
          <Heading5 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive('heading', { level: 6 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          type="button"
          title="Heading 6"
        >
          <Heading6 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().setParagraph().run()}
          type="button"
          title="Paragraph"
        >
          <Pilcrow className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <Button
          size="icon"
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type="button"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          type="button"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive('taskList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          type="button"
          title="Task List"
        >
          <ListTodo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Blocks */}
        <Button
          size="icon"
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          type="button"
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          type="button"
          title="Code Block"
        >
          <FileCode className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Horizontal rule */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          type="button"
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Page break */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().setPageBreak().run()}
          type="button"
          title="Insert page break (Cmd/Ctrl+Enter)"
        >
          <SeparatorHorizontal className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Table controls */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          type="button"
          title="Insert table"
        >
          <TableIcon className="h-4 w-4" />
        </Button>
        {editor.isActive('table') && (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              type="button"
              title="Add column before"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              type="button"
              title="Add column after"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              type="button"
              title="Delete column"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              type="button"
              title="Add row before"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              type="button"
              title="Add row after"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().deleteRow().run()}
              type="button"
              title="Delete row"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => editor.chain().focus().deleteTable().run()}
              type="button"
              title="Delete table"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="w-px h-6 bg-border mx-1" />

        {/* Emoji picker */}
        <div className="relative" ref={emojiPickerRef}>
          <Button
            size="icon"
            variant={showEmojiPicker ? 'default' : 'ghost'}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            type="button"
            title="Insert emoji"
          >
            <Smile className="h-4 w-4" />
          </Button>
          {showEmojiPicker && (
            <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg p-2 z-50 w-80 max-h-64 overflow-y-auto">
              {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                <div key={category} className="mb-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-1 px-1">
                    {category}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className="text-2xl hover:bg-accent rounded p-1 transition-colors"
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

        <div className="w-px h-6 bg-border mx-1" />

        {/* Image upload */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          type="button"
          title="Insert image"
          disabled={!projectId}
        >
          <ImagePlus className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Mermaid diagram */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleOpenMermaidModal()}
          type="button"
          title="Insert Diagram (Mod+Shift+D)"
        >
          <DiagramIcon size={16} />
        </Button>
      </div>

      {/* Editor content - Scrollable */}
      <div className="flex-1 overflow-auto bg-background overflow-x-hidden">
        <EditorContent editor={editor} />
      </div>

      {/* Mermaid Modal */}
      <MermaidModal
        open={mermaidModalOpen}
        onClose={() => {
          setMermaidModalOpen(false);
          setEditingDiagramId(undefined);
          setEditingDiagramCode('');
          setEditingDiagramCaption('');
        }}
        initialCode={editingDiagramCode}
        initialCaption={editingDiagramCaption}
        onSave={handleSaveMermaidDiagram}
        diagramId={editingDiagramId}
      />
    </div>
  );
}

export default TiptapEditor;
