# IPC Contracts: Theme Management

**Feature**: 002-interface-styling  
**Date**: November 7, 2025  
**Protocol**: Electron IPC (ipcMain.handle / ipcRenderer.invoke)

## Overview

This document defines the IPC contract between the main and renderer processes for theme preference management. All communication uses Electron's typed IPC channels with validation in main process handlers.

---

## Contracts

### theme:get

**Purpose**: Retrieve the user's current theme preference from persistent storage.

**Direction**: Renderer → Main

**Request**:
```typescript
// Channel name
'theme:get'

// Arguments
// None
```

**Response**:
```typescript
// Success
type ThemeGetResponse = 'light' | 'dark';

// Example
'light' // or 'dark'
```

**Error Handling**:
```typescript
// If Electron Store is corrupted or inaccessible
throw new Error('Failed to read theme preference: [error details]');
```

**Main Process Handler**:
```typescript
// src/main/ipc/handlers.ts
import { ipcMain } from 'electron';
import { themeService } from '../services/theme-service';

ipcMain.handle('theme:get', async () => {
  try {
    return themeService.getTheme();
  } catch (error) {
    console.error('theme:get error:', error);
    throw new Error(`Failed to get theme: ${error.message}`);
  }
});
```

**Renderer Process Usage**:
```typescript
// src/renderer/contexts/ThemeContext.tsx
const loadTheme = async () => {
  try {
    const theme = await window.electron.theme.get();
    setThemeState(theme);
  } catch (error) {
    console.error('Failed to load theme:', error);
    // Fallback to system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setThemeState(systemTheme);
  }
};
```

**Performance**:
- **Expected Duration**: <5ms (local file read)
- **Caching**: Not needed (called once on app startup)
- **Concurrency**: Safe (single-user app, no concurrent reads)

**Testing**:
```typescript
// tests/integration/theme-ipc.test.ts
describe('theme:get', () => {
  it('returns default light theme', async () => {
    const theme = await ipcRenderer.invoke('theme:get');
    expect(theme).toBe('light');
  });

  it('returns persisted theme', async () => {
    await ipcRenderer.invoke('theme:set', 'dark');
    const theme = await ipcRenderer.invoke('theme:get');
    expect(theme).toBe('dark');
  });
});
```

---

### theme:set

**Purpose**: Persist the user's theme preference to storage.

**Direction**: Renderer → Main

**Request**:
```typescript
// Channel name
'theme:set'

// Arguments
type ThemeSetArgs = 'light' | 'dark';

// Example
await ipcRenderer.invoke('theme:set', 'dark');
```

**Response**:
```typescript
// Success (no return value)
void

// Handler returns nothing on success
```

**Error Handling**:
```typescript
// If theme value is invalid
throw new Error('Invalid theme: <value>. Must be "light" or "dark".');

// If Electron Store write fails
throw new Error('Failed to save theme preference: [error details]');
```

**Validation**:
```typescript
function validateTheme(theme: unknown): theme is 'light' | 'dark' {
  return theme === 'light' || theme === 'dark';
}
```

**Main Process Handler**:
```typescript
// src/main/ipc/handlers.ts
ipcMain.handle('theme:set', async (_event, theme: unknown) => {
  // Validate input
  if (!validateTheme(theme)) {
    throw new Error(`Invalid theme: ${theme}. Must be "light" or "dark".`);
  }

  try {
    themeService.setTheme(theme);
  } catch (error) {
    console.error('theme:set error:', error);
    throw new Error(`Failed to set theme: ${error.message}`);
  }
});
```

**Renderer Process Usage**:
```typescript
// src/renderer/contexts/ThemeContext.tsx
const toggleTheme = async () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  
  // Update UI immediately (optimistic update)
  setThemeState(newTheme);
  
  try {
    // Persist in background
    await window.electron.theme.set(newTheme);
  } catch (error) {
    console.error('Failed to persist theme:', error);
    // Don't revert UI - user sees their preference even if save failed
    // Will be corrected on next app launch
  }
};
```

**Performance**:
- **Expected Duration**: 5-20ms (atomic file write)
- **Optimization**: Called asynchronously after UI update (non-blocking)
- **Frequency**: Low (user toggles theme occasionally, not frequently)

**Testing**:
```typescript
// tests/integration/theme-ipc.test.ts
describe('theme:set', () => {
  it('persists theme preference', async () => {
    await ipcRenderer.invoke('theme:set', 'dark');
    const theme = await ipcRenderer.invoke('theme:get');
    expect(theme).toBe('dark');
  });

  it('rejects invalid theme values', async () => {
    await expect(
      ipcRenderer.invoke('theme:set', 'invalid')
    ).rejects.toThrow('Invalid theme');
  });

  it('handles rapid toggles gracefully', async () => {
    await ipcRenderer.invoke('theme:set', 'dark');
    await ipcRenderer.invoke('theme:set', 'light');
    await ipcRenderer.invoke('theme:set', 'dark');
    const theme = await ipcRenderer.invoke('theme:get');
    expect(theme).toBe('dark'); // Last write wins
  });
});
```

---

## Type Definitions

### Shared Types

**Location**: `src/shared/types/ipc-contracts.ts`

```typescript
/**
 * Theme preference value
 */
export type Theme = 'light' | 'dark';

/**
 * Theme IPC channel names
 */
export const ThemeChannels = {
  GET: 'theme:get',
  SET: 'theme:set',
} as const;

/**
 * IPC contract for theme:get
 */
export interface ThemeGetContract {
  channel: typeof ThemeChannels.GET;
  args: [];
  response: Theme;
}

/**
 * IPC contract for theme:set
 */
export interface ThemeSetContract {
  channel: typeof ThemeChannels.SET;
  args: [theme: Theme];
  response: void;
}

/**
 * All theme IPC contracts
 */
export type ThemeIPCContracts = ThemeGetContract | ThemeSetContract;
```

