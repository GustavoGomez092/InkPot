import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button, Card } from '../components/ui';

interface FontOption {
  value: string;
  label: string;
  category: 'serif' | 'sans-serif' | 'monospace' | 'display' | 'handwriting';
}

interface ThemeSummary {
  id: string;
  name: string;
  isBuiltIn: boolean;
  headingFont: string;
  bodyFont: string;
}

// Popular Google Fonts curated list
const GOOGLE_FONTS: FontOption[] = [
  // Sans-serif fonts
  { value: 'Inter', label: 'Inter', category: 'sans-serif' },
  { value: 'Roboto', label: 'Roboto', category: 'sans-serif' },
  { value: 'Open Sans', label: 'Open Sans', category: 'sans-serif' },
  { value: 'Lato', label: 'Lato', category: 'sans-serif' },
  { value: 'Montserrat', label: 'Montserrat', category: 'sans-serif' },
  { value: 'Poppins', label: 'Poppins', category: 'sans-serif' },
  { value: 'Raleway', label: 'Raleway', category: 'sans-serif' },
  { value: 'Ubuntu', label: 'Ubuntu', category: 'sans-serif' },
  { value: 'Nunito', label: 'Nunito', category: 'sans-serif' },
  { value: 'Work Sans', label: 'Work Sans', category: 'sans-serif' },

  // Serif fonts
  { value: 'Source Serif 4', label: 'Source Serif 4', category: 'serif' },
  { value: 'Merriweather', label: 'Merriweather', category: 'serif' },
  { value: 'Playfair Display', label: 'Playfair Display', category: 'serif' },
  { value: 'Lora', label: 'Lora', category: 'serif' },
  { value: 'PT Serif', label: 'PT Serif', category: 'serif' },
  { value: 'Crimson Text', label: 'Crimson Text', category: 'serif' },
  { value: 'EB Garamond', label: 'EB Garamond', category: 'serif' },
  { value: 'Libre Baskerville', label: 'Libre Baskerville', category: 'serif' },
  { value: 'Cormorant', label: 'Cormorant', category: 'serif' },

  // Monospace fonts
  { value: 'JetBrains Mono', label: 'JetBrains Mono', category: 'monospace' },
  { value: 'Source Code Pro', label: 'Source Code Pro', category: 'monospace' },
  { value: 'Fira Code', label: 'Fira Code', category: 'monospace' },
  { value: 'IBM Plex Mono', label: 'IBM Plex Mono', category: 'monospace' },
  { value: 'Roboto Mono', label: 'Roboto Mono', category: 'monospace' },
];

