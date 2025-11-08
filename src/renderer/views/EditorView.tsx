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
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [projectName, setProjectName] = useState('Loading...');
  const contentRef = useRef(content);

  // Keep ref in sync with content
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        // For demo, use mock data. In production, call IPC to load project
        if (projectId === 'demo') {
          setProjectName('Demo Project');
          setContent('# Welcome to InkForge\n\nStart writing your document here...');
          setLastSaved(new Date());
        }
        // TODO: Add real project loading via IPC
        // const result = await window.electronAPI.projects.load({ filePath: '...' });
        // setContent(result.project.content);
        // setProjectName(result.project.name);
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    };

    loadProject();
  }, [projectId]);

  // Save function (wrapped in useCallback to prevent unnecessary re-renders)
  const handleSave = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      // For demo, just update timestamp. In production, call IPC to save
      if (projectId === 'demo') {
        setLastSaved(new Date());
        console.log('Demo save - content:', contentRef.current.substring(0, 100));
      }
      // TODO: Add real project saving via IPC
      // await window.electronAPI.projects.save({
      //   id: projectId,
      //   content: contentRef.current,
      // });
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, projectId]);

  // PDF Preview function
  const handlePreview = async () => {
    if (isPreviewing || !content) return;

    setIsPreviewing(true);
    try {
      // Save first to ensure latest content
      await handleSave();

      if (projectId === 'demo') {
        alert(
          'PDF Preview is not available in demo mode. Real projects use IPC to generate preview.'
        );
        return;
      }

      // TODO: Add real PDF preview via IPC
      // const result = await window.electronAPI.pdf.preview({ projectId });
      // if (result.success && result.data.dataUrl) {
      //   // Open preview in new window or modal
      //   const win = window.open('', '_blank');
      //   if (win) {
      //     win.document.write(`
      //       <iframe src="${result.data.dataUrl}"
      //         style="width:100%; height:100vh; border:none;"></iframe>
      //     `);
      //   }
      // } else {
      //   alert('Failed to generate PDF preview');
      // }
    } catch (error) {
      console.error('Failed to preview PDF:', error);
      alert(`Failed to preview PDF: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsPreviewing(false);
    }
  };

  // PDF Export function
  const handleExport = async () => {
    if (isExporting || !content) return;

    setIsExporting(true);
    try {
      // Save first to ensure latest content
      await handleSave();

      if (projectId === 'demo') {
        alert('PDF Export is not available in demo mode. Real projects use IPC to export to file.');
        return;
      }

      // TODO: Add real PDF export via IPC
      // // Show save dialog
      // const saveResult = await window.electronAPI.file.saveDialog({
      //   title: 'Export PDF',
      //   defaultPath: `${projectName}.pdf`,
      //   filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
      // });
      //
      // if (saveResult.success && saveResult.data.filePath) {
      //   // Export PDF
      //   const exportResult = await window.electronAPI.pdf.export({
      //     projectId,
      //     outputPath: saveResult.data.filePath,
      //     openAfterExport: true,
      //   });
      //
      //   if (exportResult.success) {
      //     alert(`PDF exported successfully to ${exportResult.data.filePath}`);
      //   } else {
      //     alert('Failed to export PDF');
      //   }
      // }
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button size="sm" variant="ghost" onClick={() => navigate({ to: '/' })}>
              ← Back
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">{projectName}</h1>
            {isSaving && <span className="text-sm text-gray-500">Saving...</span>}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Last saved: {formatLastSaved()}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePreview}
              disabled={isPreviewing || !content}
            >
              {isPreviewing ? 'Generating...' : 'Preview PDF'}
            </Button>
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

      {/* Editor Content */}
      <div className="p-6">
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold">Markdown Editor</h2>
          </Card.Header>
          <Card.Body>
            <TiptapEditor
              content={content}
              onUpdate={(newContent) => setContent(newContent)}
              placeholder="Start writing your document in markdown..."
            />
          </Card.Body>
          <Card.Footer>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Last saved: {formatLastSaved()} • {content.length} characters
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    console.log('Markdown content:', content);
                    alert('Markdown content logged to console');
                  }}
                >
                  View Markdown
                </Button>
                <Button size="sm" variant="outline" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}

export default EditorView;