### Preload Type Definitions

**Location**: `src/main/preload.ts`

```typescript
import { contextBridge, ipcRenderer } from 'electron';
import type { Theme } from '../shared/types/ipc-contracts';

// Expose theme API to renderer
contextBridge.exposeInMainWorld('electron', {
  theme: {
    get: (): Promise<Theme> => ipcRenderer.invoke('theme:get'),
    set: (theme: Theme): Promise<void> => ipcRenderer.invoke('theme:set', theme),
  },
});
```

### Window Type Augmentation

**Location**: `src/renderer/types/window.d.ts`

```typescript
import type { Theme } from '@/shared/types/ipc-contracts';

declare global {
  interface Window {
    electron: {
      theme: {
        get: () => Promise<Theme>;
        set: (theme: Theme) => Promise<void>;
      };
    };
  }
}

export {};
```

---

## Security Considerations

### Input Validation

**All inputs validated in main process**:
```typescript
// Bad: Trusting renderer input
ipcMain.handle('theme:set', (_event, theme) => {
  store.set('theme', theme); // ❌ No validation
});

// Good: Validating before storage
ipcMain.handle('theme:set', (_event, theme: unknown) => {
  if (!validateTheme(theme)) {
    throw new Error('Invalid theme'); // ✅ Validated
  }
  store.set('theme', theme);
});
```

### Renderer Isolation

**Renderer cannot access file system directly**:
- All storage operations happen in main process
- Renderer uses IPC exclusively
- Context bridge exposes only typed theme API (no raw IPC access)

### Data Sanitization

**Theme value is enum** (safe by design):
- Only two possible values: "light" or "dark"
- No user-supplied strings
- No injection risk (used in CSS class names only: `.dark`)

---

## Migration Path

### Adding New Theme Variants

**Scenario**: Add "high-contrast" theme

**Changes Required**:
1. Update `Theme` type:
   ```typescript
   export type Theme = 'light' | 'dark' | 'high-contrast';
   ```

2. Update CSS:
   ```css
   .high-contrast {
     --color-background: #000;
     --color-foreground: #fff;
     /* ... increased contrast tokens */
   }
   ```

3. Update UI (theme selector component):
   ```tsx
   <select value={theme} onChange={e => setTheme(e.target.value as Theme)}>
     <option value="light">Light</option>
     <option value="dark">Dark</option>
     <option value="high-contrast">High Contrast</option>
   </select>
   ```

**No data migration needed** - existing "light"/"dark" preferences remain valid.

### Deprecating Theme Variants

**Scenario**: Remove "dark" theme (unlikely)

**Migration Strategy**:
1. Add migration in `themeService.getTheme()`:
   ```typescript
   getTheme(): Theme {
     const storedTheme = store.get('theme', 'light');
     if (storedTheme === 'dark') {
       // Migrate to light
       store.set('theme', 'light');
       return 'light';
     }
     return storedTheme;
   }
   ```

2. Remove `.dark` CSS class and dark mode tokens
3. Update type definition to remove 'dark' from union

---

## Error Recovery

### Storage Corruption

**Scenario**: Electron Store JSON file is corrupted

**Recovery**:
```typescript
// src/main/services/theme-service.ts
export const themeService = {
  getTheme: (): Theme => {
    try {
      const theme = store.get('theme');
      if (theme === 'light' || theme === 'dark') {
        return theme;
      }
      // Invalid value - reset to default
      console.warn('Invalid theme preference, resetting to light');
      store.set('theme', 'light');
      return 'light';
    } catch (error) {
      console.error('Failed to read theme preference:', error);
      // Fallback to default without throwing
      return 'light';
    }
  },
};
```

### IPC Communication Failure

**Scenario**: IPC call times out or fails

**Recovery** (renderer side):
```typescript
const loadTheme = async () => {
  try {
    const theme = await window.electron.theme.get();
    setThemeState(theme);
  } catch (error) {
    console.error('Theme IPC failed:', error);
    // Fallback to system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setThemeState(systemTheme);
  }
};
```

---

## Performance Benchmarks

### Expected Latency

| Operation | Expected | Acceptable | Failure Threshold |
|-----------|----------|------------|-------------------|
| `theme:get` | 2-5ms | <10ms | >50ms |
| `theme:set` | 5-20ms | <50ms | >100ms |

### Optimization Strategies

1. **No caching needed**: Called infrequently (once per app launch + occasional toggles)
2. **Async persistence**: Update UI immediately, persist in background
3. **Atomic writes**: Electron Store uses atomic file operations (no partial writes)

### Monitoring

**Log slow operations**:
```typescript
ipcMain.handle('theme:get', async () => {
  const start = performance.now();
  const theme = themeService.getTheme();
  const duration = performance.now() - start;
  
  if (duration > 10) {
    console.warn(`Slow theme:get operation: ${duration}ms`);
  }
  
  return theme;
});
```

---

## Summary

**IPC Contract Overview**:
- **2 channels**: `theme:get`, `theme:set`
- **Simple payloads**: String enum ("light" | "dark")
- **Validation**: All inputs validated in main process
- **Error handling**: Graceful fallbacks to system preference
- **Type safety**: Full TypeScript coverage from IPC to UI

**Security**:
- Renderer isolated from file system
- Context bridge exposes only typed theme API
- Input validation prevents arbitrary values

**Performance**:
- <5ms reads, <20ms writes
- No caching needed (infrequent calls)
- Optimistic UI updates (instant feedback)

Implementation ready for Phase 2 task breakdown.
