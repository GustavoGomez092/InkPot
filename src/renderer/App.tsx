import { useEffect, useState } from 'react';
import { Button, Card } from './components/ui';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/global.css';

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

function App() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  const hasElectronAPI = typeof window !== 'undefined' && 'electronAPI' in window;

  useEffect(() => {
    if (!hasElectronAPI) {
      setLoading(false);
      return;
    }

    const api = (window as any).electronAPI;

    // Fetch app version
    api.app.getVersion().then((result: any) => {
      if (result.success) {
        setAppInfo(result);
      }
    });

    // Fetch themes
    api.themes.list({}).then((result: any) => {
      if (result.success) {
        setThemes(result.themes);
      }
      setLoading(false);
    });
  }, [hasElectronAPI]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-baseline justify-between mb-8">
            <h1 className="text-4xl font-bold text-foreground">InkForge</h1>
            {appInfo && <span className="text-sm text-muted-foreground">v{appInfo.version}</span>}
          </div>
          <p className="text-lg text-foreground mb-8">Professional Markdown to PDF Conversion</p>
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
        </Card>{' '}
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
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
