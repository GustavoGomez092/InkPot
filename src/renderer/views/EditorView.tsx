import { useNavigate, useParams } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type CoverData, CoverEditor, TiptapEditor } from '../components/editor';
import { Button, Card } from '../components/ui';

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
  const [rightWidth, setRightWidth] = useState(499); // Fixed width in pixels for preview
  const [isDraggingResize, setIsDraggingResize] = useState(false);
  const [editorMode, setEditorMode] = useState<'content' | 'cover'>('content');
  const [coverTitle, setCoverTitle] = useState<string | null>(null);
  const [coverSubtitle, setCoverSubtitle] = useState<string | null>(null);
  const [coverAuthor, setCoverAuthor] = useState<string | null>(null);
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

          // Apply active theme on load to ensure preview uses current theme
          const activeThemeId = localStorage.getItem('activeThemeId');
          if (activeThemeId && activeThemeId !== result.data.project.themeId) {
            console.log('📋 Applying active theme on load:', activeThemeId);
            // Save with the active theme to update the database
            await api.projects.save({
              id: projectId,
              content: loadedContent,
              themeId: activeThemeId,
            });
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
        const activeThemeId = localStorage.getItem('activeThemeId');

        const result = await api.projects.save({
          id: projectId,
          content: contentRef.current,
          themeId: activeThemeId || undefined,
        });

        if (result.success) {
          setLastSaved(new Date());
          console.log('Project saved successfully');
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

      // Refresh preview after save to show saved content
      void generatePreview();
    } catch (error) {
      console.error('Failed to save:', error);
      alert(`Failed to save: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, projectId, editorMode]);

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

    // Constrain between 300px and 80% of window
    const minWidth = 300;
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

  // Generate PDF preview - NOT a useCallback to avoid dependency issues
  const generatePreview = async () => {
    const currentContent = contentRef.current;
    if (!currentContent || isGeneratingPreview) return;

    if (typeof window === 'undefined' || !('electronAPI' in window)) {
      console.error('Electron API not available');
      return;
    }

    setIsGeneratingPreview(true);
    try {
      const api = window.electronAPI;
      // Pass live content for real-time preview
      const result = await api.pdf.preview({
        projectId,
        content: currentContent,
      });

      if (result.success && result.data.pdfDataUrl) {
        // Force iframe reload by appending a timestamp to the URL
        const urlWithTimestamp = `${result.data.pdfDataUrl}#${Date.now()}`;
        setPdfDataUrl(urlWithTimestamp);
        console.log('✅ PDF preview updated successfully');
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
  };

  // Generate initial preview on load - regenerate whenever projectId changes
  useEffect(() => {
    if (content && !isLoading) {
      console.log('📋 Project loaded - generating preview');
      void generatePreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, isLoading, content]);

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
        // Export PDF
        const exportResult = await api.pdf.export({
          projectId,
          outputPath: saveResult.data.filePath,
          openAfterExport: true,
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
          <Card.Header>
            <h2 className="text-lg font-semibold text-destructive">Error Loading Project</h2>
          </Card.Header>
          <Card.Body>
            <p className="text-muted-foreground mb-4">{loadError}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate({ to: '/' })}>
                ← Back to Home
              </Button>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
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
            <Button
              size="sm"
              variant="primary"
              onClick={handleExport}
              disabled={isExporting || !content}
            >
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
                  variant={editorMode === 'content' ? 'primary' : 'outline'}
                  onClick={() => setEditorMode('content')}
                >
                  Content Editor
                </Button>
                <Button
                  size="sm"
                  variant={editorMode === 'cover' ? 'primary' : 'outline'}
                  onClick={() => setEditorMode('cover')}
                >
                  Cover Editor
                </Button>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save and Update Preview'}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col bg-card">
            {editorMode === 'content' ? (
              <>
                <div className="flex-1 overflow-hidden p-4">
                  <TiptapEditor
                    content={content}
                    projectId={projectId}
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
              <iframe src={pdfDataUrl} className="w-full h-full border-0" title="PDF Preview" />
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
