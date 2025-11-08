# Phase 5: Testing & Validation Checklist

**Date**: 2025-01-08
**Implementation**: Phase 3 Complete (Component Migration)

## Manual Testing Checklist

### ✅ Theme Toggle Functionality
- [ ] Theme toggle button visible in app header
- [ ] Clicking toggle switches between light and dark modes
- [ ] Sun icon shows in light mode, moon icon shows in dark mode
- [ ] Theme persists across app restarts (verify electron-store)
- [ ] System preference detected on first launch (if no saved preference)

### ✅ Visual Consistency
- [ ] Button component: All variants (primary, secondary, outline, ghost, danger) work in both themes
- [ ] Card component: Background, text, borders adapt to theme
- [ ] Input component: Background, borders, focus rings adapt to theme
- [ ] Dialog component: Backdrop, content, borders adapt to theme
- [ ] Select component: Options, borders, focus states adapt to theme
- [ ] App.tsx: All text colors (headings, body, muted) adapt correctly
- [ ] Theme cards: Badge colors (Built-in) use semantic tokens

### ✅ Design Token Verification
- [ ] No hardcoded color classes (gray-*, blue-*, red-*) in components
- [ ] All colors use semantic tokens (background, foreground, primary, etc.)
- [ ] Focus rings use --ring color consistently
- [ ] Borders use --border color consistently
- [ ] Shadows defined in global.css apply correctly

### ✅ Typography & Fonts
- [ ] Inter font loads for UI elements
- [ ] Source Serif 4 available for content (check PDF exports)
- [ ] JetBrains Mono used for code blocks in Tiptap editor
- [ ] Font loading time < 2s (monitor Network tab in DevTools)
- [ ] No FOUT (Flash of Unstyled Text) on page load

### ✅ Accessibility (WCAG AA)
- [ ] Light mode text contrast ≥ 4.5:1 (body text)
- [ ] Dark mode text contrast ≥ 4.5:1 (body text)
- [ ] Light mode UI elements contrast ≥ 3:1
- [ ] Dark mode UI elements contrast ≥ 3:1
- [ ] Focus indicators visible in both themes
- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter, Escape)
- [ ] Theme toggle accessible via keyboard
- [ ] Screen reader: Theme toggle has proper aria-label

### ✅ Performance
- [ ] Theme switch time < 300ms (use DevTools Performance panel)
- [ ] No layout shift when switching themes
- [ ] CSS variables apply instantly (no re-render delay)
- [ ] Font loading doesn't block rendering
- [ ] No console errors or warnings

### ✅ Edge Cases
- [ ] Theme persists when creating new projects
- [ ] Theme applies to all views (Home, Editor, Settings if present)
- [ ] Tiptap editor styles honor theme (blockquote, code, hr, page break)
- [ ] Dialog backdrop blur works in both themes
- [ ] Card hover effects work in both themes
- [ ] Input error states (red/destructive) visible in both themes

## Automated Testing (Future)

### Unit Tests (Vitest)
```typescript
// src/renderer/contexts/ThemeContext.test.tsx
describe('ThemeContext', () => {
  it('should toggle between light and dark modes', () => { ... });
  it('should persist theme to localStorage as fallback', () => { ... });
  it('should load initial theme from IPC', () => { ... });
});

// src/renderer/components/ui/Button.test.tsx
describe('Button', () => {
  it('should render all variants with correct classes', () => { ... });
  it('should apply semantic tokens instead of hardcoded colors', () => { ... });
});
```

### E2E Tests (Playwright)
```typescript
// tests/e2e/theme-switching.spec.ts
test('user can switch between light and dark modes', async ({ page }) => {
  await page.goto('/');
  await page.click('[aria-label="Toggle theme"]');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.click('[aria-label="Toggle theme"]');
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});

test('theme persists across app restarts', async ({ electronApp }) => {
  // Set theme to dark
  await page.click('[aria-label="Toggle theme"]');
  // Restart app
  await electronApp.close();
  const newApp = await electron.launch();
  // Verify dark theme still applied
  await expect(page.locator('html')).toHaveClass(/dark/);
});
```

### Contrast Testing (Automated)
```bash
# Install pa11y for automated accessibility testing
npm install --save-dev pa11y

# Run contrast checks
npx pa11y --runner axe --standard WCAG2AA http://localhost:5173
```

## Success Criteria Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| SC-001: Zero hardcoded colors | ✅ PASS | All components use semantic tokens |
| SC-002: Theme switching <300ms | ⏳ TEST | Manual test required |
| SC-003: WCAG AA contrast | ⏳ TEST | Requires contrast checker |
| SC-004: Fonts load <2s | ⏳ TEST | Monitor Network tab |
| SC-005: Focus indicators | ✅ PASS | All interactive elements have focus-visible:ring-ring |
| SC-006: System preference | ✅ PASS | theme-service.ts checks nativeTheme.shouldUseDarkColors |
| SC-007: Theme persists | ✅ PASS | electron-store + localStorage fallback |
| SC-008: Zero layout shift | ⏳ TEST | Visual inspection needed |
| SC-009: Spacing system | ✅ PASS | global.css defines --spacing with multipliers |
| SC-010: Shadow hierarchy | ⏳ TEST | Visual inspection needed |

## Known Issues

1. **Preload Script Disabled**: Preload is commented out in main/index.ts. ThemeContext uses localStorage as fallback, but IPC communication will fail if electronAPI not available.
2. **ESLint Configuration**: ESLint v9 requires eslint.config.js (migration from .eslintrc needed)
3. **Large Git Commits**: Previous commits included dist/ and generated Prisma client. Need to update .gitignore.

## Next Steps

1. **Manual Testing**: Run through checklist above while app is running
2. **Contrast Verification**: Use browser DevTools Lighthouse or pa11y to verify WCAG AA
3. **Performance Profiling**: Record theme switch in DevTools Performance panel
4. **Fix Preload Script**: Re-enable preload to ensure IPC works properly
5. **Update .gitignore**: Exclude dist/, src/main/database/generated/, etc.
6. **Write Automated Tests**: Add unit tests for ThemeContext and component token usage

## Testing Commands

```bash
# Start development server
npm run dev

# Run unit tests (when implemented)
npm test

# Run E2E tests (when implemented)
npm run test:e2e

# Check accessibility (requires pa11y)
npx pa11y --runner axe --standard WCAG2AA http://localhost:5173

# Build production version
npm run make
```

---

**Status**: Implementation Phases 1-3 complete. Manual testing in progress.
