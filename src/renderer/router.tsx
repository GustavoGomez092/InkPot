import {
  createRootRoute,
  createRoute,
  createRouter,
  createHashHistory,
  Outlet,
} from '@tanstack/react-router';
import EditorView from './views/EditorView';
import HomeView from './views/HomeView';
import SettingsView from './views/SettingsView';

// Root route - renders layout with outlet for child routes
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-100">
      <Outlet />
    </div>
  ),
});

// Home route - project selector
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeView,
});

// Editor route - markdown editor for a specific project
const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editor/$projectId',
  component: EditorView,
});

// Settings route - font and theme configuration
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsView,
});

// Create route tree
const routeTree = rootRoute.addChildren([indexRoute, editorRoute, settingsRoute]);

// Create hash history for Electron file:// protocol compatibility
const hashHistory = createHashHistory();

// Create router instance with hash routing for Electron
export const router = createRouter({
  routeTree,
  history: hashHistory,
});

// Register router types for TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
