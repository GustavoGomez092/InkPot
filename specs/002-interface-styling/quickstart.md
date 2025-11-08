# Quickstart: Interface Design System Implementation

**Feature**: 002-interface-styling  
**Estimated Time**: 4-6 hours for P1, 8-12 hours total  
**Prerequisites**: Node.js 18+, basic understanding of Tailwind CSS and React Context

## TL;DR

Implement a comprehensive design system with OKLCH colors, custom fonts, and dark mode support. Update 5 existing UI components to use semantic design tokens. Add theme preference persistence via Electron Store + React Context.

**Key Files to Create**:
- `src/renderer/styles/global.css` - Design tokens + Tailwind @theme
- `src/renderer/contexts/ThemeContext.tsx` - React state management
- `src/main/services/theme-service.ts` - Persistence layer

**Key Files to Update**:
- All 5 UI components in `src/renderer/components/ui/`
- `src/main/ipc/handlers.ts` - Add theme IPC handlers

---

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Font packages (local bundling)
npm install @fontsource/inter @fontsource/source-serif-4 @fontsource/jetbrains-mono

# Theme persistence (if not already installed)
npm install electron-store

# Development dependencies (if needed)
npm install --save-dev @types/node
```

### 2. Verify Tailwind v4 Setup

Check `postcss.config.js` has Tailwind configured:
```javascript
module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
  }
}
```

### 3. Create Branch (if not already on 002-interface-styling)

```bash
git checkout 002-interface-styling
```

---

## Implementation Phases

### Phase 1: Design Tokens (Priority P1) - 2 hours

**Goal**: Establish foundation with OKLCH color palette, fonts, shadows, and Tailwind integration.

#### Step 1.1: Update global.css

**File**: `src/renderer/styles/global.css`

Add font imports at top:
```css
/* Font imports */
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';

@import '@fontsource/source-serif-4/400.css';
@import '@fontsource/source-serif-4/600.css';
@import '@fontsource/source-serif-4/700.css';

@import '@fontsource/jetbrains-mono/400.css';
@import '@fontsource/jetbrains-mono/500.css';
@import '@fontsource/jetbrains-mono/700.css';

@import "tailwindcss";
```

Add design tokens using @theme inline (see user's provided CSS for complete token list):
```css
@theme inline {
  /* Color tokens - Light mode */
  --color-primary: oklch(0.80 0.15 95);
  --color-background: oklch(1.00 0 0);
  --color-foreground: oklch(0.09 0.005 247);
  /* ... rest of 40+ color tokens from user's CSS */

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: 'Source Serif 4', Georgia, serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  /* Shadows */
  --shadow-2xs: 0 1px rgb(0 0 0 / 0.05);
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  /* ... rest of shadow tokens */

  /* Spacing & Radius */
  --spacing: 0.25rem;
  --radius: 0.5rem;
  --radius-sm: calc(var(--radius) - 0.125rem);
  /* ... rest of radius tokens */
}

/* Dark mode overrides */
.dark {
  --color-primary: oklch(0.85 0.15 95);
  --color-background: oklch(0.15 0.01 240);
  --color-foreground: oklch(0.98 0 0);
  /* ... rest of dark tokens from user's CSS */
}
```

**Verification**:
```bash
npm run dev
# Open app, inspect element, verify CSS variables exist
```

#### Step 1.2: Create Token Type Definitions

**File**: `src/renderer/styles/tokens.ts` (new)

```typescript
export const colorTokens = {
  primary: 'var(--color-primary)',
  background: 'var(--color-background)',
  foreground: 'var(--color-foreground)',
  // ... export all color tokens
} as const;

export const fontTokens = {
  sans: 'var(--font-sans)',
  serif: 'var(--font-serif)',
  mono: 'var(--font-mono)',
} as const;

export type ColorToken = keyof typeof colorTokens;
export type FontToken = keyof typeof fontTokens;
```

---

### Phase 2: Theme State Management (Priority P1) - 1.5 hours

**Goal**: Add theme persistence and React state management.

#### Step 2.1: Create Theme Service

**File**: `src/main/services/theme-service.ts` (new)

```typescript
import Store from 'electron-store';

