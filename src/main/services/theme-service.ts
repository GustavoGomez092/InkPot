import Store from 'electron-store';

export type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
}

const store = new Store<ThemeStore>();

export const themeService = {
  /**
   * Get the current theme preference
   * @returns The current theme ('light' or 'dark')
   */
  getTheme: (): Theme => {
    try {
      const theme = store.get('theme', 'light');
      // Validate stored value
      if (theme !== 'light' && theme !== 'dark') {
        console.warn(`Invalid theme preference "${theme}", resetting to light`);
        store.set('theme', 'light');
        return 'light';
      }
      return theme;
    } catch (error) {
      console.error('Failed to read theme preference:', error);
      return 'light'; // Fallback to light
    }
  },

  /**
   * Set the theme preference
   * @param theme The theme to set ('light' or 'dark')
   */
  setTheme: (theme: Theme): void => {
    if (theme !== 'light' && theme !== 'dark') {
      throw new Error(`Invalid theme: ${theme}. Must be "light" or "dark".`);
    }
    try {
      store.set('theme', theme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
      throw error;
    }
  },
};
