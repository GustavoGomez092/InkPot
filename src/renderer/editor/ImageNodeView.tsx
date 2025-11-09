/**
 * Custom React component for rendering images in Tiptap
 * Resolves relative paths to base64 data URLs for display
 */

import type { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { useEffect, useState } from 'react';

export function ImageNodeView(props: NodeViewProps) {
  const { node } = props;
  const { src, alt, title } = node.attrs;
  const [displaySrc, setDisplaySrc] = useState<string>(src);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If src is a relative path (starts with 'assets/'), resolve it
    if (src?.startsWith('assets/')) {
      setLoading(true);
      console.log('🖼️ ImageNodeView: Resolving image path:', src);

      // Get projectId from the editor's parent context
      const projectId = (window as unknown as { __inkforge_current_project_id__?: string })
        .__inkforge_current_project_id__;

      if (projectId) {
        window.electronAPI.file
          .getImagePath({ projectId, relativePath: src })
          .then((response) => {
            if (response.success) {
              console.log('✅ ImageNodeView: Resolved successfully');
              setDisplaySrc(response.data.dataUrl);
            } else {
              console.error('❌ ImageNodeView: Failed to resolve:', response.error);
            }
          })
          .catch((error) => {
            console.error('❌ ImageNodeView: Error:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        console.warn('⚠️ ImageNodeView: No projectId available');
        setLoading(false);
      }
    } else {
      console.log('🖼️ ImageNodeView: Using src as-is (not relative):', src);
    }
  }, [src]);

  return (
    <NodeViewWrapper as="div" className="my-2">
      {loading ? (
        <div className="w-32 h-32 bg-gray-200 animate-pulse rounded" />
      ) : (
        <img
          src={displaySrc}
          alt={alt || ''}
          title={title || undefined}
          className="max-w-full h-auto block"
        />
      )}
    </NodeViewWrapper>
  );
}
