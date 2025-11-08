import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import EditorView from './views/EditorView';
import HomeView from './views/HomeView';

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

// Create route tree
const routeTree = rootRoute.addChildren([indexRoute, editorRoute]);

// Create router instance
export const router = createRouter({ routeTree });

// Register router types for TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
