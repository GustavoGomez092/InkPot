import { useNavigate } from '@tanstack/react-router';
import AppLogo from '/Assets/SVG/App-logo-wide.svg';
import { Button } from './ui';

interface SidebarProps {
  onNewDocument?: () => void;
  activePage?: 'home' | 'settings' | 'help';
}

function Sidebar({ onNewDocument, activePage = 'home' }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <aside className="w-60 bg-card border-r border-border flex flex-col">
      {/* App Header - matches main content header height */}
      <div className="flex px-4 py-6 h-32 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={AppLogo} alt="InkPot Logo" className="w-auto h-full" />
        </div>
      </div>
      {/* Actions */}{' '}
      <div className="p-4 h-16">
        {onNewDocument && (
          <Button className="w-full justify-start font-semibold" onClick={onNewDocument}>
            New Document
          </Button>
        )}
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <button
          onClick={() => navigate({ to: '/' })}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:opacity-90 transition-all ${
            activePage === 'home'
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
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
        <button
          onClick={() => navigate({ to: '/settings' })}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:opacity-90 transition-all ${
            activePage === 'settings'
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
        >
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
        <button
          onClick={() => navigate({ to: '/help' })}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:opacity-90 transition-all ${
            activePage === 'help'
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
        >
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
  );
}

export default Sidebar;
