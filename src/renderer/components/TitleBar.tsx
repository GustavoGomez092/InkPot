import { useEffect, useState } from 'react';

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check initial maximized state
    const checkMaximized = async () => {
      const maximized = await window.electronAPI.window.isMaximized();
      setIsMaximized(maximized);
    };
    checkMaximized();

    // Listen for maximize/unmaximize events
    const removeMaximizeListener = window.electronAPI.window.onMaximize(() => {
      setIsMaximized(true);
    });

    const removeUnmaximizeListener = window.electronAPI.window.onUnmaximize(() => {
      setIsMaximized(false);
    });

    return () => {
      removeMaximizeListener();
      removeUnmaximizeListener();
    };
  }, []);

  const handleMinimize = () => {
    window.electronAPI.window.minimize();
  };

  const handleMaximize = () => {
    window.electronAPI.window.maximize();
  };

  const handleClose = () => {
    window.electronAPI.window.close();
  };

  return (
    <div
      className="flex bg-primary/5 items-center justify-center h-11 bg-card/95 backdrop-blur-xl border-b border-border/30 select-none relative"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Traffic light controls - macOS style, left side */}
      <div
        className="absolute left-3 flex items-center gap-2"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="group w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-all duration-200 flex items-center justify-center"
          title="Close"
          aria-label="Close window"
        >
          {isHovered && (
            <svg
              className="w-2 h-2 text-[#9f0a00] opacity-0 group-hover:opacity-100 transition-opacity"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 12 12"
            >
              <path d="M3 3l6 6M9 3L3 9" strokeLinecap="round" />
            </svg>
          )}
        </button>

        {/* Minimize button */}
        <button
          onClick={handleMinimize}
          className="group w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 transition-all duration-200 flex items-center justify-center"
          title="Minimize"
          aria-label="Minimize window"
        >
          {isHovered && (
            <svg
              className="w-2 h-2 text-[#9e6a00] opacity-0 group-hover:opacity-100 transition-opacity"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 12 12"
            >
              <path d="M3 6h6" strokeLinecap="round" />
            </svg>
          )}
        </button>

        {/* Maximize/Restore button */}
        <button
          onClick={handleMaximize}
          className="group w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 transition-all duration-200 flex items-center justify-center"
          title={isMaximized ? 'Restore' : 'Maximize'}
          aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
        >
          {isHovered && (
            <svg
              className="w-2 h-2 text-[#006700] opacity-0 group-hover:opacity-100 transition-opacity"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 12 12"
            >
              {isMaximized ? (
                // Restore icon - two overlapping rectangles
                <>
                  <path d="M4 4h5v5" strokeLinecap="round" />
                  <path d="M3 8V3h5" strokeLinecap="round" />
                </>
              ) : (
                // Maximize icon - diagonal arrows
                <>
                  <path
                    d="M3 3l2.5 2.5M9 9L6.5 6.5M9 3L6.5 5.5M3 9l2.5-2.5"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          )}
        </button>
      </div>

      {/* App title - centered */}
      <div className="text-sm font-medium text-foreground/70">InkPot</div>
    </div>
  );
}
