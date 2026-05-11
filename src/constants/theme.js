export const COLORS = {
  primary: '#6C63FF', // Vibrant Purple
  secondary: '#FF6584', // Soft Pink/Red
  accent: '#3F3D56', // Deep Indigo
  background: '#F8F9FE', // Light Grayish Blue
  surface: '#FFFFFF',
  text: '#2D3436',
  textSecondary: '#636E72',
  border: '#DFE6E9',
  error: '#FF7675',
  success: '#27AE60', // Deeper Green for contrast
  warning: '#F39C12', // Amber/Orange for visibility
  gray: {
    100: '#F1F2F6',
    200: '#E1E2E6',
    300: '#D1D2D6',
    400: '#B1B2B6',
  }
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // Font sizes
  h1: 32,
  h2: 24,
  h3: 18,
  body1: 16,
  body2: 14,
  caption: 12,
};

export const FONTS = {
  bold: 'System', // Will map to custom fonts later if added
  semiBold: 'System',
  medium: 'System',
  regular: 'System',
};

const theme = { COLORS, SIZES, FONTS };

export default theme;
