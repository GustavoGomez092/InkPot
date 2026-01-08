import { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardHeader, CardContent, Input } from '../ui';

interface CoverAsset {
  id: string;
  type: 'logo' | 'background';
  filePath: string;
  width: number | null;
  height: number | null;
}

export interface CoverData {
  title: string;
  subtitle: string;
  author: string;
  hasToc: boolean;
  tocMinLevel: number;
  tocMaxLevel: number;
}

interface CoverEditorProps {
  projectId: string;
  initialTitle?: string | null;
  initialSubtitle?: string | null;
  initialAuthor?: string | null;
  initialHasToc?: boolean;
  initialTocMinLevel?: number;
  initialTocMaxLevel?: number;
  onUpdate?: () => void;
  onDataChange?: (data: CoverData) => void;
}

export function CoverEditor({
  projectId,
  initialTitle,
  initialSubtitle,
  initialAuthor,
  initialHasToc,
  initialTocMinLevel,
  initialTocMaxLevel,
  onUpdate,
  onDataChange,
}: CoverEditorProps) {
  const [title, setTitle] = useState(initialTitle || '');
  const [subtitle, setSubtitle] = useState(initialSubtitle || '');
  const [author, setAuthor] = useState(initialAuthor || '');
  const [hasToc, setHasToc] = useState(initialHasToc ?? true);
  const [tocMinLevel, setTocMinLevel] = useState(initialTocMinLevel ?? 1);
  const [tocMaxLevel, setTocMaxLevel] = useState(initialTocMaxLevel ?? 3);
  const [logoAsset, setLogoAsset] = useState<CoverAsset | null>(null);
  const [backgroundAsset, setBackgroundAsset] = useState<CoverAsset | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [backgroundPreview, setBackgroundPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Notify parent when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({ title, subtitle, author, hasToc, tocMinLevel, tocMaxLevel });
    }
  }, [title, subtitle, author, hasToc, tocMinLevel, tocMaxLevel, onDataChange]);

  // Load existing assets
  useEffect(() => {
    const loadAssets = async () => {
      if (typeof window === 'undefined' || !('electronAPI' in window)) return;

      try {
        const api = window.electronAPI;
        const result = await api.cover.getAssets({ projectId });

        if (result.success) {
          const logo = result.data.assets.find((a) => a.type === 'logo');
          const background = result.data.assets.find((a) => a.type === 'background');

          if (logo) {
            setLogoAsset(logo);
            // Load preview as data URL
            const logoDataResult = await api.cover.getAssetDataUrl({ assetId: logo.id });
            if (logoDataResult.success) {
              setLogoPreview(logoDataResult.data.dataUrl);
            }
          }

          if (background) {
            setBackgroundAsset(background);
            // Load preview as data URL
            const bgDataResult = await api.cover.getAssetDataUrl({ assetId: background.id });
            if (bgDataResult.success) {
              setBackgroundPreview(bgDataResult.data.dataUrl);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load cover assets:', error);
      }
    };

    loadAssets();
  }, [projectId]);

  // Handle logo upload
  const handleLogoUpload = useCallback(async () => {
    if (typeof window === 'undefined' || !('electronAPI' in window)) return;
    if (isUploading) return;

    setIsUploading(true);
    try {
      const api = window.electronAPI;

      // Show file picker
      const fileResult = await api.file.selectFile({
        title: 'Select Logo',
        filters: [
          {
            name: 'Images',
            extensions: ['png', 'jpg', 'jpeg', 'svg'],
          },
        ],
      });

      if (fileResult.success && fileResult.data.filePath) {
        // Upload asset
        const uploadResult = await api.cover.uploadAsset({
          projectId,
          assetType: 'logo',
          filePath: fileResult.data.filePath,
        });

        if (uploadResult.success) {
          const asset = uploadResult.data;
          setLogoAsset({
            id: asset.id,
            type: 'logo',
            filePath: asset.storedPath,
            width: asset.width,
            height: asset.height,
          });

          // Load preview as data URL
          const dataUrlResult = await api.cover.getAssetDataUrl({ assetId: asset.id });
          if (dataUrlResult.success) {
            setLogoPreview(dataUrlResult.data.dataUrl);
          }

          if (onUpdate) onUpdate();
        }
      }
    } catch (error) {
      console.error('Failed to upload logo:', error);
      alert(`Failed to upload logo: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUploading(false);
    }
  }, [projectId, isUploading, onUpdate]);

  // Handle background upload
  const handleBackgroundUpload = useCallback(async () => {
    if (typeof window === 'undefined' || !('electronAPI' in window)) return;
    if (isUploading) return;

    setIsUploading(true);
    try {
      const api = window.electronAPI;

      // Show file picker
      const fileResult = await api.file.selectFile({
        title: 'Select Background Image',
        filters: [
          {
            name: 'Images',
            extensions: ['png', 'jpg', 'jpeg'],
          },
        ],
      });

      if (fileResult.success && fileResult.data.filePath) {
        // Upload asset
        const uploadResult = await api.cover.uploadAsset({
          projectId,
          assetType: 'background',
          filePath: fileResult.data.filePath,
        });

        if (uploadResult.success) {
          const asset = uploadResult.data;
          setBackgroundAsset({
            id: asset.id,
            type: 'background',
            filePath: asset.storedPath,
            width: asset.width,
            height: asset.height,
          });

          // Load preview as data URL
          const dataUrlResult = await api.cover.getAssetDataUrl({ assetId: asset.id });
          if (dataUrlResult.success) {
            setBackgroundPreview(dataUrlResult.data.dataUrl);
          }

          if (onUpdate) onUpdate();
        }
      }
    } catch (error) {
      console.error('Failed to upload background:', error);
      alert(
        `Failed to upload background: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsUploading(false);
    }
  }, [projectId, isUploading, onUpdate]);

  // Handle delete logo
  const handleDeleteLogo = useCallback(async () => {
    if (typeof window === 'undefined' || !('electronAPI' in window)) return;

    try {
      const api = window.electronAPI;
      const result = await api.cover.deleteAsset({
        projectId,
        assetType: 'logo',
      });

      if (result.success) {
        setLogoAsset(null);
        setLogoPreview('');
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete logo:', error);
      alert(`Failed to delete logo: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [projectId, onUpdate]);

  // Handle delete background
  const handleDeleteBackground = useCallback(async () => {
    if (typeof window === 'undefined' || !('electronAPI' in window)) return;

    try {
      const api = window.electronAPI;
      const result = await api.cover.deleteAsset({
        projectId,
        assetType: 'background',
      });

      if (result.success) {
        setBackgroundAsset(null);
        setBackgroundPreview('');
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete background:', error);
      alert(
        `Failed to delete background: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }, [projectId, onUpdate]);

  return (
    <div className="h-full overflow-y-auto p-6 bg-card">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Title Section */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Title</h3>
          </CardHeader>
          <CardContent>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Art of Minimalist Design"
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Subtitle Section */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Subtitle</h3>
          </CardHeader>
          <CardContent>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="A Comprehensive Guide"
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Author Section */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Author</h3>
          </CardHeader>
          <CardContent>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="By Alex Johnson"
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Table of Contents Settings */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Table of Contents</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Enable/Disable TOC */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasToc"
                checked={hasToc}
                onChange={(e) => setHasToc(e.target.checked)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="hasToc" className="text-sm font-medium cursor-pointer">
                Include Table of Contents
              </label>
            </div>

            {/* TOC Level Configuration (only show when TOC is enabled) */}
            {hasToc && (
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tocMinLevel" className="block text-sm font-medium mb-1">
                      Minimum Level
                    </label>
                    <select
                      id="tocMinLevel"
                      value={tocMinLevel}
                      onChange={(e) => {
                        const newMin = Number(e.target.value);
                        setTocMinLevel(newMin);
                        // Ensure max is not less than min
                        if (tocMaxLevel < newMin) {
                          setTocMaxLevel(newMin);
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value={1}>H1</option>
                      <option value={2}>H2</option>
                      <option value={3}>H3</option>
                      <option value={4}>H4</option>
                      <option value={5}>H5</option>
                      <option value={6}>H6</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tocMaxLevel" className="block text-sm font-medium mb-1">
                      Maximum Level
                    </label>
                    <select
                      id="tocMaxLevel"
                      value={tocMaxLevel}
                      onChange={(e) => {
                        const newMax = Number(e.target.value);
                        setTocMaxLevel(newMax);
                        // Ensure min is not greater than max
                        if (tocMinLevel > newMax) {
                          setTocMinLevel(newMax);
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value={1}>H1</option>
                      <option value={2}>H2</option>
                      <option value={3}>H3</option>
                      <option value={4}>H4</option>
                      <option value={5}>H5</option>
                      <option value={6}>H6</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Choose which heading levels to include in the table of contents
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cover Assets Section */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Cover Assets</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Logo */}
            <div>
              <div className="block text-sm font-medium mb-2">Logo</div>
              {logoPreview ? (
                <div className="border border-border rounded-lg p-4 bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {logoAsset?.width && logoAsset?.height
                        ? `${logoAsset.width}×${logoAsset.height}`
                        : 'Logo uploaded'}
                    </span>
                    <Button size="sm" variant="outline" onClick={handleDeleteLogo}>
                      ✕
                    </Button>
                  </div>
                  <img src={logoPreview} alt="Logo preview" className="max-h-24 object-contain" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLogoUpload}
                  disabled={isUploading}
                  className="w-full border-2 border-dashed border-border rounded-lg p-8 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">📄</div>
                    <div className="text-sm font-medium text-foreground">
                      {isUploading ? 'Uploading...' : 'Upload Logo'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      your_logo_file.svg
                      <br />
                      48.2 KB
                      <br />
                      300×150
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* Background Image */}
            <div>
              <div className="block text-sm font-medium mb-2">Background Image</div>
              {backgroundPreview ? (
                <div className="border border-border rounded-lg p-4 bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {backgroundAsset?.width && backgroundAsset?.height
                        ? `${backgroundAsset.width}×${backgroundAsset.height}`
                        : 'Background uploaded'}
                    </span>
                    <Button size="sm" variant="outline" onClick={handleDeleteBackground}>
                      ✕
                    </Button>
                  </div>
                  <img
                    src={backgroundPreview}
                    alt="Background preview"
                    className="max-h-32 w-full object-cover rounded"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleBackgroundUpload}
                  disabled={isUploading}
                  className="w-full border-2 border-dashed border-border rounded-lg p-8 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <div className="text-sm font-medium text-foreground">
                      {isUploading ? 'Uploading...' : 'Upload Background'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</div>
                  </div>
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
