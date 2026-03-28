/**
 * Design Token System
 *
 * Centralized design tokens for consistent theming across the app.
 * Based on competitive analysis of v0 and Rork mobile patterns.
 *
 * USAGE:
 * import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design';
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: colors.background,
 *     padding: spacing.md,
 *     borderRadius: borderRadius.lg,
 *     ...shadows.md,
 *   },
 * });
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Brand Colors
  primary: '#E45A3B',
  primaryDark: '#C84832',
  primaryLight: '#F06B4F',
  primaryTint: '#2A1510',

  secondary: '#1C1C2E',
  secondaryDark: '#14142A',
  secondaryLight: '#2A2A42',
  secondaryTint: '#0D0D1A',

  accent: '#FF8C42',
  accentDark: '#E67A35',
  accentLight: '#FFA060',
  accentTint: '#2A1A0A',

  // Background Colors (dark theme by default)
  background: '#0D0D1A',
  backgroundSecondary: '#14142A',
  backgroundTertiary: '#1C1C2E',

  // Dark Mode Backgrounds (same since dark by default)
  backgroundDark: '#0D0D1A',
  backgroundDarkSecondary: '#14142A',
  backgroundDarkTertiary: '#1C1C2E',

  // Text Colors (light on dark)
  text: '#E8E8F0',
  textSecondary: '#A0A0B8',
  textTertiary: '#6B6B80',
  textDisabled: '#3A3A50',

  // Dark Mode Text (same)
  textDark: '#E8E8F0',
  textDarkSecondary: '#A0A0B8',
  textDarkTertiary: '#6B6B80',

  // Semantic Colors
  success: '#22C55E',
  successDark: '#16A34A',
  successLight: '#4ADE80',
  successTint: '#0A2A15',

  error: '#EF4444',
  errorDark: '#DC2626',
  errorLight: '#F87171',
  errorTint: '#2A0A0A',

  warning: '#F59E0B',
  warningDark: '#D97706',
  warningLight: '#FBBF24',
  warningTint: '#2A1A05',

  info: '#3B82F6',
  infoDark: '#2563EB',
  infoLight: '#60A5FA',
  infoTint: '#0A152A',

  // Border Colors (subtle on dark)
  border: '#2A2A42',
  borderDark: '#3A3A55',
  borderLight: '#1C1C2E',

  // Dark Mode Borders
  borderDarkMode: '#2A2A42',
  borderDarkModeLight: '#3A3A55',

  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.85)',

  // Special Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// ============================================================================
// SPACING
// ============================================================================

/**
 * Spacing scale based on 8pt grid
 * Use for padding, margin, gap
 */
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  xxxxl: 96,
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

/**
 * Typography presets
 * Use with spread operator: { ...typography.h1 }
 */
export const typography = {
  display: {
    fontSize: 40,
    fontWeight: '700' as const,
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  captionBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0,
  },
  smallBold: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0,
  },
  tiny: {
    fontSize: 10,
    fontWeight: '400' as const,
    lineHeight: 12,
    letterSpacing: 0,
  },
};

// ============================================================================
// SHADOWS
// ============================================================================

/**
 * Shadow presets for iOS (shadowColor, shadowOffset, etc.)
 * and Android (elevation)
 * Use with spread operator: { ...shadows.md }
 */
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  xxl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 20,
  },
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

/**
 * Border radius scale
 * Use for consistent rounded corners
 */
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  xxxl: 32,
  full: 9999,
};

// ============================================================================
// TOUCH TARGETS
// ============================================================================

/**
 * Minimum touch target sizes
 * iOS HIG: 44x44 points
 * Android Material: 48x48dp
 */
export const touchTargets = {
  minimum: 44,      // iOS HIG minimum
  comfortable: 48,  // Android Material minimum
  large: 56,        // Large touch targets for primary actions
};

// ============================================================================
// OPACITY
// ============================================================================

/**
 * Opacity values for different states
 */
export const opacity = {
  disabled: 0.4,
  pressed: 0.7,
  hover: 0.8,
  overlay: 0.5,
  overlayLight: 0.3,
  overlayDark: 0.7,
};

// ============================================================================
// Z-INDEX
// ============================================================================

/**
 * Z-index scale for layering
 */
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
};

// ============================================================================
// ICON SIZES
// ============================================================================

/**
 * Standard icon sizes
 */
export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

// ============================================================================
// AVATAR SIZES
// ============================================================================

/**
 * Standard avatar sizes
 */
export const avatarSize = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
  xxl: 120,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get color with opacity
 * @param color - Hex color (e.g., '#2563EB')
 * @param opacity - Opacity value 0-1 (e.g., 0.5)
 */
export const withOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Get dark mode color based on current theme
 * @param lightColor - Color for light mode
 * @param darkColor - Color for dark mode
 * @param isDark - Current theme mode
 */
export const getThemedColor = (
  lightColor: string,
  darkColor: string,
  isDark: boolean
): string => {
  return isDark ? darkColor : lightColor;
};
