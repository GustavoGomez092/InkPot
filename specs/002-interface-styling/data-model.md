# Data Model: Interface Design System

**Feature**: 002-interface-styling  
**Date**: November 7, 2025  
**Status**: Complete

## Overview

The design system data model is minimal, focusing on theme preference persistence and runtime theme state. No complex entities or relationships required - just a simple enumerated theme state persisted to storage.

---

## Entities

### Theme Preference

**Description**: User's preferred theme mode (light or dark), persisted across application restarts.

**Storage**: Electron Store (JSON file in app data directory)

**Schema**:
```typescript
interface ThemePreference {
  theme: 'light' | 'dark';
}
```

**Fields**:
- `theme` (enum: "light" | "dark")
  - **Required**: Yes
  - **Default**: Detected from system preference on first launch, then "light" if detection fails
  - **Validation**: Must be exactly "light" or "dark" string literal
  - **Persistence**: Saved immediately on user toggle via IPC

**State Transitions**:
```
[No Preference] → (First Launch) → [Detect System] → Store Value
[light] → (User Toggle) → [dark]
[dark] → (User Toggle) → [light]
```

**Access Patterns**:
- **Read**: Once on app startup to initialize UI theme
- **Write**: On user theme toggle (infrequent, UI-driven)
- **Concurrency**: Not applicable (single-user desktop app, no concurrent access)

**Storage Location**: `~/Library/Application Support/InkPot/config.json` (macOS example)

---

### Runtime Theme State

**Description**: In-memory theme state managed by React Context, synchronized with persisted preference.

**Storage**: React Context (ephemeral, recreated on app restart)

**Schema**:
```typescript
interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => Promise<void>;
  isSystemTheme: boolean; // True if using system preference, false if user manually set
}
```

**Fields**:
- `theme` (enum: "light" | "dark")
  - **Source**: Loaded from Electron Store on mount
  - **Updates**: Synchronously updated on toggle for instant UI response
  
- `toggleTheme` (function)
  - **Side Effects**: Updates context state immediately, then persists to Electron Store via IPC
  - **Error Handling**: If IPC fails, log error but don't revert UI (user sees change even if persistence fails)
  
- `isSystemTheme` (boolean)
  - **Purpose**: Indicates if current theme matches system preference or user manually overrode
  - **Usage**: UI can show "following system" indicator in settings

**Lifecycle**:
1. **Initialization**: ThemeProvider mounts → IPC call to load preference → set context state
2. **Runtime**: User clicks toggle → context state updated → IPC call to persist → UI re-renders with new theme
3. **Cleanup**: No cleanup needed (context destroyed on unmount)

---

## Design Tokens (Configuration Data)

**Description**: Static CSS custom properties defining colors, fonts, shadows, spacing, and radii. Not runtime data - compiled into CSS at build time.

**Storage**: `src/renderer/styles/global.css` (source of truth)

**Structure**:
```css
@theme inline {
  /* Core Colors (40+ tokens) */
  --color-primary: oklch(0.80 0.15 95);
  --color-background: oklch(1.00 0 0);
  --color-foreground: oklch(0.09 0.005 247);
  /* ... rest of color tokens */

  /* Typography (3 families) */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: 'Source Serif 4', Georgia, serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  /* Shadows (8 levels) */
  --shadow-2xs: 0 1px rgb(0 0 0 / 0.05);
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  /* ... rest of shadow tokens */

  /* Radii (5 levels) */
  --radius: 0.5rem;
  --radius-sm: calc(var(--radius) - 0.125rem);
  /* ... rest of radius tokens */

  /* Spacing (base unit) */
  --spacing: 0.25rem;
}

/* Dark mode overrides */
.dark {
  --color-primary: oklch(0.85 0.15 95);
  --color-background: oklch(0.15 0.01 240);
  --color-foreground: oklch(0.98 0 0);
  /* ... rest of dark tokens */
}
```

**Access**: Tokens accessed via CSS variables in component classes or inline styles. No runtime JavaScript access needed.

**Validation**: None at runtime. Validated at design time via contrast testing and visual review.

**Immutability**: Tokens are constants. Changing values requires code change + rebuild. No user customization.

---

## Relationships

```
┌─────────────────────────┐
│  Electron Store         │
│  (Persistent Storage)   │
│                         │
│  { theme: "dark" }      │
└───────────┬─────────────┘
            │
            │ IPC: theme:get / theme:set
            │
            ▼
┌─────────────────────────┐
│  ThemeContext           │
│  (React State)          │
│                         │
│  theme: "dark"          │
│  toggleTheme()          │
└───────────┬─────────────┘
            │
            │ Applies .dark class to <html>
            │
            ▼
┌─────────────────────────┐
│  CSS Custom Properties  │
│  (Design Tokens)        │
│                         │
│  --color-background: oklch(...) │
└─────────────────────────┘
```

**Key Relationships**:
1. **Electron Store ↔ ThemeContext**: One-to-one sync via IPC. Store is source of truth on disk, Context is source of truth in UI.
2. **ThemeContext ↔ DOM**: Context applies `.dark` class to `<html>` element. CSS cascade handles all visual updates.
3. **Design Tokens ↔ Components**: Static relationship. Components reference tokens via Tailwind classes or CSS variables.

---

## Validation Rules

### Theme Preference Validation

