import { useEffect, useState } from 'react';
import { Button, Card } from './components/ui';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
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

function AppContent() {
  const { theme, toggleTheme } = useTheme();
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
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-baseline gap-3">
            <h1 className="text-4xl font-bold text-foreground">InkForge</h1>
            {appInfo && <span className="text-sm text-muted-foreground">v{appInfo.version}</span>}
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-lg text-foreground mb-8">Professional Markdown to PDF Conversion</p>
        <Card className="mb-6">
          <Card.Header>
            <h2 className="text-2xl font-semibold">System Status</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className={`mr-2 ${hasElectronAPI ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                  {hasElectronAPI ? '✓' : '✗'}
                </span>
                <span>Preload Script: {hasElectronAPI ? 'Connected' : 'Not Connected'}</span>
              </div>
              {hasElectronAPI && (
                <div className="mt-4 p-4 bg-accent/50 text-accent-foreground rounded">
                  <p>
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
                {themes.map((themeItem: Theme) => (
                  <Card key={themeItem.id} hover>
                    <Card.Body className="py-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-card-foreground">{themeItem.name}</h3>
                        {themeItem.isBuiltIn && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Built-in
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Heading: {themeItem.headingFont} • Body: {themeItem.bodyFont}
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
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
