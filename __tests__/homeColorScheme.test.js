import {
  DEFAULT_HOME_COLOR_SCHEME,
  resolveHomeColorScheme,
  adjustBrightness,
  normalizeHex,
} from '../src/styles/homeTheme';
import { transformHomepageResponse } from '../src/queries/transformHomepageResponse';

describe('Home Color Scheme & Dynamic Theming', () => {
  describe('resolveHomeColorScheme', () => {
    it('returns DEFAULT_HOME_COLOR_SCHEME when rawScheme is null or undefined', () => {
      expect(resolveHomeColorScheme(null)).toEqual(DEFAULT_HOME_COLOR_SCHEME);
      expect(resolveHomeColorScheme(undefined)).toEqual(DEFAULT_HOME_COLOR_SCHEME);
      expect(resolveHomeColorScheme('')).toEqual(DEFAULT_HOME_COLOR_SCHEME);
    });

    it('derives harmonious theme from a single primary hex string', () => {
      const scheme = resolveHomeColorScheme('#1E40AF');
      expect(scheme.primary).toBe('#1E40AF');
      expect(scheme.containerBackground).toBe('#1E40AF');
      expect(scheme.searchIcon).toBe('#1E40AF');
      expect(Array.isArray(scheme.gradient)).toBe(true);
      expect(scheme.gradient.length).toBe(3);
      expect(Array.isArray(scheme.tabBackground)).toBe(true);
      expect(scheme.tabBackground.length).toBe(3);
      expect(scheme.accent).toBe(DEFAULT_HOME_COLOR_SCHEME.accent);
    });

    it('handles JSON string representation of color scheme', () => {
      const jsonStr = JSON.stringify({
        primary: '#059669',
        accent: '#F59E0B',
      });
      const scheme = resolveHomeColorScheme(jsonStr);
      expect(scheme.primary).toBe('#059669');
      expect(scheme.accent).toBe('#F59E0B');
      expect(scheme.gradient[2]).toBe('#059669');
    });

    it('respects complete custom color scheme object', () => {
      const custom = {
        primary: '#4F46E5',
        secondary: '#6366F1',
        gradient: ['#6366F1', '#4F46E5'],
        accent: '#EC4899',
        tabActive: '#312E81',
        tabBackground: ['#EEF2FF', '#FFFFFF'],
        cartBackground: '#1E1B4B',
      };
      const scheme = resolveHomeColorScheme(custom);
      expect(scheme.primary).toBe('#4F46E5');
      expect(scheme.secondary).toBe('#6366F1');
      expect(scheme.gradient).toEqual(['#6366F1', '#4F46E5']);
      expect(scheme.accent).toBe('#EC4899');
      expect(scheme.tabActive).toBe('#312E81');
      expect(scheme.tabBackground).toEqual(['#EEF2FF', '#FFFFFF']);
      expect(scheme.cartBackground).toBe('#1E1B4B');
    });

    it('normalizes hex values without hash prefix or invalid formats', () => {
      expect(normalizeHex('10B981')).toBe('#10B981');
      expect(normalizeHex('invalid', '#889C54')).toBe('#889C54');
    });
  });

  describe('transformHomepageResponse colorScheme integration', () => {
    it('attaches DEFAULT_HOME_COLOR_SCHEME when backend has no theme', () => {
      const apiResponse = {
        status: 'OK',
        data: {
          banners: [],
          featuredCategories: [],
        },
      };
      const transformed = transformHomepageResponse(apiResponse);
      expect(transformed.colorScheme).toEqual(DEFAULT_HOME_COLOR_SCHEME);
    });

    it('resolves colorScheme from data.colorScheme', () => {
      const apiResponse = {
        status: 'OK',
        data: {
          colorScheme: {
            primary: '#7C3AED',
            accent: '#F97316',
          },
          banners: [],
        },
      };
      const transformed = transformHomepageResponse(apiResponse);
      expect(transformed.colorScheme.primary).toBe('#7C3AED');
      expect(transformed.colorScheme.accent).toBe('#F97316');
      expect(transformed.colorScheme.containerBackground).toBe('#7C3AED');
    });

    it('resolves colorScheme from data.theme or data.color_scheme', () => {
      const apiResponseSnake = {
        status: 'OK',
        data: {
          color_scheme: {
            primary: '#0D9488',
          },
          banners: [],
        },
      };
      const transformedSnake = transformHomepageResponse(apiResponseSnake);
      expect(transformedSnake.colorScheme.primary).toBe('#0D9488');

      const apiResponseTheme = {
        status: 'OK',
        data: {
          theme: {
            primary: '#BE123C',
          },
          banners: [],
        },
      };
      const transformedTheme = transformHomepageResponse(apiResponseTheme);
      expect(transformedTheme.colorScheme.primary).toBe('#BE123C');
    });

    it('handles storeStatus !== OK with default colorScheme', () => {
      const apiResponse = {
        status: 'STORE_CLOSED_FOR_DELIVERY',
        message: 'Store is closed',
      };
      const transformed = transformHomepageResponse(apiResponse);
      expect(transformed.storeStatus).toBe('CLOSED');
      expect(transformed.colorScheme).toEqual(DEFAULT_HOME_COLOR_SCHEME);
    });
  });
});