function SettingsView() {
  const [themes, setThemes] = useState<ThemeSummary[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('');
  const [themeName, setThemeName] = useState<string>('');
  
  // Typography
  const [headingFont, setHeadingFont] = useState<string>('Inter');
  const [bodyFont, setBodyFont] = useState<string>('Source Serif 4');
  const [h1Size, setH1Size] = useState<number>(32);
  const [h2Size, setH2Size] = useState<number>(24);
  const [h3Size, setH3Size] = useState<number>(20);
  const [h4Size, setH4Size] = useState<number>(16);
  const [h5Size, setH5Size] = useState<number>(14);
  const [h6Size, setH6Size] = useState<number>(12);
  const [bodySize, setBodySize] = useState<number>(11);
  
  // Spacing
  const [kerning, setKerning] = useState<number>(0);
  const [leading, setLeading] = useState<number>(1.5);
  
  // Layout
  const [pageWidth, setPageWidth] = useState<number>(8.5);
  const [pageHeight, setPageHeight] = useState<number>(11);
  const [marginTop, setMarginTop] = useState<number>(1);
  const [marginBottom, setMarginBottom] = useState<number>(1);
  const [marginLeft, setMarginLeft] = useState<number>(1);
  const [marginRight, setMarginRight] = useState<number>(1);
  
  // Colors
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [textColor, setTextColor] = useState<string>('#000000');
  const [headingColor, setHeadingColor] = useState<string>('#000000');
  const [linkColor, setLinkColor] = useState<string>('#0066CC');
  const [codeBackground, setCodeBackground] = useState<string>('#F5F5F5');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [settingActive, setSettingActive] = useState(false);
  const [downloadingFont, setDownloadingFont] = useState<string | null>(null);
  const navigate = useNavigate();

  const hasElectronAPI = typeof window !== 'undefined' && 'electronAPI' in window;

  useEffect(() => {
    if (!hasElectronAPI) {
      setLoading(false);
      return;
    }

    const api = window.electronAPI;

    // Load themes
    api.themes
      .list({ includeBuiltIn: true })
      .then((result) => {
        if (result.success && result.data) {
          setThemes(result.data);

          // Try to load the active theme from localStorage
          const activeThemeId = localStorage.getItem('activeThemeId');

          // Select the active theme if it exists, otherwise select the first theme
          if (result.data.length > 0) {
            let themeToSelect = result.data[0];

            // Check if the active theme exists in the list
            if (activeThemeId) {
              const activeTheme = result.data.find((t) => t.id === activeThemeId);
              if (activeTheme) {
                themeToSelect = activeTheme;
              }
            }

            // Load full theme data
            handleThemeChange(themeToSelect.id);
          }
        } else {
          console.error('Failed to load themes: Invalid response', result);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load themes:', err);
        setLoading(false);
      });
  }, [hasElectronAPI]);

  // Load Google Fonts dynamically for preview using style tag
  useEffect(() => {
    const fontsToLoad = new Set([headingFont, bodyFont]);

    fontsToLoad.forEach((fontFamily) => {
      // Check if font style already exists
      const styleId = `google-font-${fontFamily.replace(/\s+/g, '-')}`;
      if (document.getElementById(styleId)) {
        return; // Already loaded
      }

      // Create and append style element with @import for Google Fonts
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `@import url('https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:ital,wght@0,400;0,600;1,400;1,600&display=swap');`;
      document.head.appendChild(style);
    });
  }, [headingFont, bodyFont]);

  const handleThemeChange = async (themeId: string) => {
    if (!hasElectronAPI) return;
    
    const api = window.electronAPI;
    
    try {
      // Fetch full theme data
      const result = await api.themes.get({ id: themeId });
      
      if (result.success && result.data) {
        const theme = result.data;
        setSelectedThemeId(themeId);
        setThemeName(theme.name);
        setHeadingFont(theme.headingFont);
        setBodyFont(theme.bodyFont);
        setH1Size(theme.h1Size);
        setH2Size(theme.h2Size);
        setH3Size(theme.h3Size);
        setH4Size(theme.h4Size);
        setH5Size(theme.h5Size);
        setH6Size(theme.h6Size);
        setBodySize(theme.bodySize);
        setKerning(theme.kerning);
        setLeading(theme.leading);
        setPageWidth(theme.pageWidth);
        setPageHeight(theme.pageHeight);
        setMarginTop(theme.marginTop);
        setMarginBottom(theme.marginBottom);
        setMarginLeft(theme.marginLeft);
        setMarginRight(theme.marginRight);
        setBackgroundColor(theme.backgroundColor);
        setTextColor(theme.textColor);
        setHeadingColor(theme.headingColor);
        setLinkColor(theme.linkColor);
        setCodeBackground(theme.codeBackground);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const handleDownloadAndApplyFont = async (fontFamily: string, type: 'heading' | 'body') => {
    if (!hasElectronAPI) return;

    setDownloadingFont(fontFamily);

    const api = window.electronAPI;

    try {
      // Download the font
      const downloadResult = await api.fonts.download({
        family: fontFamily,
        variants: ['regular', 'italic', '600', '600italic'],
      });

      if (!downloadResult.success) {
        alert(`Failed to download font: ${downloadResult.error.message}`);
        setDownloadingFont(null);
        return;
      }

      // Update the local state
      if (type === 'heading') {
        setHeadingFont(fontFamily);
      } else {
        setBodyFont(fontFamily);
      }

      setDownloadingFont(null);
    } catch (error) {
      console.error('Failed to download font:', error);
      alert('Failed to download font. Please try again.');
      setDownloadingFont(null);
    }
  };

  const handleSaveTheme = async () => {
    if (!hasElectronAPI) return;

    // Validate theme name
    if (!themeName.trim()) {
      alert('Please enter a theme name');
      return;
    }

    setSaving(true);

    const api = window.electronAPI;

    try {
      const selectedTheme = themes.find((t) => t.id === selectedThemeId);

      // If no theme selected OR it's a built-in theme, create a new custom theme
      if (!selectedTheme || selectedTheme.isBuiltIn) {
        const result = await api.themes.create({
          name: themeName,
          headingFont,
          bodyFont,
          h1Size,
          h2Size,
          h3Size,
          h4Size,
          h5Size,
          h6Size,
          bodySize,
          kerning,
          leading,
          pageWidth,
          pageHeight,
          marginTop,
          marginBottom,
          marginLeft,
          marginRight,
          backgroundColor,
          textColor,
          headingColor,
          linkColor,
          codeBackground,
        });

        if (result.success) {
          alert('Custom theme created successfully!');
          // Reload themes
          const listResult = await api.themes.list({ includeBuiltIn: true });
          if (listResult.success) {
            setThemes(listResult.data);
            setSelectedThemeId(result.data.id);
            setThemeName(result.data.name);
          }
        } else {
          alert(`Failed to create theme: ${result.error.message}`);
        }
      } else {
        // Update existing custom theme
        const result = await api.themes.update({
          id: selectedThemeId,
          updates: {
            headingFont,
            bodyFont,
            h1Size,
            h2Size,
            h3Size,
            h4Size,
            h5Size,
            h6Size,
            bodySize,
            kerning,
            leading,
            pageWidth,
            pageHeight,
            marginTop,
            marginBottom,
            marginLeft,
            marginRight,
            backgroundColor,
            textColor,
            headingColor,
            linkColor,
            codeBackground,
          },
        });

        if (result.success) {
          alert('Theme updated successfully!');
          // Reload themes
          const listResult = await api.themes.list({ includeBuiltIn: true });
          if (listResult.success) {
            setThemes(listResult.data);
          }
        } else {
          alert(`Failed to update theme: ${result.error.message}`);
        }
      }

      setSaving(false);
    } catch (error) {
      console.error('Failed to save theme:', error);
      alert('Failed to save theme. Please try again.');
      setSaving(false);
    }
  };

  const handleDeleteTheme = async () => {
    if (!hasElectronAPI) return;

    const selectedTheme = themes.find((t) => t.id === selectedThemeId);

    if (!selectedTheme) {
      alert('No theme selected');
      return;
    }

    if (selectedTheme.isBuiltIn) {
      alert('Cannot delete built-in themes');
      return;
    }

    if (!confirm(`Are you sure you want to delete the theme "${selectedTheme.name}"?`)) {
      return;
    }

    setDeleting(true);

    const api = window.electronAPI;

    try {
      const result = await api.themes.delete({ id: selectedThemeId });

      if (result.success) {
        alert('Theme deleted successfully!');
        // Reload themes
        const listResult = await api.themes.list({ includeBuiltIn: true });
        if (listResult.success) {
          setThemes(listResult.data);
          // Select first theme after deletion
          if (listResult.data.length > 0) {
            const firstTheme = listResult.data[0];
            setSelectedThemeId(firstTheme.id);
            setThemeName(firstTheme.name);
            setHeadingFont(firstTheme.headingFont);
            setBodyFont(firstTheme.bodyFont);
          }
        }
      } else {
        alert(`Failed to delete theme: ${result.error.message}`);
      }

      setDeleting(false);
    } catch (error) {
      console.error('Failed to delete theme:', error);
      alert('Failed to delete theme. Please try again.');
      setDeleting(false);
    }
  };

  const handleSetAsActiveTheme = async () => {
    if (!hasElectronAPI) return;

    const selectedTheme = themes.find((t) => t.id === selectedThemeId);

    if (!selectedTheme) {
      alert('No theme selected');
      return;
    }

    setSettingActive(true);

    try {
      // Store the active theme ID in localStorage for now
      // TODO: This could be stored in a proper settings table in the database
      localStorage.setItem('activeThemeId', selectedThemeId);
      alert(
        `"${selectedTheme.name}" is now set as the active theme for new projects and PDF exports.`
      );
      setSettingActive(false);
    } catch (error) {
      console.error('Failed to set active theme:', error);
      alert('Failed to set active theme. Please try again.');
      setSettingActive(false);
    }
  };

  const groupedFonts = {
    'Sans-serif': GOOGLE_FONTS.filter((f) => f.category === 'sans-serif'),
    Serif: GOOGLE_FONTS.filter((f) => f.category === 'serif'),
    Monospace: GOOGLE_FONTS.filter((f) => f.category === 'monospace'),
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-60 bg-card border-r border-border flex flex-col">
        {/* App Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
            <img 
              src="/Assets/PNG/App-logo.png" 
              alt="InkForge Logo" 
              className="w-10 h-10 rounded-lg"
            />
            <div>
              <h1 className="text-sm font-semibold text-foreground">InkForge</h1>
              <p className="text-xs text-muted-foreground">Markdown to PDF</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <button
            onClick={() => navigate({ to: '/' })}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-all cursor-pointer hover:opacity-90"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Recent Projects
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md bg-accent text-accent-foreground cursor-pointer hover:opacity-90 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-all cursor-pointer hover:opacity-90">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Help
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-8 py-6 border-b border-border">
          <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Customize fonts and themes for your PDF exports
          </p>
        </header>

        {/* Settings Content - Split Screen */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading settings...</p>
            </div>
          ) : !themes || themes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <svg
                className="w-16 h-16 text-muted-foreground mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-foreground mb-2">No themes available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Unable to load themes. Please try restarting the application.
              </p>
            </div>
          ) : (
            <div className="flex h-full">
              {/* Left Side - Theme Settings */}
              <div className="w-3/5 border-r border-border overflow-y-auto px-8 py-6">
                <div className="max-w-2xl space-y-6">
              {/* Theme Selection */}
              <Card>
                <Card.Body className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Theme</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Select Theme
                      </label>
                      <select
                        value={selectedThemeId}
                        onChange={(e) => handleThemeChange(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input cursor-pointer hover:border-ring transition-all"
                      >
                        {themes?.map((theme) => (
                          <option key={theme.id} value={theme.id}>
                            {theme.name} {theme.isBuiltIn ? '(Built-in)' : '(Custom)'}
                          </option>
                        )) || []}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Theme Name
                      </label>
                      <input
                        type="text"
                        value={themeName}
                        onChange={(e) => setThemeName(e.target.value)}
                        placeholder="Enter theme name"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        {themes.find((t) => t.id === selectedThemeId)?.isBuiltIn
                          ? 'Creating a new theme will save it with this name'
                          : 'Name is set when creating the theme'}
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Font Settings */}
              <Card>
                <Card.Body className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Font Settings</h3>
                  <div className="space-y-6">
                    {/* Heading Font */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Heading Font
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={headingFont}
                          onChange={(e) => handleDownloadAndApplyFont(e.target.value, 'heading')}
                          className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed cursor-pointer hover:border-ring transition-all"
                          disabled={downloadingFont !== null}
                        >
                          {Object.entries(groupedFonts).map(([category, fonts]) => (
                            <optgroup key={category} label={category}>
                              {fonts.map((font) => (
                                <option key={font.value} value={font.value}>
                                  {font.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                      <p className="mt-2 text-sm font-medium" style={{ fontFamily: headingFont }}>
                        The Quick Brown Fox Jumps Over The Lazy Dog
                      </p>
                      {downloadingFont === headingFont && (
                        <p className="mt-1 text-xs text-primary">Downloading font...</p>
                      )}
                    </div>

                    {/* Body Font */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Body Font
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={bodyFont}
                          onChange={(e) => handleDownloadAndApplyFont(e.target.value, 'body')}
                          className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed cursor-pointer hover:border-ring transition-all"
                          disabled={downloadingFont !== null}
                        >
                          {Object.entries(groupedFonts).map(([category, fonts]) => (
                            <optgroup key={category} label={category}>
                              {fonts.map((font) => (
                                <option key={font.value} value={font.value}>
                                  {font.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                      <p className="mt-2 text-sm" style={{ fontFamily: bodyFont }}>
                        The Quick Brown Fox Jumps Over The Lazy Dog
                      </p>
                      {downloadingFont === bodyFont && (
                        <p className="mt-1 text-xs text-primary">Downloading font...</p>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Typography Sizes */}
              <Card>
                <Card.Body className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Typography Sizes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        H1 Size (pt)
                      </label>
                      <input
                        type="number"
                        value={h1Size}
                        onChange={(e) => setH1Size(Number(e.target.value))}
                        min="8"
                        max="72"
                        step="1"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        H2 Size (pt)
                      </label>
                      <input
                        type="number"
                        value={h2Size}
                        onChange={(e) => setH2Size(Number(e.target.value))}
                        min="8"
                        max="72"
                        step="1"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        H3 Size (pt)
                      </label>
                      <input
                        type="number"
                        value={h3Size}
                        onChange={(e) => setH3Size(Number(e.target.value))}
                        min="8"
                        max="72"
                        step="1"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        H4 Size (pt)
                      </label>
                      <input
                        type="number"
                        value={h4Size}
                        onChange={(e) => setH4Size(Number(e.target.value))}
                        min="8"
                        max="72"
                        step="1"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        H5 Size (pt)
                      </label>
                      <input
                        type="number"
                        value={h5Size}
                        onChange={(e) => setH5Size(Number(e.target.value))}
                        min="8"
                        max="72"
                        step="1"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        H6 Size (pt)
                      </label>
                      <input
                        type="number"
                        value={h6Size}
                        onChange={(e) => setH6Size(Number(e.target.value))}
                        min="8"
                        max="72"
                        step="1"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Body Size (pt)
                      </label>
                      <input
                        type="number"
                        value={bodySize}
                        onChange={(e) => setBodySize(Number(e.target.value))}
                        min="8"
                        max="24"
                        step="0.5"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Spacing */}
              <Card>
                <Card.Body className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Spacing</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Letter Spacing (em)
                      </label>
                      <input
                        type="number"
                        value={kerning}
                        onChange={(e) => setKerning(Number(e.target.value))}
                        min="-0.1"
                        max="0.5"
                        step="0.01"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">Tracking/kerning adjustment</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Line Height (multiplier)
                      </label>
                      <input
                        type="number"
                        value={leading}
                        onChange={(e) => setLeading(Number(e.target.value))}
                        min="1"
                        max="3"
                        step="0.1"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">Leading/line-height multiplier</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Page Layout */}
              <Card>
                <Card.Body className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Page Layout</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Page Width (inches)
                      </label>
                      <input
                        type="number"
                        value={pageWidth}
                        onChange={(e) => setPageWidth(Number(e.target.value))}
                        min="3"
                        max="17"
                        step="0.1"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Page Height (inches)
                      </label>
                      <input
                        type="number"
                        value={pageHeight}
                        onChange={(e) => setPageHeight(Number(e.target.value))}
                        min="3"
                        max="17"
                        step="0.1"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Top Margin (inches)
                      </label>
                      <input
                        type="number"
                        value={marginTop}
                        onChange={(e) => setMarginTop(Number(e.target.value))}
                        min="0"
                        max="3"
                        step="0.1"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bottom Margin (inches)
                      </label>
                      <input
                        type="number"
                        value={marginBottom}
                        onChange={(e) => setMarginBottom(Number(e.target.value))}
                        min="0"
                        max="3"
                        step="0.1"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Left Margin (inches)
                      </label>
                      <input
                        type="number"
                        value={marginLeft}
                        onChange={(e) => setMarginLeft(Number(e.target.value))}
                        min="0"
                        max="3"
                        step="0.1"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Right Margin (inches)
                      </label>
                      <input
                        type="number"
                        value={marginRight}
                        onChange={(e) => setMarginRight(Number(e.target.value))}
                        min="0"
                        max="3"
                        step="0.1"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Colors */}
              <Card>
                <Card.Body className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Colors</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Background Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="h-10 w-16 border rounded-lg cursor-pointer border-input"
                        />
                        <input
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          placeholder="#FFFFFF"
                          className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Text Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="h-10 w-16 border rounded-lg cursor-pointer border-input"
                        />
                        <input
                          type="text"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          placeholder="#000000"
                          className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Heading Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={headingColor}
                          onChange={(e) => setHeadingColor(e.target.value)}
                          className="h-10 w-16 border rounded-lg cursor-pointer border-input"
                        />
                        <input
                          type="text"
                          value={headingColor}
                          onChange={(e) => setHeadingColor(e.target.value)}
                          placeholder="#000000"
                          className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Link Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={linkColor}
                          onChange={(e) => setLinkColor(e.target.value)}
                          className="h-10 w-16 border rounded-lg cursor-pointer border-input"
                        />
                        <input
                          type="text"
                          value={linkColor}
                          onChange={(e) => setLinkColor(e.target.value)}
                          placeholder="#0066CC"
                          className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Code Background Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={codeBackground}
                          onChange={(e) => setCodeBackground(e.target.value)}
                          className="h-10 w-16 border rounded-lg cursor-pointer border-input"
                        />
                        <input
                          type="text"
                          value={codeBackground}
                          onChange={(e) => setCodeBackground(e.target.value)}
                          placeholder="#F5F5F5"
                          className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border-input hover:border-ring transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-4">
              {/* Left side - Set Active Theme */}
              <Button
                variant="secondary"
                onClick={handleSetAsActiveTheme}
                disabled={settingActive || saving || deleting}
              >
                {settingActive ? 'Setting...' : 'Set as Active Theme'}
              </Button>                {/* Right side - Save/Delete Buttons */}
                <div className="flex gap-3">
                  {!themes.find((t) => t.id === selectedThemeId)?.isBuiltIn && (
                    <Button
                      variant="outline"
                      onClick={handleDeleteTheme}
                      disabled={deleting || saving || settingActive}
                    >
                      {deleting ? 'Deleting...' : 'Delete Theme'}
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    onClick={handleSaveTheme}
                    disabled={saving || downloadingFont !== null || settingActive}
                  >
                    {saving
                      ? 'Saving...'
                      : themes.find((t) => t.id === selectedThemeId)?.isBuiltIn
                        ? 'Save as New Theme'
                        : 'Update Theme'}
                  </Button>
                </div>
              </div>
            </div>
              </div>
              
              {/* Right Side - Live Preview (60% width) */}
              <div className="w-2/5 overflow-y-auto p-8 bg-muted/20">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{themeName} Theme Preview</h3>
                  <p className="text-sm text-muted-foreground">Live preview of your theme settings</p>
                </div>
                
                {/* Preview Document Container with scaling */}
                <div className="flex justify-center">
                  <div 
                    style={{
                      transform: 'scale(0.7)',
                      transformOrigin: 'top center',
                    }}
                  >
                    <div 
                      className="bg-white shadow-lg rounded-lg overflow-hidden"
                      style={{
                        width: `${pageWidth * 96}px`, // 96 DPI
                        minHeight: `${pageHeight * 96}px`,
                        padding: `${marginTop * 96}px ${marginRight * 96}px ${marginBottom * 96}px ${marginLeft * 96}px`,
                        backgroundColor: backgroundColor,
                        color: textColor,
                        fontFamily: bodyFont,
                        fontSize: `${bodySize}pt`,
                        lineHeight: leading,
                        letterSpacing: `${kerning}em`,
                      }}
                    >
                      <h1 
                        style={{ 
                          fontFamily: headingFont, 
                          fontSize: `${h1Size}pt`, 
                          color: headingColor,
                          marginBottom: '0.5em',
                          fontWeight: 600,
                        }}
                      >
                        Heading 1 Sample
                      </h1>
                      
                      <p style={{ marginBottom: '1em' }}>
                        This is a sample paragraph demonstrating the body text styling. 
                        The quick brown fox jumps over the lazy dog. Typography settings 
                        including font family, size, line height, and letter spacing are 
                        all reflected in real-time.
                      </p>
                      
                      <h2 
                        style={{ 
                          fontFamily: headingFont, 
                          fontSize: `${h2Size}pt`, 
                          color: headingColor,
                          marginTop: '1em',
                          marginBottom: '0.5em',
                          fontWeight: 600,
                        }}
                      >
                        Heading 2 Sample
                      </h2>
                      
                      <p style={{ marginBottom: '1em' }}>
                        Another paragraph with <a href="#" style={{ color: linkColor, textDecoration: 'underline' }}>a hyperlink example</a> to show 
                        link colors. This helps you visualize how links will appear in your 
                        final PDF documents.
                      </p>
                      
                      <h3 
                        style={{ 
                          fontFamily: headingFont, 
                          fontSize: `${h3Size}pt`, 
                          color: headingColor,
                          marginTop: '1em',
                          marginBottom: '0.5em',
                          fontWeight: 600,
                        }}
                      >
                        Heading 3 Sample
                      </h3>
                      
                      <pre 
                        style={{ 
                          backgroundColor: codeBackground,
                          padding: '1em',
                          borderRadius: '4px',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: `${bodySize * 0.9}pt`,
                          overflowX: 'auto',
                          marginBottom: '1em',
                        }}
                      >
                        <code>{`function example() {
  console.log("Code block sample");
  return true;
}`}</code>
                      </pre>
                      
                      <h4 
                        style={{ 
                          fontFamily: headingFont, 
                          fontSize: `${h4Size}pt`, 
                          color: headingColor,
                          marginTop: '1em',
                          marginBottom: '0.5em',
                          fontWeight: 600,
                        }}
                      >
                        Heading 4 Sample
                      </h4>
                      
                      <ul style={{ marginBottom: '1em', paddingLeft: '2em' }}>
                        <li>First list item</li>
                        <li>Second list item</li>
                        <li>Third list item with more text to show wrapping behavior</li>
                      </ul>
                      
                      <h5 
                        style={{ 
                          fontFamily: headingFont, 
                          fontSize: `${h5Size}pt`, 
                          color: headingColor,
                          marginTop: '1em',
                          marginBottom: '0.5em',
                          fontWeight: 600,
                        }}
                      >
                        Heading 5 Sample
                      </h5>
                      
                      <p style={{ marginBottom: '1em' }}>
                        More body text to demonstrate the overall look and feel of your theme.
                        Pay attention to spacing, colors, and typography hierarchy.
                      </p>
                      
                      <h6 
                        style={{ 
                          fontFamily: headingFont, 
                          fontSize: `${h6Size}pt`, 
                          color: headingColor,
                          marginTop: '1em',
                          marginBottom: '0.5em',
                          fontWeight: 600,
                        }}
                      >
                        Heading 6 Sample
                      </h6>
                      
                      <p>
                        Final paragraph demonstrating the smallest heading and body text 
                        combination. All theme settings update in real-time as you adjust them.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SettingsView;
