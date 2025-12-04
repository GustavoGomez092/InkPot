import { createPluginRegistration } from '@embedpdf/core';
import { EmbedPDF } from '@embedpdf/core/react';
import { usePdfiumEngine } from '@embedpdf/engines/react';
import {
  GlobalPointerProvider,
  InteractionManagerPluginPackage,
} from '@embedpdf/plugin-interaction-manager/react';
import { LoaderPluginPackage } from '@embedpdf/plugin-loader/react';
import { PanPluginPackage, usePan } from '@embedpdf/plugin-pan/react';
import { RenderLayer, RenderPluginPackage } from '@embedpdf/plugin-render/react';
import { Scroller, ScrollPluginPackage } from '@embedpdf/plugin-scroll/react';
import { Viewport, ViewportPluginPackage } from '@embedpdf/plugin-viewport/react';
import { useZoom, ZoomPluginPackage } from '@embedpdf/plugin-zoom/react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type CoverData, CoverEditor, TiptapEditor } from '../components/editor';
import { Button, Card, CardContent, CardHeader } from '../components/ui';

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

    const img = document.createElement('img');
    const svgBase64 = btoa(unescape(encodeURIComponent(cleanedSvg)));
    const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

    img.onload = () => {
      // Add small delay to ensure SVG is fully rendered
      setTimeout(() => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = scaledWidth;
          canvas.height = scaledHeight;

          const ctx = canvas.getContext('2d', { alpha: true });
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Keep transparent background - don't fill
          // Draw SVG at scaled size
          ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

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
      let tagMatch;

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

/**
 * Zoom and Pan Toolbar Component using EmbedPDF plugins
 */
function ZoomAndPanToolbar() {
  const { provides: zoomProvides, state: zoomState } = useZoom();
  const { provides: pan, isPanning } = usePan();
  const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2];

  if (!zoomProvides || !pan) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 p-2 bg-card border-b border-border">
      {/* Mode Toggle Buttons */}
      <div className="flex items-center gap-1 border-r border-border pr-4">
        <button
          type="button"
          onClick={() => pan.disablePan()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors text-sm ${
            !isPanning
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
          title="Pointer Mode - Click to select"
          aria-label="Pointer Mode"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M13.64 21.97c-.16 0-.32-.05-.45-.15L9.14 19.3c-.18-.15-.3-.38-.3-.63v-8.67l-1.88-1.88c-.38-.38-.38-1 0-1.38.38-.38 1-.38 1.38 0l2.32 2.32c.18.18.29.43.29.69v8.17l3.65 2.19 5.25-10.5-10.5 5.25v-3.65c0-.26.11-.51.29-.69l2.32-2.32c.38-.38 1-.38 1.38 0 .38.38.38 1 0 1.38l-1.88 1.88v3.52c0 .36-.19.69-.51.87-.13.08-.28.12-.43.12-.19 0-.38-.05-.55-.17L3.29 10.43c-.31-.18-.51-.51-.51-.87V6.04l1.88-1.88c.38-.38.38-1 0-1.38-.38-.38-1-.38-1.38 0L.97 5.09c-.18.18-.29.43-.29.69v3.78c0 .55.29 1.05.76 1.32l6.57 3.94v4.49c0 .36.19.69.51.87l4.05 2.43c.13.08.28.12.43.12.16 0 .32-.05.45-.15.31-.18.51-.51.51-.87v-3.52l10.5-5.25c.31-.15.51-.47.51-.82s-.2-.67-.51-.82L14.45 6.05c-.31-.15-.67-.09-.93.15-.26.24-.37.6-.3.94l.87 4.32-3.65-2.19v-3.17l1.88-1.88c.38-.38.38-1 0-1.38-.38-.38-1-.38-1.38 0l-2.32 2.32c-.18.18-.29.43-.29.69v3.65L3.29 11.7c-.31.19-.51.51-.51.87v3.52c0 .25.12.48.3.63l4.05 2.43c.13.1.29.15.45.15.19 0 .38-.06.55-.17.31-.19.51-.51.51-.87V14.5l10.5 5.25c.55.28 1.22.05 1.5-.5.28-.55.05-1.22-.5-1.5L13.64 14.5v-4.49l3.65 2.19c.31.19.69.19 1 0 .31-.19.51-.51.51-.87v-3.52l1.88 1.88c.38.38 1 .38 1.38 0 .38-.38.38-1 0-1.38l-2.32-2.32c-.18-.18-.43-.29-.69-.29-.26 0-.51.11-.69.29l-1.88 1.88v3.17l-3.65-2.19.87-4.32c.07-.34-.04-.7-.3-.94-.26-.24-.62-.3-.93-.15L2.47 8.68c-.31.15-.51.47-.51.82s.2.67.51.82l10.5 5.25v3.52c0 .36.19.69.51.87.13.1.29.15.45.15z" />
          </svg>
          <span className="font-medium">Pointer</span>
        </button>
        <button
          type="button"
          onClick={() => pan.enablePan()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors text-sm ${
            isPanning
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
          title="Pan Mode - Click and drag to move"
          aria-label="Pan Mode"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M20.5 11H17V7.5C17 6.12 15.88 5 14.5 5S12 6.12 12 7.5V11h-1V3.5C11 2.12 9.88 1 8.5 1S6 2.12 6 3.5V11H5c-1.1 0-2 .9-2 2v1c0 3.31 2.69 6 6 6h5c3.31 0 6-2.69 6-6v-1c0-1.1-.9-2-2-2zm0 3c0 2.21-1.79 4-4 4h-5c-2.21 0-4-1.79-4-4v-1h3V3.5C10.5 2.67 11.17 2 12 2s1.5.67 1.5 1.5V11h2V7.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V11h2v3z" />
          </svg>
          <span className="font-medium">Hand</span>
        </button>
        {isPanning && <span className="text-xs text-muted-foreground ml-2">Panning...</span>}
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={zoomProvides.zoomOut}
          className="px-3 py-1 rounded bg-primary/10 hover:bg-primary/20 transition-colors text-sm"
          title="Zoom Out"
        >
          −
        </button>
        <select
          value={
            zoomLevels.find((level) => Math.abs(level - zoomState.currentZoomLevel) < 0.05) ||
            zoomState.currentZoomLevel
          }
          onChange={(e) => zoomProvides.requestZoom(Number(e.target.value))}
          className="px-2 py-1 rounded bg-background border border-border text-sm"
        >
          {zoomLevels.map((level) => (
            <option key={level} value={level}>
              {Math.round(level * 100)}%
            </option>
          ))}
          {!zoomLevels.some((level) => Math.abs(level - zoomState.currentZoomLevel) < 0.05) && (
            <option value={zoomState.currentZoomLevel}>
              {Math.round(zoomState.currentZoomLevel * 100)}%
            </option>
          )}
        </select>
        <button
          type="button"
          onClick={zoomProvides.zoomIn}
          className="px-3 py-1 rounded bg-primary/10 hover:bg-primary/20 transition-colors text-sm"
          title="Zoom In"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => zoomProvides.requestZoom(1.0)}
          className="px-3 py-1 rounded bg-primary/10 hover:bg-primary/20 transition-colors text-sm ml-2"
          title="Reset Zoom"
        >
          Reset
        </button>
        <span className="text-sm text-muted-foreground ml-2">
          {Math.round(zoomState.currentZoomLevel * 100)}%
        </span>
      </div>
    </div>
  );
}

/**
 * PDF Viewer Component using EmbedPDF
 * Memoized to prevent re-renders on every keystroke
 */
const PDFViewerComponent = memo(function PDFViewerComponent({
  pdfDataUrl,
}: {
  pdfDataUrl: string;
}) {
  const { engine, isLoading } = usePdfiumEngine();
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string>('');

  // Extract timestamp from URL for unique PDF ID
  const pdfId = useMemo(() => {
    const timestamp = pdfBlobUrl.split('#')[1];
    return timestamp ? `preview-pdf-${timestamp}` : 'preview-pdf';
  }, [pdfBlobUrl]);

  // Memoize plugins array to prevent EmbedPDF from recreating on every render
  const plugins = useMemo(
    () => [
      createPluginRegistration(LoaderPluginPackage, {
        loadingOptions: {
          type: 'url',
          pdfFile: {
            id: pdfId,
            url: pdfBlobUrl,
          },
        },
      }),
      createPluginRegistration(ViewportPluginPackage),
      createPluginRegistration(ScrollPluginPackage),
      createPluginRegistration(RenderPluginPackage),
      createPluginRegistration(InteractionManagerPluginPackage),
      createPluginRegistration(ZoomPluginPackage, {
        defaultZoomLevel: 1.0,
      }),
      createPluginRegistration(PanPluginPackage, {
        defaultMode: 'never', // Manual control via toolbar buttons
      }),
    ],
    [pdfBlobUrl, pdfId]
  );

  // Convert data URL to blob URL for LoaderPluginPackage
  useEffect(() => {
    let createdBlobUrl: string | null = null;

    if (pdfDataUrl) {
      try {
        // If it's already a blob URL, use it directly
        if (pdfDataUrl.startsWith('blob:')) {
          setPdfBlobUrl(pdfDataUrl);
          return;
        }

        // If it's a data URL, convert to blob
        if (pdfDataUrl.startsWith('data:')) {
          // Remove the hash if present (timestamp added for cache busting)
          const cleanUrl = pdfDataUrl.split('#')[0];
          console.log('🔄 Converting PDF data URL to blob (triggered by pdfDataUrl change)');

          // Extract the base64 data
          const base64Match = cleanUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (base64Match) {
            const mimeType = base64Match[1];
            const base64Data = base64Match[2];

            // Validate base64 data
            if (!base64Data || base64Data.length === 0) {
              console.error('Invalid base64 data in PDF URL');
              return;
            }

            // Convert base64 to binary
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }

            // Validate PDF header (should start with %PDF)
            const pdfHeader = String.fromCharCode.apply(null, Array.from(bytes.slice(0, 4)));
            if (!pdfHeader.startsWith('%PDF')) {
              console.error('Invalid PDF data: missing PDF header');
              return;
            }

            // Create blob and blob URL
            const blob = new Blob([bytes], { type: mimeType });
            createdBlobUrl = URL.createObjectURL(blob);
            // Preserve the timestamp hash to force plugin reload
            const timestamp = pdfDataUrl.split('#')[1];
            const blobUrlWithTimestamp = timestamp
              ? `${createdBlobUrl}#${timestamp}`
              : createdBlobUrl;
            setPdfBlobUrl(blobUrlWithTimestamp);
            console.log('✅ PDF blob URL created successfully with timestamp:', timestamp);
          } else {
            console.error('Failed to parse data URL format');
          }
        }
      } catch (error) {
        console.error('Failed to process PDF URL:', error);
        // Don't set an invalid blob URL
        setPdfBlobUrl('');
      }
    }

    // Cleanup function
    return () => {
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [pdfDataUrl]);

  if (isLoading || !engine || !pdfBlobUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading PDF Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <EmbedPDF engine={engine} plugins={plugins}>
        <ZoomAndPanToolbar />
        <GlobalPointerProvider>
          <Viewport
            data-embedpdf-viewport
            style={
              {
                backgroundColor: '#3f3f46',
                width: '100%',
                height: 'calc(100% - 48px)',
                userSelect: 'none',
                WebkitUserDrag: 'none',
                WebkitTouchCallout: 'none',
                pointerEvents: 'auto',
              } as React.CSSProperties
            }
            onDragStart={(e) => e.preventDefault()}
          >
            <Scroller
              renderPage={({ width, height, pageIndex, scale }) => (
                <div
                  style={
                    {
                      width,
                      height,
                      userSelect: 'none',
                      WebkitUserDrag: 'none',
                      WebkitTouchCallout: 'none',
                      pointerEvents: 'auto',
                    } as React.CSSProperties
                  }
                  onDragStart={(e) => e.preventDefault()}
                  draggable={false}
                >
                  <RenderLayer pageIndex={pageIndex} scale={scale} />
                </div>
              )}
            />
          </Viewport>
        </GlobalPointerProvider>
      </EmbedPDF>
    </div>
  );
});

function EditorView() {
  const { projectId } = useParams({ from: '/editor/$projectId' });
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [projectName, setProjectName] = useState('Loading...');
  const [pdfDataUrl, setPdfDataUrl] = useState<string>('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [rightWidth, setRightWidth] = useState(650); // Fixed width in pixels for preview
  const [isDraggingResize, setIsDraggingResize] = useState(false);
  const [editorMode, setEditorMode] = useState<'content' | 'cover'>('content');
  const [coverTitle, setCoverTitle] = useState<string | null>(null);
  const [coverSubtitle, setCoverSubtitle] = useState<string | null>(null);
  const [coverAuthor, setCoverAuthor] = useState<string | null>(null);
  const [projectThemeId, setProjectThemeId] = useState<string | null>(null);
  const [availableThemes, setAvailableThemes] = useState<Array<{ id: string; name: string }>>([]);
  const [activeTheme, setActiveTheme] = useState<{
    backgroundColor: string;
    textColor: string;
    headingColor: string;
    headingFont: string;
    bodyFont: string;
    h1Size: number;
    h2Size: number;
    h3Size: number;
    h4Size: number;
    h5Size: number;
    h6Size: number;
    bodySize: number;
    leading: number;
    codeBackground: string;
  } | null>(null);
  const contentRef = useRef(content);
  const coverDataRef = useRef<CoverData>({
    title: '',
    subtitle: '',
    author: '',
  });
  const charCountUpdateRef = useRef<NodeJS.Timeout | null>(null);
  const isDragging = useRef(false);

  // Keep ref in sync with content
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);
      setLoadError(null);

      if (typeof window === 'undefined' || !('electronAPI' in window)) {
        const error = 'Electron API not available. Please restart the application.';
        console.error(error);
        setProjectName('Error');
        setLoadError(error);
        setIsLoading(false);
        return;
      }

      try {
        const api = window.electronAPI;

        // Reset preview state when loading a project
        setPdfDataUrl('');

        // Get project file path from database first
        const projects = await api.projects.listRecent({ limit: 100 });
        if (!projects.success) {
          throw new Error('Failed to load projects list');
        }

        const project = projects.data.projects.find((p: any) => p.id === projectId);
        if (!project) {
          throw new Error(`Project not found with ID: ${projectId}`);
        }

        // Load full project data
        const result = await api.projects.load({ filePath: project.filePath });
        if (result.success) {
          const loadedContent = result.data.project.content || '';
          console.log(
            '📋 Project loaded from DB (first 500 chars):',
            loadedContent.substring(0, 500)
          );
          setContent(loadedContent);
          setCharCount(loadedContent.length);
          setProjectName(result.data.project.name);
          setLastSaved(new Date(result.data.project.updatedAt));
          setLoadError(null);

          // Load cover data
          setCoverTitle(result.data.project.coverTitle);
          setCoverSubtitle(result.data.project.coverSubtitle);
          setCoverAuthor(result.data.project.coverAuthor);

          // Load theme data for editor styling - use project's theme
          const projectThemeId = result.data.project.themeId;
          console.log('🎨 Project theme ID:', projectThemeId);
          setProjectThemeId(projectThemeId);
          if (projectThemeId) {
            const themeResult = await api.themes.get({ id: projectThemeId });
            console.log('🎨 Theme fetch result:', themeResult);
            if (themeResult.success && themeResult.data) {
              console.log('🎨 Setting active theme:', {
                name: themeResult.data.name,
                headingFont: themeResult.data.headingFont,
                bodyFont: themeResult.data.bodyFont,
                h1Size: themeResult.data.h1Size,
                backgroundColor: themeResult.data.backgroundColor,
                textColor: themeResult.data.textColor,
              });

              // Load Google Fonts dynamically
              const fontsToLoad = [themeResult.data.headingFont, themeResult.data.bodyFont];
              const uniqueFonts = [...new Set(fontsToLoad)];

              // Check if fonts are already loaded
              const loadedFonts = Array.from(document.fonts.values()).map((f) => f.family);
              const fontsToFetch = uniqueFonts.filter((font) => !loadedFonts.includes(`"${font}"`));

              if (fontsToFetch.length > 0) {
                console.log('🎨 Loading Google Fonts:', fontsToFetch);
                const fontFamilies = fontsToFetch.map((f) => f.replace(/ /g, '+')).join('&family=');
                const link = document.createElement('link');
                link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}:wght@400;600;700&display=swap`;
                link.rel = 'stylesheet';
                document.head.appendChild(link);

                // Wait a bit for fonts to load
                await new Promise((resolve) => setTimeout(resolve, 300));
              }

              setActiveTheme(themeResult.data);
            } else {
              console.error('🎨 Failed to load theme:', themeResult);
            }
          } else {
            console.warn('🎨 No theme ID found for project');
          }
        } else {
          throw new Error('Failed to load project data');
        }
      } catch (error) {
        console.error('Failed to load project:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setProjectName('Error');
        setLoadError(errorMessage);
        setContent('');
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  // Load available themes
  useEffect(() => {
    const loadThemes = async () => {
      if (typeof window === 'undefined' || !('electronAPI' in window)) {
        return;
      }
      const api = window.electronAPI;
      const result = await api.themes.list({});
      if (result.success && result.data) {
        setAvailableThemes(result.data.map((t) => ({ id: t.id, name: t.name })));
      }
    };
    loadThemes();
  }, []);

  // Save function (wrapped in useCallback to prevent unnecessary re-renders)
  const handleSave = useCallback(async () => {
    if (isSaving) return;

    if (typeof window === 'undefined' || !('electronAPI' in window)) {
      console.error('Electron API not available');
      return;
    }

    setIsSaving(true);
    try {
      const api = window.electronAPI;

      if (editorMode === 'content') {
        // Save content editor data
        console.log('💾 Saving content (first 500 chars):', contentRef.current.substring(0, 500));
        console.log('💾 Content contains mermaid:', contentRef.current.includes('```mermaid'));

        const result = await api.projects.save({
          id: projectId,
          content: contentRef.current,
          themeId: projectThemeId || undefined,
        });

        if (result.success) {
          setLastSaved(new Date());
          console.log('✅ Project saved successfully');
          console.log('✅ Saved content (first 500 chars):', contentRef.current.substring(0, 500));
        } else {
          throw new Error('Save failed');
        }
      } else {
        // Save cover editor data
        const coverData = coverDataRef.current;
        const result = await api.cover.updateData({
          projectId,
          hasCoverPage: true,
          coverTitle: coverData.title || null,
          coverSubtitle: coverData.subtitle || null,
          coverAuthor: coverData.author || null,
        });

        if (result.success) {
          setLastSaved(new Date());
          console.log('Cover data saved successfully');
          // Update local state
          setCoverTitle(coverData.title || null);
          setCoverSubtitle(coverData.subtitle || null);
          setCoverAuthor(coverData.author || null);
        } else {
          throw new Error('Failed to save cover data');
        }
      }

      // Small delay to ensure file system has synced
      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log(
        '🔄 Generating preview with content (first 500 chars):',
        contentRef.current.substring(0, 500)
      );

      // Refresh preview after save to show saved content
      await generatePreview();
    } catch (error) {
      console.error('Failed to save:', error);
      alert(`Failed to save: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaving, projectId, editorMode, projectThemeId]);

  // Handle title rename
  const handleTitleSave = useCallback(async () => {
    if (!editedTitle.trim() || editedTitle === projectName) {
      setIsEditingTitle(false);
      return;
    }

    if (typeof window === 'undefined' || !('electronAPI' in window)) {
      console.error('Electron API not available');
      return;
    }

    try {
      const api = window.electronAPI;
      const result = await api.projects.rename({
        id: projectId,
        name: editedTitle.trim(),
      });

      if (result.success) {
        setProjectName(editedTitle.trim());
        setIsEditingTitle(false);
      }
    } catch (error) {
      console.error('Failed to rename project:', error);
      alert('Failed to rename project');
    }
  }, [editedTitle, projectName, projectId]);

  // Handle resize drag
  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    setIsDraggingResize(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    e.preventDefault();
    const windowWidth = window.innerWidth;
    const newRightWidth = windowWidth - e.clientX;

    // Constrain between 650px and 80% of window
    const minWidth = 650;
    const maxWidth = windowWidth * 0.8;

    if (newRightWidth >= minWidth && newRightWidth <= maxWidth) {
      setRightWidth(newRightWidth);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    setIsDraggingResize(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Add/remove mouse event listeners for resize
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Render all Mermaid diagrams to SVG
  // SVG to PNG conversion now handled by main process using sharp library

  // Simple hash function for diagram codes
  const hashDiagramCode = useCallback((code: string): string => {
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      const char = code.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `diagram-${Math.abs(hash).toString(36)}`;
  }, []);

  const renderMermaidDiagrams = useCallback(
    async (content: string): Promise<Record<string, string>> => {
      const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
      const diagrams: Record<string, string> = {};
      const diagramCodeToHash: Record<string, string> = {}; // Map diagram code to hash
      const matches: string[] = [];
      let match;

      // First, collect all diagram codes
      while ((match = mermaidRegex.exec(content)) !== null) {
        matches.push(match[1].trim());
      }

      console.log(`📊 Found ${matches.length} mermaid diagrams to render`);

      if (typeof window === 'undefined' || !('electronAPI' in window)) {
        console.error('Electron API not available');
        return diagrams;
      }

      const api = window.electronAPI;

      // Process diagrams sequentially
      for (let i = 0; i < matches.length; i++) {
        const diagramCode = matches[i];
        const diagramHash = hashDiagramCode(diagramCode);
        diagramCodeToHash[diagramCode] = diagramHash;

        console.log(`🔑 [${i + 1}/${matches.length}] Rendering diagram (hash: ${diagramHash})`);
        try {
          // Dynamically import mermaid
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

          // Generate unique ID for this diagram
          const diagramId = `mermaid-render-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 11)}`;

          // Render to SVG
          const { svg } = await mermaid.render(diagramId, diagramCode);
          console.log(`✅ [${i + 1}/${matches.length}] Rendered to SVG (${svg.length} bytes)`);

          // Sanitize SVG to fix XML issues with foreignObject HTML
          const sanitizedSvg = sanitizeMermaidSvg(svg);

          // Convert SVG to PNG in browser (preserves foreignObject content)
          console.log(`🔄 [${i + 1}/${matches.length}] Converting SVG to PNG...`);
          const pngDataUrl = await convertSvgToPng(sanitizedSvg);
          console.log(`✅ [${i + 1}/${matches.length}] PNG generated (${pngDataUrl.length} bytes)`);

          // Save PNG via IPC
          console.log(`🔄 [${i + 1}/${matches.length}] Saving PNG via IPC...`);
          const response = await window.electronAPI.pdf.saveMermaidImage({
            projectId,
            diagramCode,
            svgString: pngDataUrl, // Send PNG data URL
          });

          if (response.success && response.data?.filePath) {
            // Store file path (not data URL)
            diagrams[diagramHash] = response.data.filePath;
            console.log(`✅ [${i + 1}/${matches.length}] Saved to: ${response.data.filePath}`);
            console.log(`🔑 Hash: ${diagramHash}, Type: file path`);
          } else {
            console.warn(`⚠️ [${i + 1}/${matches.length}] Failed to save diagram`);
          }

          // Add small delay between conversions
          if (i < matches.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(`❌ [${i + 1}/${matches.length}] Failed to render diagram:`, error);
        }
      }

      console.log(
        `📊 Total diagrams successfully saved: ${Object.keys(diagrams).length}/${matches.length}`
      );
      console.log('📊 Diagram hash keys:', Object.keys(diagrams));
      return diagrams;
    },
    [projectId, hashDiagramCode]
  );

  // Generate PDF preview
  const generatePreview = useCallback(async () => {
    const currentContent = contentRef.current;
    if (!currentContent || isGeneratingPreview) return;

    if (typeof window === 'undefined' || !('electronAPI' in window)) {
      console.error('Electron API not available');
      return;
    }

    console.log('🔍 Preview content contains mermaid:', currentContent.includes('```mermaid'));
    console.log('🔍 Preview content (first 500 chars):', currentContent.substring(0, 500));

    setIsGeneratingPreview(true);
    try {
      const api = window.electronAPI;

      // Pre-render any Mermaid diagrams
      const mermaidDiagrams = await renderMermaidDiagrams(currentContent);
      console.log('🎨 Mermaid diagrams result:', mermaidDiagrams);
      console.log(
        '🎨 Pre-rendered mermaid diagrams:',
        mermaidDiagrams ? Object.keys(mermaidDiagrams).length : 'undefined'
      );
      if (mermaidDiagrams && Object.keys(mermaidDiagrams).length > 0) {
        console.log('🎨 First diagram file path:', Object.values(mermaidDiagrams)[0]);
        console.log(
          '🎨 Diagram keys (first 50 chars):',
          Object.keys(mermaidDiagrams).map((k) => k.substring(0, 50))
        );
      }

      // Pass live content and pre-rendered diagrams for real-time preview
      const requestData = {
        projectId,
        content: currentContent,
        mermaidDiagrams:
          mermaidDiagrams && Object.keys(mermaidDiagrams).length > 0 ? mermaidDiagrams : undefined,
      };
      console.log(
        '📤 Sending request with mermaidDiagrams:',
        requestData.mermaidDiagrams ? 'YES' : 'NO'
      );
      if (requestData.mermaidDiagrams) {
        console.log(
          '📤 Mermaid diagram keys being sent:',
          Object.keys(requestData.mermaidDiagrams)
        );
        console.log('📤 Full mermaidDiagrams object:', requestData.mermaidDiagrams);
      }

      console.log(
        '📤 About to call api.pdf.preview with content length:',
        requestData.content.length
      );
      const result = await api.pdf.preview(requestData);

      if (result.success && result.data.pdfDataUrl) {
        // Force iframe reload by appending a timestamp to the URL
        const urlWithTimestamp = `${result.data.pdfDataUrl}#${Date.now()}`;
        console.log('✅ PDF preview updated successfully, setting new URL with timestamp');
        console.log('📄 New PDF data URL length:', result.data.pdfDataUrl.length);
        setPdfDataUrl(urlWithTimestamp);
      } else {
        console.error('Failed to generate PDF preview:', result);
        if (!result.success && 'error' in result) {
          console.error('Error details:', result.error);
        }
      }
    } catch (error) {
      console.error('Failed to preview PDF:', error);
    } finally {
      setIsGeneratingPreview(false);
    }
  }, [projectId, isGeneratingPreview, renderMermaidDiagrams]);

  // Debug: Log when theme changes
  useEffect(() => {
    if (activeTheme) {
      console.log('🎨 Active theme updated in state:', {
        name: (activeTheme as any).name,
        headingFont: activeTheme.headingFont,
        bodyFont: activeTheme.bodyFont,
        backgroundColor: activeTheme.backgroundColor,
        textColor: activeTheme.textColor,
        h1Size: activeTheme.h1Size,
      });
    } else {
      console.log('🎨 Active theme is null');
    }
  }, [activeTheme]);

  // Handle theme change
  const handleThemeChange = useCallback(
    async (themeId: string) => {
      if (typeof window === 'undefined' || !('electronAPI' in window)) {
        return;
      }
      const api = window.electronAPI;

      // Fetch the theme data
      const themeResult = await api.themes.get({ id: themeId });
      if (themeResult.success && themeResult.data) {
        // Load Google Fonts dynamically
        const fontsToLoad = [themeResult.data.headingFont, themeResult.data.bodyFont];
        const uniqueFonts = [...new Set(fontsToLoad)];

        const loadedFonts = Array.from(document.fonts.values()).map((f) => f.family);
        const fontsToFetch = uniqueFonts.filter((font) => !loadedFonts.includes(`"${font}"`));

        if (fontsToFetch.length > 0) {
          console.log('🎨 Loading Google Fonts:', fontsToFetch);
          const fontFamilies = fontsToFetch.map((f) => f.replace(/ /g, '+')).join('&family=');
          const link = document.createElement('link');
          link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}:wght@400;600;700&display=swap`;
          link.rel = 'stylesheet';
          document.head.appendChild(link);

          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        setActiveTheme(themeResult.data);
        setProjectThemeId(themeId);

        // Save the theme change to the project
        await api.projects.save({
          id: projectId,
          content: contentRef.current,
          themeId: themeId,
        });

        // Regenerate preview with new theme
        await generatePreview();
      }
    },
    [projectId, generatePreview]
  );

  // Generate initial preview on load ONLY (not on content changes)
  useEffect(() => {
    if (!isLoading && content) {
      console.log('📋 Content ready - generating initial preview');
      // Small delay to ensure the editor has rendered
      const timer = setTimeout(() => {
        void generatePreview();
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear timeouts
      if (charCountUpdateRef.current) {
        clearTimeout(charCountUpdateRef.current);
      }
    };
  }, []);

  // PDF Export function
  const handleExport = async () => {
    if (isExporting || !contentRef.current) return;

    if (typeof window === 'undefined' || !('electronAPI' in window)) {
      alert('Electron API not available');
      return;
    }

    setIsExporting(true);
    try {
      // Save first to ensure latest content
      await handleSave();

      const api = window.electronAPI;

      // Show save dialog
      const saveResult = await api.file.saveDialog({
        title: 'Export PDF',
        defaultPath: `${projectName}.pdf`,
        filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
      });

      if (saveResult.success && saveResult.data.filePath) {
        // Pre-render any Mermaid diagrams
        const mermaidDiagrams = await renderMermaidDiagrams(contentRef.current);

        // Export PDF
        const exportResult = await api.pdf.export({
          projectId,
          outputPath: saveResult.data.filePath,
          openAfterExport: true,
          mermaidDiagrams: Object.keys(mermaidDiagrams).length > 0 ? mermaidDiagrams : undefined,
        });

        if (exportResult.success) {
          alert(`PDF exported successfully to ${exportResult.data.filePath}`);
        } else {
          alert('Failed to export PDF');
        }
      }
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert(`Failed to export PDF: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Auto-save every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (contentRef.current) {
        void handleSave();
      }
    }, 600000); // 10 minutes = 600000ms

    return () => clearInterval(interval);
  }, [handleSave]);

  const formatLastSaved = () => {
    if (!lastSaved) return 'Never';
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return lastSaved.toLocaleTimeString();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (loadError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <h2 className="text-lg font-semibold text-destructive">Error Loading Project</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{loadError}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate({ to: '/' })}>
                ← Back to Home
              </Button>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-56px)] bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button size="sm" variant="ghost" onClick={() => navigate({ to: '/' })}>
              ← Back
            </Button>
            {isEditingTitle ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTitleSave();
                  } else if (e.key === 'Escape') {
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className="text-xl font-semibold bg-transparent border-b-2 border-primary focus:outline-none px-2 py-1"
              />
            ) : (
              <h1
                className="text-xl font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => {
                  setEditedTitle(projectName);
                  setIsEditingTitle(true);
                }}
                title="Click to edit project name"
              >
                {projectName}
              </h1>
            )}
            {isSaving && <span className="text-sm text-muted-foreground">Saving...</span>}
            {isGeneratingPreview && (
              <span className="text-sm text-muted-foreground">Updating preview...</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Last saved: {formatLastSaved()}</span>
            <Button size="sm" onClick={handleExport} disabled={isExporting || !content}>
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Split Screen: Editor + Preview */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Editor */}
        <div
          className="flex flex-col border-r border-border overflow-hidden"
          style={{ width: `calc(100% - ${rightWidth}px)` }}
        >
          <div className="p-4 border-b border-border bg-card shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={editorMode === 'content' ? 'default' : 'outline'}
                  onClick={() => setEditorMode('content')}
                >
                  Content Editor
                </Button>
                <Button
                  size="sm"
                  variant={editorMode === 'cover' ? 'default' : 'outline'}
                  onClick={() => setEditorMode('cover')}
                >
                  Cover Editor
                </Button>
              </div>
              <div className="flex gap-2 items-center">
                <select
                  className="px-3 py-1.5 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={projectThemeId || ''}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  disabled={availableThemes.length === 0}
                >
                  <option value="" disabled>
                    Select Theme
                  </option>
                  {availableThemes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
                <Button size="sm" variant="outline" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save and Update Preview'}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col bg-card">
            {editorMode === 'content' ? (
              <>
                <div
                  className="flex-1 overflow-hidden p-4"
                  style={{
                    ...((activeTheme
                      ? {
                          '--editor-heading-font': activeTheme.headingFont,
                          '--editor-body-font': activeTheme.bodyFont,
                          '--editor-h1-size': `${activeTheme.h1Size}pt`,
                          '--editor-h2-size': `${activeTheme.h2Size}pt`,
                          '--editor-h3-size': `${activeTheme.h3Size}pt`,
                          '--editor-h4-size': `${activeTheme.h4Size}pt`,
                          '--editor-h5-size': `${activeTheme.h5Size}pt`,
                          '--editor-h6-size': `${activeTheme.h6Size}pt`,
                          '--editor-body-size': `${activeTheme.bodySize}pt`,
                          '--editor-text-color': activeTheme.textColor,
                          '--editor-heading-color': activeTheme.headingColor,
                          '--editor-code-bg': activeTheme.codeBackground,
                          '--editor-line-height': `${activeTheme.leading}`,
                        }
                      : {}) as React.CSSProperties),
                  }}
                >
                  <TiptapEditor
                    content={content}
                    projectId={projectId}
                    backgroundColor={activeTheme?.backgroundColor}
                    onUpdate={(newContent) => {
                      // Update the ref immediately for saving without causing re-render
                      contentRef.current = newContent;

                      // Debounce character count update to avoid frequent re-renders
                      if (charCountUpdateRef.current) {
                        clearTimeout(charCountUpdateRef.current);
                      }
                      charCountUpdateRef.current = setTimeout(() => {
                        setCharCount(newContent.length);
                      }, 300);

                      // Preview will only update on save
                    }}
                    placeholder="Start writing your document in markdown..."
                  />
                </div>
                <div className="px-4 py-2 border-t border-border bg-card shrink-0">
                  <span className="text-sm text-muted-foreground">{charCount} characters</span>
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-hidden">
                <CoverEditor
                  projectId={projectId}
                  initialTitle={coverTitle}
                  initialSubtitle={coverSubtitle}
                  initialAuthor={coverAuthor}
                  onDataChange={(data) => {
                    // Update ref for saving
                    coverDataRef.current = data;
                  }}
                  onUpdate={() => {
                    // Refresh preview when cover assets change
                    void generatePreview();
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className="w-1 bg-border hover:bg-primary cursor-col-resize active:bg-primary transition-colors relative z-10"
          onMouseDown={handleMouseDown}
          style={{ cursor: 'col-resize' }}
        >
          <div className="absolute inset-y-0 -left-2 -right-2" />
        </div>

        {/* Right: PDF Preview */}
        <div
          className="flex flex-col overflow-hidden bg-muted relative"
          style={{ width: `${rightWidth}px` }}
        >
          {/* Overlay to block pointer events during resize */}
          {isDraggingResize && (
            <div className="absolute inset-0 z-50" style={{ cursor: 'col-resize' }} />
          )}
          <div className="p-4 border-b border-border bg-card shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">PDF Preview</h2>
              {isGeneratingPreview && (
                <span className="text-sm text-muted-foreground animate-pulse">Generating...</span>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-zinc-700 flex items-center justify-center">
            {pdfDataUrl ? (
              <PDFViewerComponent pdfDataUrl={pdfDataUrl} />
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Generating initial preview...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorView;
