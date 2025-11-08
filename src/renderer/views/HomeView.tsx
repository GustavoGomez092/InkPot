import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button, Card } from '../components/ui';
import NewProjectDialog from './NewProjectDialog';

interface AppInfo {
  version: string;
  name: string;
}

interface Theme {
  id: string;
  name: string;
  isBuiltIn: boolean;
  headingFont: string;
  bodyFont: string;
}

function HomeView() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const navigate = useNavigate();

  const hasElectronAPI = typeof window !== 'undefined' && 'electronAPI' in window;

  useEffect(() => {
    if (!hasElectronAPI) {
      setLoading(false);
      return;
    }

    const api = window.electronAPI;

    // Fetch app version
    api.app.version().then((result) => {
      if (result.success) {
        setAppInfo(result.data);
      }
    });

    // Fetch themes
    api.themes.list({}).then((result) => {
      if (result.success) {
        setThemes(result.data);
      }
      setLoading(false);
    });
  }, [hasElectronAPI]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-baseline gap-3">
            <h1 className="text-4xl font-bold text-gray-900">InkForge</h1>
            {appInfo && <span className="text-sm text-gray-600">v{appInfo.version}</span>}
          </div>
          <Button variant="primary" onClick={() => setShowNewProjectDialog(true)}>
            + New Project
          </Button>
        </div>
        <p className="text-lg text-gray-700 mb-8">Professional Markdown to PDF Conversion</p>

        <Card className="mb-6">
          <Card.Header>
            <h2 className="text-2xl font-semibold">System Status</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className={`mr-2 ${hasElectronAPI ? 'text-green-600' : 'text-red-600'}`}>
                  {hasElectronAPI ? '✓' : '✗'}
                </span>
                <span>Preload Script: {hasElectronAPI ? 'Connected' : 'Not Connected'}</span>
              </div>
              {hasElectronAPI && (
                <div className="mt-4 p-4 bg-green-50 rounded">
                  <p className="text-green-800">
                    Database operational • IPC ready • {themes.length} themes available
                  </p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {!loading && themes.length > 0 && (
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Available Themes</h2>
                <Button size="sm" variant="outline">
                  Create New Theme
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="grid gap-4">
                {themes.map((theme: Theme) => (
                  <Card key={theme.id} hover className="border-gray-200">
                    <Card.Body className="py-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{theme.name}</h3>
                        {theme.isBuiltIn && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Built-in
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Heading: {theme.headingFont} • Body: {theme.bodyFont}
                      </p>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => {
              // For demo purposes, navigate to demo editor
              navigate({
                to: '/editor/$projectId',
                params: { projectId: 'demo' },
              });
            }}
          >
            Open Demo Editor
          </Button>
        </div>
      </div>

      <NewProjectDialog
        open={showNewProjectDialog}
        onClose={() => setShowNewProjectDialog(false)}
      />
    </div>
  );
}

export default HomeView;
