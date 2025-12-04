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

/**
 * Convert SVG to PNG using browser canvas
 * This preserves foreignObject content that Sharp cannot handle
 */
async function convertSvgToPng(svgString: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Parse SVG to get dimensions
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');

    if (!svgElement) {
      reject(new Error('Invalid SVG'));
      return;
    }

    // Ensure SVG has proper namespace and attributes for rendering
    if (!svgElement.hasAttribute('xmlns')) {
      svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    // Get SVG dimensions (default to viewBox if width/height not set)
    let width = parseFloat(svgElement.getAttribute('width') || '800');
    let height = parseFloat(svgElement.getAttribute('height') || '600');

    const viewBox = svgElement.getAttribute('viewBox');
    if (viewBox && (!svgElement.getAttribute('width') || !svgElement.getAttribute('height'))) {
      const [, , vbWidth, vbHeight] = viewBox.split(' ').map(parseFloat);
      width = vbWidth || width;
      height = vbHeight || height;
    }

    // Set explicit width/height if not present to ensure proper rendering
    if (!svgElement.getAttribute('width')) {
      svgElement.setAttribute('width', width.toString());
    }
    if (!svgElement.getAttribute('height')) {
      svgElement.setAttribute('height', height.toString());
    }

    // Serialize the cleaned SVG back to string
    const serializer = new XMLSerializer();
    const cleanedSvg = serializer.serializeToString(svgElement);

    // Use 2x scale for better quality
    const scale = 2;
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    // Create an image element
    const img = document.createElement('img');

    // Encode SVG as data URL to avoid CORS/taint issues
    const svgBase64 = btoa(unescape(encodeURIComponent(cleanedSvg)));
    const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

    img.onload = () => {
      // Add small delay to ensure SVG is fully rendered
      setTimeout(() => {
        try {
          // Create canvas with scaled dimensions
          const canvas = document.createElement('canvas');
          canvas.width = scaledWidth;
          canvas.height = scaledHeight;

          // Draw image to canvas
          const ctx = canvas.getContext('2d', { alpha: true });
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Keep transparent background - don't fill
          // Draw SVG at scaled size
          ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

          // Convert to PNG data URL
          const pngDataUrl = canvas.toDataURL('image/png');

          resolve(pngDataUrl);
        } catch (error) {
          reject(error);
        }
      }, 50);
    };

    img.onerror = () => {
      reject(new Error('Failed to load SVG image'));
    };

    img.src = dataUrl;
  });
} /**
 * Sanitizes mermaid SVG output to fix XML parsing issues.
 * Mermaid uses foreignObject elements with HTML that isn't properly XML-encoded.
 * This function ensures all HTML tags are properly closed and self-closing where needed.
 */
function sanitizeMermaidSvg(svg: string): string {
  try {
    // Parse the SVG to manipulate it
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');

    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      console.warn('SVG parsing error, attempting text-based fix');
      // Fall back to text-based fix
      return fixSvgTextBased(svg);
    }

    // Find all foreignObject elements
    const foreignObjects = doc.querySelectorAll('foreignObject');

    foreignObjects.forEach((fo) => {
      // Get the HTML content
      const htmlContent = fo.innerHTML;

      // Fix common issues:
      // 1. Unclosed <br> tags -> <br/>
      // 2. Unclosed <p> tags
      const fixed = htmlContent
        .replace(/<br>/gi, '<br/>')
        .replace(/<br\s+>/gi, '<br/>')
        .replace(/<p>([^<]*?)(?=<(?:p|br|\/foreignObject)|$)/gi, '<p>$1</p>');

      fo.innerHTML = fixed;
    });

    // Serialize back to string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc.documentElement);
  } catch (error) {
    console.error('Error sanitizing SVG:', error);
    // Return text-based fix as fallback
    return fixSvgTextBased(svg);
  }
}

/**
 * Text-based SVG fix for cases where DOM parsing fails
 */