**Main Process** (IPC handler input validation):
```typescript
function validateTheme(theme: unknown): theme is 'light' | 'dark' {
  return theme === 'light' || theme === 'dark';
}

ipcMain.handle('theme:set', (_event, theme: unknown) => {
  if (!validateTheme(theme)) {
    throw new Error(`Invalid theme: ${theme}. Must be "light" or "dark".`);
  }
  themeService.setTheme(theme);
});
```

**Renderer Process** (pre-IPC validation):
```typescript
const toggleTheme = async () => {
  const newTheme = theme === 'light' ? 'dark' : 'light'; // Guaranteed valid
  setThemeState(newTheme);
  try {
    await window.electron.theme.set(newTheme);
  } catch (error) {
    console.error('Failed to persist theme:', error);
    // Keep UI updated even if persistence fails
  }
};
```

**No validation needed for**:
- CSS custom properties (static values, validated at design time)
- Design token structure (TypeScript types enforce correctness)

---

## Migration & Versioning

### Initial Deployment (v1.0.0)

**Scenario**: User installs InkPot for first time

**Behavior**:
1. Electron Store has no theme preference
2. App detects system preference: `window.matchMedia('(prefers-color-scheme: dark)').matches`
3. If dark mode detected, set theme to "dark"; otherwise "light"
4. Persist detected preference to Electron Store
5. User can manually override at any time

### Future Schema Changes

**Adding New Theme** (e.g., "high-contrast"):
1. Update `ThemePreference` type: `theme: 'light' | 'dark' | 'high-contrast'`
2. Add `.high-contrast` CSS class with token overrides
3. Migration: Existing "light"/"dark" preferences remain valid. No migration needed.

**Removing Theme** (unlikely):
1. Migration: Convert deprecated theme to closest equivalent (e.g., "sepia" → "light")
2. Update validation to reject old values

**Token Changes** (add/remove CSS variables):
- No data migration needed (tokens are code, not data)
- Components update to use new token names
- Old token references caught at compile time (TypeScript + Tailwind purge)

---

## Performance Considerations

### Read Performance
- **Electron Store read**: ~1-5ms (single JSON file, <1KB)
- **Context initialization**: <1ms (simple state object)
- **CSS variable lookup**: <0.1ms (native browser optimization)

**Optimization**: Load theme preference in parallel with other app initialization tasks. No blocking required.

### Write Performance
- **Context state update**: <1ms (React batched update)
- **Electron Store write**: ~5-20ms (atomic file write)
- **CSS repaint**: ~100-200ms (browser reflows with new colors)

**Optimization**: Update context state immediately (instant UI response), persist to store asynchronously. User sees change before IPC completes.

### Memory Footprint
- **Theme state**: ~100 bytes (single string + functions)
- **Design tokens**: 0 bytes at runtime (CSS variables compiled into stylesheet)
- **Total**: Negligible (<1KB)

---

## Security Considerations

### Input Validation
- All IPC inputs validated in main process before writing to Electron Store
- Renderer cannot write arbitrary values to file system
- Theme preference limited to known enumeration (no user-supplied strings)

### Storage Security
- Electron Store uses standard app data directory with OS-level permissions
- No sensitive data stored (theme preference is not security-critical)
- Atomic writes prevent corruption from interrupted saves

### XSS Protection
- Theme values never rendered as HTML (only used in class names: `.dark`)
- No user-supplied CSS allowed (tokens are hardcoded in stylesheet)
- React automatically escapes any dynamic content

---

## Testing Strategy

### Unit Tests
```typescript
// Test theme persistence
describe('ThemeService', () => {
  it('defaults to light theme', () => {
    expect(themeService.getTheme()).toBe('light');
  });

  it('persists theme preference', () => {
    themeService.setTheme('dark');
    expect(themeService.getTheme()).toBe('dark');
  });

  it('rejects invalid themes', () => {
    expect(() => themeService.setTheme('invalid' as any)).toThrow();
  });
});

// Test React context
describe('ThemeContext', () => {
  it('loads theme from IPC on mount', async () => {
    const { result } = renderHook(() => useTheme());
    await waitFor(() => expect(result.current.theme).toBe('light'));
  });

  it('toggles theme and persists', async () => {
    const { result } = renderHook(() => useTheme());
    await act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');
    expect(mockIpc.theme.set).toHaveBeenCalledWith('dark');
  });
});
```

### Integration Tests
```typescript
// Test IPC contract
describe('Theme IPC', () => {
  it('returns current theme', async () => {
    const theme = await ipcRenderer.invoke('theme:get');
    expect(theme).toMatch(/^(light|dark)$/);
  });

  it('updates theme via IPC', async () => {
    await ipcRenderer.invoke('theme:set', 'dark');
    const theme = await ipcRenderer.invoke('theme:get');
    expect(theme).toBe('dark');
  });
});
```

### Visual Tests
- Manually verify theme switching in under 300ms
- Screenshot comparison between light and dark modes
- WCAG contrast validation for all color pairs

---

## Summary

Data model is intentionally minimal:
- **One entity**: Theme preference (enum: light/dark)
- **One storage mechanism**: Electron Store
- **One runtime state**: React Context
- **Zero complex relationships**: No joins, no foreign keys, no cascades

Design tokens are configuration (CSS), not runtime data. No database, no ORM, no migrations beyond simple enum additions.

Implementation complexity: Low. No schema evolution concerns beyond adding new theme variants.