type Theme = 'light' | 'dark';

const store = new Store<{ theme: Theme }>();

export const themeService = {
  getTheme: (): Theme => {
    return store.get('theme', 'light'); // Default to light
  },

  setTheme: (theme: Theme): void => {
    if (theme !== 'light' && theme !== 'dark') {
      throw new Error(`Invalid theme: ${theme}`);
    }
    store.set('theme', theme);
  },
};
```

#### Step 2.2: Add IPC Handlers

**File**: `src/main/ipc/handlers.ts` (update)

Add to existing handlers:
```typescript
import { themeService } from '../services/theme-service';

// Add these handlers
ipcMain.handle('theme:get', async () => {
  try {
    return themeService.getTheme();
  } catch (error) {
    console.error('theme:get error:', error);
    return 'light'; // Fallback
  }
});

ipcMain.handle('theme:set', async (_event, theme: unknown) => {
  if (theme !== 'light' && theme !== 'dark') {
    throw new Error(`Invalid theme: ${theme}`);
  }
  try {
    themeService.setTheme(theme as 'light' | 'dark');
  } catch (error) {
    console.error('theme:set error:', error);
    throw error;
  }
});
```

#### Step 2.3: Update Preload Script

**File**: `src/main/preload.ts` (update)

Add theme API to context bridge:
```typescript
contextBridge.exposeInMainWorld('electron', {
  // ... existing APIs
  theme: {
    get: () => ipcRenderer.invoke('theme:get'),
    set: (theme: 'light' | 'dark') => ipcRenderer.invoke('theme:set', theme),
  },
});
```

#### Step 2.4: Create Theme Context

**File**: `src/renderer/contexts/ThemeContext.tsx` (new)

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Load theme on mount
  useEffect(() => {
    window.electron.theme.get().then(setTheme);
  }, []);

  // Apply theme class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Detect system preference on first launch
  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    window.electron.theme.get().then(storedTheme => {
      if (!storedTheme) {
        // First launch - use system preference
        setTheme(systemTheme);
        window.electron.theme.set(systemTheme);
      }
    });
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme); // Instant UI update
    await window.electron.theme.set(newTheme); // Persist
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

#### Step 2.5: Wrap App with ThemeProvider

**File**: `src/renderer/App.tsx` (update)

```typescript
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      {/* Existing app content */}
    </ThemeProvider>
  );
}
```

**Verification**:
```bash
npm run dev
# Open app, check console for errors
# Verify theme preference persists across app restarts
```

---

### Phase 3: Component Migration (Priority P1) - 2 hours

**Goal**: Update all 5 UI components to use design tokens.

#### Token Mapping Reference

Create a mapping document for quick reference:

```typescript
// Old → New
'bg-blue-500' → 'bg-primary'
'text-blue-500' → 'text-primary'
'bg-gray-900' → 'bg-background'
'text-gray-900' → 'text-foreground'
'border-gray-300' → 'border-border'
'bg-white' → 'bg-card'
'text-white' → 'text-card-foreground'
```

#### Update Components (repeat for each)

**Files**: 
- `src/renderer/components/ui/Button.tsx`
- `src/renderer/components/ui/Card.tsx`
- `src/renderer/components/ui/Input.tsx`
- `src/renderer/components/ui/Dialog.tsx`
- `src/renderer/components/ui/Select.tsx`

**Example Migration** (Button.tsx):

**Before**:
```tsx
<button className="bg-blue-500 text-white hover:bg-blue-600 border-gray-300">
  Click me
</button>
```

**After**:
```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90 border-border focus-visible:ring-ring">
  Click me
</button>
```

**Checklist per component**:
- [ ] Replace all hardcoded color classes with semantic tokens
- [ ] Add `focus-visible:ring-ring` to interactive elements
- [ ] Remove dark mode variants (e.g., `dark:bg-gray-800`) - CSS variables handle automatically
- [ ] Test in both light and dark modes
- [ ] Verify no layout shifts when toggling theme

**Bulk Find-Replace Strategy**:

```bash
# Find all color usages
rg 'bg-(blue|gray|white)|text-(blue|gray|white)|border-gray' src/renderer/components/ui/

