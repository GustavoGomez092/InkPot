import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button, Dialog, Input, Select } from '../components/ui';

interface NewProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

interface Theme {
  id: string;
  name: string;
}

function NewProjectDialog({ open, onClose }: NewProjectDialogProps) {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  // Load themes
  useEffect(() => {
    const loadThemes = async () => {
      // Check if Electron API is available
      if (typeof window === 'undefined' || !('electronAPI' in window)) {
        console.warn('Electron API not available');
        return;
      }

      try {
        const result = await (window as any).electronAPI.themes.list({});
        if (result.success) {
          setThemes(result.data);
          if (result.data.length > 0) {
            // Try to use the active theme from localStorage, otherwise use first theme
            const activeThemeId = localStorage.getItem('activeThemeId');
            if (activeThemeId && result.data.find((t: Theme) => t.id === activeThemeId)) {
              setSelectedTheme(activeThemeId);
            } else {
              setSelectedTheme(result.data[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load themes:', err);
      }
    };

    if (open) {
      loadThemes();
    }
  }, [open]);

  const handleCreate = async () => {
    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }

    // Check if Electron API is available
    if (typeof window === 'undefined' || !('electronAPI' in window)) {
      setError('Electron API not available. Please restart the app.');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Get projects path
      const pathsResult = await (window as any).electronAPI.app.paths({});
      if (!pathsResult.success) {
        console.error('App paths error:', pathsResult.error);
        throw new Error(pathsResult.error?.message || 'Failed to get app paths');
      }
      const projectsPath = pathsResult.data.projects;

      // Create safe filename from project name
      const safeFileName = projectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const filePath = `${projectsPath}/${safeFileName}.inkpot`;

      const projectData = {
        name: projectName,
        filePath,
        themeId: selectedTheme || undefined,
        subtitle: description.trim() || undefined,
      };

      console.log('📝 Creating project with data:', projectData);

      // Create project
      const result = await (window as any).electronAPI.projects.create(projectData);

      if (!result.success) {
        throw new Error(result.error.message);
      }

      // Close dialog first
      onClose();

      // Small delay to ensure database transactions complete
      // This ensures the project appears in listRecent before navigation
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Navigate to editor
      navigate({
        to: '/editor/$projectId',
        params: { projectId: result.data.project.id },
      });

      // Reset form
      setProjectName('');
      setDescription('');
      setSelectedTheme(themes[0]?.id || '');
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setProjectName('');
      setDescription('');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Create New Project"
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={isCreating || !projectName.trim()}
          >
            {isCreating ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="Project Name"
          value={projectName}
          onChange={(e) => {
            setProjectName(e.target.value);
            setError('');
          }}
          placeholder="My Document"
          error={error}
          autoFocus
          disabled={isCreating}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Description <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description of your project..."
            disabled={isCreating}
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            {description.length}/500 characters
          </p>
        </div>

        {themes.length > 0 && (
          <Select
            label="Theme"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            options={themes.map((theme) => ({
              value: theme.id,
              label: theme.name,
            }))}
            disabled={isCreating}
          />
        )}

        <p className="text-sm text-muted-foreground">
          Your project will be saved in the InkPot projects folder.
        </p>
      </div>
    </Dialog>
  );
}

export default NewProjectDialog;
