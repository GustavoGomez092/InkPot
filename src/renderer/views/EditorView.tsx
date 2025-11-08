import { useNavigate, useParams } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TiptapEditor } from '../components/editor';
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
  const contentRef = useRef(content);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
          setContent(result.data.project.content || '');
          setProjectName(result.data.project.name);
          setLastSaved(new Date(result.data.project.updatedAt));
          setLoadError(null);
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
      const result = await api.projects.save({
        id: projectId,
        content: contentRef.current,
      });

      if (result.success) {
        setLastSaved(new Date());
        console.log('Project saved successfully');
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      alert(`Failed to save project: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, projectId]);

  // Generate PDF preview
  const generatePreview = useCallback(async () => {
    if (!content || isGeneratingPreview) return;

    if (typeof window === 'undefined' || !('electronAPI' in window)) {
      console.error('Electron API not available');
      return;
    }

    setIsGeneratingPreview(true);
    try {
      const api = window.electronAPI;
      const result = await api.pdf.preview({ projectId });

      if (result.success && result.data.pdfDataUrl) {
        setPdfDataUrl(result.data.pdfDataUrl);
      } else {
        console.error('Failed to generate PDF preview');
      }
    } catch (error) {
      console.error('Failed to preview PDF:', error);
    } finally {
      setIsGeneratingPreview(false);
    }
  }, [content, isGeneratingPreview, projectId]);

  // Debounced preview update - regenerate preview 1 second after content stops changing
  useEffect(() => {
    if (!content) return;

    // Clear existing timeout
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }

    // Set new timeout to generate preview
    previewTimeoutRef.current = setTimeout(() => {
      void generatePreview();
    }, 1000);

    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [content, generatePreview]);

  // Generate initial preview on load
  useEffect(() => {
    if (content && !isLoading) {
      void generatePreview();
    }
  }, [isLoading]); // Only run once after initial load

  // PDF Export function
  const handleExport = async () => {
    if (isExporting || !content) return;

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

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (content) {
        void handleSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [content, handleSave]);

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button size="sm" variant="ghost" onClick={() => navigate({ to: '/' })}>
              ← Back
            </Button>
            <h1 className="text-xl font-semibold text-foreground">{projectName}</h1>
            {isSaving && <span className="text-sm text-muted-foreground">Saving...</span>}
            {isGeneratingPreview && <span className="text-sm text-muted-foreground">Updating preview...</span>}
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
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor */}
        <div className="w-1/2 flex flex-col border-r border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-card shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Markdown Editor</h2>
              <div className="flex gap-2">
                <span className="text-sm text-muted-foreground">
                  {content.length} characters
                </span>
                <Button size="sm" variant="outline" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-card">
            <TiptapEditor
              content={content}
              onUpdate={(newContent) => setContent(newContent)}
              placeholder="Start writing your document in markdown..."
            />
          </div>
        </div>

        {/* Right: PDF Preview */}
        <div className="w-1/2 flex flex-col overflow-hidden bg-muted">
          <div className="p-4 border-b border-border bg-card shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">PDF Preview</h2>
              {isGeneratingPreview && (
                <span className="text-sm text-muted-foreground animate-pulse">
                  Generating...
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-zinc-700 flex items-center justify-center">
            {pdfDataUrl ? (
              <iframe
                src={pdfDataUrl}
                className="w-full h-full border-0"
                title="PDF Preview"
              />
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