# Use VS Code find-replace or sed for bulk changes
# Example:
find src/renderer/components/ui/ -name "*.tsx" -exec sed -i '' 's/bg-blue-500/bg-primary/g' {} +
find src/renderer/components/ui/ -name "*.tsx" -exec sed -i '' 's/text-white/text-primary-foreground/g' {} +
# ... repeat for all mappings
```

**Manual Review Required**:
- Hover states (ensure use `/90` opacity modifier)
- Focus rings (ensure use `ring-ring` color)
- Disabled states (ensure use `opacity-50` or `disabled:` variants)

**Verification**:
```bash
npm run dev
# Navigate to all views
# Toggle dark mode (add temporary button if needed)
# Verify all components use theme colors
# Check focus indicators with Tab navigation
```

---

### Phase 4: Dark Mode Toggle UI (Priority P2) - 30 minutes

**Goal**: Add UI control for theme switching.

#### Option A: Add to Settings View

**File**: `src/renderer/views/SettingsView.tsx` (if exists)

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function SettingsView() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <h2>Settings</h2>
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        Dark Mode
      </label>
    </div>
  );
}
```

#### Option B: Add Theme Toggle Button

**File**: `src/renderer/components/ThemeToggle.tsx` (new)

```tsx
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-muted"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

Place in header/navbar:
```tsx
// src/renderer/components/Header.tsx
import { ThemeToggle } from './ThemeToggle';

function Header() {
  return (
    <header>
      {/* Other header content */}
      <ThemeToggle />
    </header>
  );
}
```

---

### Phase 5: Testing & Validation (Priority P2) - 1.5 hours

**Goal**: Verify all success criteria met.

#### Visual Testing Checklist

- [ ] **SC-001**: All components use design tokens (no hardcoded colors)
  - Grep for hardcoded colors: `rg 'bg-(blue|red|green|yellow|indigo|purple|pink)-[0-9]' src/`
  - Expected: Zero matches in component files

- [ ] **SC-002**: Theme switching <300ms
  - Open DevTools Performance panel
  - Record while toggling theme
  - Verify class toggle + repaint completes in <300ms

- [ ] **SC-003**: WCAG AA contrast ratios
  - Use Chrome DevTools color picker on text elements
  - Verify body text ≥4.5:1, large text ≥3:1
  - Test both light and dark modes

- [ ] **SC-004**: Fonts load <2s
  - Network tab → filter "font"
  - Verify Inter 400 loads within 2s
  - Check no font FOUT (flash of unstyled text)

- [ ] **SC-005**: Focus indicators visible
  - Tab through all interactive elements
  - Verify ring appears on all buttons, inputs, links
  - Check contrast against backgrounds

- [ ] **SC-006**: System preference respected
  - Clear Electron Store: `rm ~/Library/Application\ Support/InkForge/config.json`
  - Enable system dark mode
  - Launch app → verify opens in dark mode

- [ ] **SC-007**: Theme persists across restarts
  - Toggle to dark mode
  - Quit app (Cmd+Q)
  - Relaunch → verify still in dark mode

#### Automated Tests

Create `tests/integration/theme-persistence.test.ts`:
```typescript
import { test, expect } from 'vitest';
import { themeService } from '@/main/services/theme-service';

test('theme defaults to light', () => {
  expect(themeService.getTheme()).toBe('light');
});

test('theme persists after toggle', () => {
  themeService.setTheme('dark');
  expect(themeService.getTheme()).toBe('dark');
});