function fixSvgTextBased(svg: string): string {
  let result = svg;

  // Step 1: Fix self-closing tags
  result = result
    .replace(/<br>/gi, '<br/>')
    .replace(/<br\s+>/gi, '<br/>')
    .replace(/<hr>/gi, '<hr/>')
    .replace(/<img([^>]*)>/gi, '<img$1/>');

  // Step 2: Fix nested HTML in foreignObject by tracking open tags
  result = result.replace(
    /<foreignObject([^>]*)>([\s\S]*?)<\/foreignObject>/gi,
    (_match, attrs, content) => {
      // Track opening and closing tags
      const tagStack: Array<{ name: string; attrs: string }> = [];
      let fixedContent = '';
      let pos = 0;

      // Match all tags
      const tagRegex = /<\/?([a-z][a-z0-9]*)(\s[^>]*)?>|<br\s*\/?>/gi;
      let tagMatch: RegExpExecArray | null;

      while ((tagMatch = tagRegex.exec(content)) !== null) {
        // Add text before this tag
        fixedContent += content.slice(pos, tagMatch.index);

        const fullTag = tagMatch[0];
        const tagName = tagMatch[1]?.toLowerCase();
        const tagAttrs = tagMatch[2] || '';

        if (!tagName) {
          // Self-closing tag like <br/>
          fixedContent += fullTag.replace(/<br>/gi, '<br/>');
        } else if (fullTag.startsWith('</')) {
          // Closing tag
          if (tagStack.length > 0 && tagStack[tagStack.length - 1].name === tagName) {
            tagStack.pop();
            fixedContent += fullTag;
          } else {
            // Unmatched closing tag, skip it
            console.warn(`Skipping unmatched closing tag: ${fullTag}`);
          }
        } else if (fullTag.endsWith('/>')) {
          // Self-closing tag
          fixedContent += fullTag;
        } else {
          // Opening tag
          tagStack.push({ name: tagName, attrs: tagAttrs });
          fixedContent += fullTag;
        }

        pos = tagRegex.lastIndex;
      }

      // Add remaining text
      fixedContent += content.slice(pos);

      // Close any unclosed tags
      while (tagStack.length > 0) {
        const tag = tagStack.pop();
        if (tag) {
          fixedContent += `</${tag.name}>`;
        }
      }

      return `<foreignObject${attrs}>${fixedContent}</foreignObject>`;
    }
  );

  // Step 3: Final cleanup
  result = result
    .replace(/^<\?xml[^>]*\?>/, '') // Remove XML declaration
    .trim();

  return result;
}

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
        console.log('🎨 Rendering diagram to SVG...');

        // Import mermaid and render to SVG
        const mermaid = (await import('mermaid')).default;

        // Initialize with default theme for proper edge rendering
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          themeVariables: {
            background: 'transparent',
            primaryColor: '#fff',
            primaryTextColor: '#000',
            primaryBorderColor: '#000',
            lineColor: '#000',
            secondaryColor: '#f4f4f4',
            tertiaryColor: '#f4f4f4',
          },
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
          },
          securityLevel: 'loose',
          logLevel: 'error',
        });

        const renderId = `mermaid-save-${editingDiagramId || 'new'}-${Date.now()}`;
        console.log('   - Rendering SVG with ID:', renderId);
        const { svg } = await mermaid.render(renderId, code);
        console.log('   - SVG rendered, length:', svg.length);

        // Sanitize SVG to fix XML issues with foreignObject HTML
        const sanitizedSvg = sanitizeMermaidSvg(svg);
        console.log('   - SVG sanitized');

        // Convert SVG to PNG in browser (preserves foreignObject content)
        console.log('   - Converting SVG to PNG in browser...');
        const pngDataUrl = await convertSvgToPng(sanitizedSvg);
        console.log('   - PNG generated, length:', pngDataUrl.length);

        // Save PNG via IPC
        console.log('   - Saving PNG via IPC...');
        const response = await window.electronAPI.pdf.saveMermaidImage({
          projectId,
          diagramCode: code,
          svgString: pngDataUrl, // Send PNG data URL instead of SVG
        });

        if (response.success && response.data?.filePath) {
          // Use the file path (not data URL) for efficient storage
          imagePath = response.data.filePath;
          console.log('   - File saved:', imagePath);
        } else {
          console.warn('   - Failed to save file:', response.error);
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

        // Initialize with default theme for proper edge rendering
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          themeVariables: {
            background: 'transparent',
            primaryColor: '#fff',
            primaryTextColor: '#000',
            primaryBorderColor: '#000',
            lineColor: '#000',
            secondaryColor: '#f4f4f4',
            tertiaryColor: '#f4f4f4',
          },
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
          },
          securityLevel: 'loose',
          logLevel: 'error',
        });

        const renderId = `mermaid-regen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(renderId, code);

        // Sanitize and convert SVG to PNG
        const sanitizedSvg = sanitizeMermaidSvg(svg);
        const pngDataUrl = await convertSvgToPng(sanitizedSvg);

        // Save PNG via IPC
        if (!projectId) {
          console.warn('⚠️ No projectId available for saving diagram');
          continue;
        }
        const response = await window.electronAPI.pdf.saveMermaidImage({
          projectId,
          diagramCode: code,
          svgString: pngDataUrl, // Send PNG data URL
        });

        if (response.success && response.data?.filePath) {
          console.log(`✅ Saved to file: ${response.data.filePath}`);
          // Update the node with file path
          editor.commands.command(({ tr }) => {
            tr.setNodeMarkup(pos, undefined, {
              ...attrs,
              imagePath: response.data.filePath,
            });
            return true;
          });
        } else {
          console.warn(`⚠️ Failed to save diagram:`, response.error);
        }
      } catch (error) {
        console.error(`❌ Failed to regenerate image for diagram at pos ${pos}:`, error);
      }
    }

    console.log('✅ Finished regenerating mermaid images');
  }, [editor, projectId]);

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
