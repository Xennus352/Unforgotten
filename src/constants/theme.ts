/**
 * Semantic theme tokens for consistent styling
 * Designed for easy dark mode extension
 */

// Primary brand colors
const brand = {
  primary: "#FF7EB3", // Vibrant pink (period tracking)
  primarySoft: "#FFC2D1", // Soft pink (subtle UI elements)
  secondary: "#a855f7", // Purple accent
  tertiary: "#f59e0b", // Gentle gold
};

// Semantic tokens for light mode
export const theme = {
  // Backgrounds
  background: "#F9FBFC",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  cardSecondary: "#FFF9FA",

  // Text hierarchy
  text: "#1A1D22",
  textSecondary: "#8A94A6",
  textMuted: "#6B778C",
  textInverse: "#FFFFFF",

  // Status colors
  danger: "#FF6B81",
  dangerSoft: "#FF8DA1",
  success: "#4CAF50",
  warning: brand.tertiary,

  // UI elements
  border: "#E1E5EA",
  borderMuted: "rgba(137,113,114,0.2)",
  shadow: "#000000",

  // Brand access for direct use
  primary: brand.primary,
  primarySoft: brand.primarySoft,
};

// Legacy support - maps to semantic tokens
export const colors = {
  ...brand,
  neutral: theme.textSecondary,
  white: theme.textInverse,
  creamBg: theme.cardSecondary,
};

// Layout constants
export const layout = {
  borderRadius: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  touchTarget: {
    minimum: 44, // iOS HIG minimum
    recommended: 48, // Android recommended
  },
};