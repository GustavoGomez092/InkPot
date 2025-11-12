import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Button, Card, CardContent, Input } from '../components/ui';
import NewProjectDialog from './NewProjectDialog';

interface RecentProject {
  id: string;
  title: string;
  subtitle?: string | null;
  author?: string | null;
  filePath: string;
  lastOpenedAt: string;
  themeName?: string | null;
}

function HomeView() {
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const navigate = useNavigate();

  const hasElectronAPI = typeof window !== 'undefined' && 'electronAPI' in window;

  useEffect(() => {
    if (!hasElectronAPI) {
      setLoading(false);
      return;
    }

    const api = window.electronAPI;

    // Fetch recent projects
    api.projects
      .listRecent({ limit: 20 })
      .then((result) => {
        if (result.success) {
          setRecentProjects(result.data.projects);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load recent projects:', err);
        setLoading(false);
      });
  }, [hasElectronAPI]);

  const filteredProjects = recentProjects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  const handleOpenProject = (projectId: string) => {
    navigate({
      to: '/editor/$projectId',
      params: { projectId },
    });
  };

  const handleDeleteProject = async (
    projectId: string,
    projectName: string,
    event: React.MouseEvent
  ) => {
    // Prevent card click event
    event.stopPropagation();

    if (!hasElectronAPI) {
      alert('Electron API not available');
      return;
    }

    // Confirm deletion
    const confirmed = confirm(
      `Are you sure you want to delete "${projectName}"?\n\nThis will remove the project from the database and delete the project file. This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingProjectId(projectId);

    try {
      const result = await window.electronAPI.projects.delete({
        id: projectId,
        deleteFile: true, // Delete both database entry and file
      });

      if (result.success) {
        // Remove from local state
        setRecentProjects((prev) => prev.filter((p) => p.id !== projectId));
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert(
        `Failed to delete project: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setDeletingProjectId(null);
    }
  };

  return (
    <div className="flex h-[94vh] bg-background text-foreground">
      <Sidebar onNewDocument={() => setShowNewProjectDialog(true)} activePage="home" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header with search */}
        <div className="px-8 py-5 mb-6 max-h-32 border-b border-border">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Recent Projects</h2>
          </div>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="text"
              placeholder="Search your projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Projects Grid */}
          <div className="px-8 pb-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first document to get started
                </p>
                <Button onClick={() => setShowNewProjectDialog(true)}>New Document</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="cursor-pointer transition-all group relative hover:shadow-lg"
                    onClick={() => handleOpenProject(project.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base font-semibold text-foreground line-clamp-1 flex-1">
                          {project.title}
                        </h3>
                        <button
                          onClick={(e) => handleDeleteProject(project.id, project.title, e)}
                          disabled={deletingProjectId === project.id}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded text-destructive hover:text-destructive shrink-0"
                          title="Delete project"
                          aria-label="Delete project"
                        >
                          {deletingProjectId === project.id ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-10">
                        {project.subtitle || 'No description'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {formatRelativeTime(project.lastOpenedAt)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <NewProjectDialog
        open={showNewProjectDialog}
        onClose={() => {
          setShowNewProjectDialog(false);
          // Reload projects after creating a new one
          if (hasElectronAPI) {
            window.electronAPI.projects.listRecent({ limit: 20 }).then((result) => {
              if (result.success) {
                setRecentProjects(result.data.projects);
              }
            });
          }
        }}
      />
    </div>
  );
}

export default HomeView;
