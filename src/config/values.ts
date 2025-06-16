export const HYMN_MIN_FONT_SIZE = 10;
export const HYMN_MAX_FONT_SIZE = 72;
export const HYMN_FONT_CHARACTER_WIDTH_RATIO = 0.52; // is an approximate character width ratio

export type Theme = typeof THEME_SYSTEM | typeof THEME_LIGHT | typeof THEME_DARK;
export const THEME_SYSTEM = "system";
export const THEME_LIGHT = "light";
export const THEME_DARK = "dark";
export const THEMES: Theme[] = [THEME_SYSTEM, THEME_LIGHT, THEME_DARK];