test('rejects invalid themes', () => {
  expect(() => themeService.setTheme('invalid' as any)).toThrow();
});
```

Run tests:
```bash
npm test
```

---

## Common Issues & Solutions

### Issue 1: Fonts Not Loading

**Symptoms**: System fonts used instead of Inter/Source Serif/JetBrains Mono

**Solution**:
- Verify @fontsource packages installed: `npm list @fontsource`
- Check imports in global.css are before `@import "tailwindcss"`
- Clear build cache: `rm -rf node_modules/.vite && npm run dev`

### Issue 2: Dark Mode Not Applying

**Symptoms**: Theme toggles but colors don't change

**Solution**:
- Check `.dark` class added to `<html>` element (inspect in DevTools)
- Verify dark mode tokens defined in global.css
- Ensure components use `var(--color-*)` not hardcoded colors

### Issue 3: Theme Doesn't Persist

**Symptoms**: Theme resets to light on app restart

**Solution**:
- Check Electron Store path: `~/Library/Application Support/InkForge/config.json`
- Verify IPC handlers registered: `console.log` in `theme:set` handler
- Check preload script loaded: Inspect `window.electron.theme` in console

### Issue 4: OKLCH Colors Not Rendering

**Symptoms**: Colors appear as fallback HSL values

**Solution**:
- OKLCH requires Chromium 111+. Verify Electron version: `npm list electron`
- Check for CSS syntax errors (missing semicolons, invalid oklch() format)
- Fallback to HSL if needed (already defined in cascade)

### Issue 5: Poor Contrast in Dark Mode

**Symptoms**: Text hard to read in dark mode

**Solution**:
- Use contrast checker: https://webaim.org/resources/contrastchecker/
- Increase lightness (L) value in OKLCH: `oklch(0.90 0.01 240)` instead of `oklch(0.70 ...)`
- Test with DevTools accessibility panel

---

## Performance Optimization

### Font Loading

**Problem**: Fonts block initial render

**Solution**:
```html
<!-- In index.html, preload critical font -->
<link rel="preload" href="/node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
```

### Theme Switching

**Problem**: Theme toggle feels sluggish

**Solution**:
- Ensure only colors have transitions (not layout properties)
- Use `will-change: background-color, color` on frequently-changing elements
- Apply theme class to `<html>` not individual components

### Bundle Size

**Problem**: Font files increase bundle size

**Solution**:
- Use only required font weights (400, 500, 600, 700)
- Exclude unused language subsets (keep Latin only)
- Check bundle with `npm run build && du -sh dist/`

---

## Success Metrics

After implementation, verify all P1 success criteria:

1. ✅ **Zero hardcoded colors**: `rg 'bg-blue-[0-9]' src/` → 0 matches
2. ✅ **Theme switching <300ms**: DevTools Performance → <300ms
3. ✅ **WCAG AA contrast**: All text ≥4.5:1 (body) or ≥3:1 (large)
4. ✅ **Fonts load <2s**: Network tab → all fonts loaded within 2s
5. ✅ **100% focus coverage**: Tab through app → all interactive elements show ring
6. ✅ **System preference respected**: Dark mode OS → app opens in dark mode
7. ✅ **Persistence works**: Toggle → restart → theme maintained

---

## Next Steps

After P1 completion:
- **P2**: Implement typography hierarchy in editor (Source Serif 4 for headings)
- **P3**: Add keyboard navigation improvements beyond focus rings
- **Optional**: Visual regression tests with Playwright screenshots
- **Optional**: Contrast validation in CI pipeline

---

## Quick Reference

### Key Commands

```bash
# Development
npm run dev

# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

### File Locations

```
Design Tokens:      src/renderer/styles/global.css
Theme Context:      src/renderer/contexts/ThemeContext.tsx
Theme Service:      src/main/services/theme-service.ts
IPC Handlers:       src/main/ipc/handlers.ts
UI Components:      src/renderer/components/ui/
Type Definitions:   src/shared/types/ipc-contracts.ts
```

### Documentation

- Full spec: `specs/002-interface-styling/spec.md`
- Research: `specs/002-interface-styling/research.md`
- Data model: `specs/002-interface-styling/data-model.md`
- IPC contracts: `specs/002-interface-styling/contracts/ipc-contracts.md`

---

**Estimated Total Time**: 8-12 hours for full implementation (P1-P3)  
**Minimum Viable**: 4 hours for P1 (foundation + component migration)

Happy coding! 🎨
