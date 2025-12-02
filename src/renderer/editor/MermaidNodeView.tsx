import type { MermaidDiagramAttributes } from '@shared/types/mermaid';
import { type NodeViewProps, NodeViewWrapper } from '@tiptap/react';

/**
 * React NodeView component for rendering Mermaid diagrams in the editor
 * Displays pre-rendered PNG images that were generated during diagram creation/editing
 */
export function MermaidNodeView(props: NodeViewProps) {
  const { node, selected, editor } = props;
  const { code, caption, id, imagePath } = node.attrs as MermaidDiagramAttributes;

  console.log('👁️ MermaidNodeView rendered:', {
    id,
    hasCode: !!code,
    hasImagePath: !!imagePath,
    imagePathPreview: imagePath ? imagePath.substring(0, 50) + '...' : 'undefined',
  });

  const handleClick = () => {
    const extension = editor.extensionManager.extensions.find(
      (ext) => ext.name === 'mermaidDiagram'
    );

    if (extension && 'options' in extension && extension.options) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options = extension.options as any;
      options.onOpenModal?.(id, code, caption);
    }

    editor.commands.focus();
  };

  return (
    <NodeViewWrapper
      className={`mermaid-node-view ${selected ? 'ProseMirror-selectednode' : ''}`}
      data-drag-handle
    >
      <div
        className="mermaid-container cursor-pointer rounded-lg border-2 border-blue-200 bg-blue-50/30 transition-all hover:border-blue-400 hover:bg-blue-50"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Header with icon and label */}
        <div className="mb-3 flex items-center gap-2 border-b border-blue-200 px-4 py-3">
          <svg
            className="h-5 w-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Diagram icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="text-sm font-medium text-blue-700">Mermaid Diagram</span>
          <span className="ml-auto text-xs text-blue-500">Click to edit</span>
        </div>

        {/* Diagram content */}
        <div className="px-4">
          {imagePath ? (
            <div className="mermaid-output flex items-center justify-center py-4">
              <img
                src={imagePath}
                alt={caption || 'Mermaid diagram'}
                className="max-w-full"
                style={{
                  minHeight: '100px',
                  maxWidth: '100%',
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <p className="text-sm">No preview available. Click to edit and generate.</p>
            </div>
          )}

          {caption && (
            <div className="mt-2 pb-3 text-center text-sm italic text-gray-600">{caption}</div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
