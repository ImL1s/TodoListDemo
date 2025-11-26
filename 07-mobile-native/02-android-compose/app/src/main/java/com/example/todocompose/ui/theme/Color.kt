package com.example.todocompose.ui.theme

import androidx.compose.ui.graphics.Color

/**
 * Color Palette for Todo Compose App
 *
 * This file defines all colors used throughout the application, following
 * Material Design 3 color system guidelines. The colors are organized into:
 *
 * 1. **Primary Colors**: Main brand colors for key components
 * 2. **Secondary Colors**: Accent colors for less prominent components
 * 3. **Tertiary Colors**: Additional accent for variety
 * 4. **Semantic Colors**: Colors with specific meanings (error, success, etc.)
 * 5. **Neutral Colors**: Backgrounds, surfaces, and text
 * 6. **Gradient Colors**: Custom colors for decorative backgrounds
 *
 * Material Design 3 Color Roles:
 * - Primary: Most prominent components (FABs, app bars, buttons)
 * - Secondary: Less prominent components (chips, toggles)
 * - Tertiary: Contrasting accent for balanced color schemes
 * - Error: Error states and destructive actions
 * - Surface: Backgrounds for components (cards, sheets, dialogs)
 * - Background: App background behind all content
 * - OnPrimary/OnSecondary/etc.: Text and icons on colored backgrounds
 *
 * Color Naming Convention:
 * - Use descriptive names (Purple80, not Color1)
 * - Suffix with lightness level for variants (Purple40, Purple80)
 * - "On" prefix for text/icon colors (OnPrimary, OnSurface)
 *
 * Accessibility:
 * - All color pairs meet WCAG contrast requirements (4.5:1 for text)
 * - Light theme: Dark text on light backgrounds
 * - Dark theme: Light text on dark backgrounds
 *
 * Reference:
 * https://m3.material.io/styles/color/the-color-system/color-roles
 */

// ============================================================================
// Light Theme Colors
// ============================================================================

/**
 * Primary color for light theme
 * Used for: FABs, prominent buttons, active states
 * Contrast ratio with OnPrimary: 4.5:1+
 */
val Purple40 = Color(0xFF6650a4)

/**
 * Secondary color for light theme
 * Used for: Less prominent buttons, chips, switches
 */
val PurpleGrey40 = Color(0xFF625b71)

/**
 * Tertiary color for light theme
 * Used for: Complementary accent color
 */
val Pink40 = Color(0xFF7D5260)

// ============================================================================
// Dark Theme Colors
// ============================================================================

/**
 * Primary color for dark theme
 * Lighter variant for better visibility on dark backgrounds
 */
val Purple80 = Color(0xFFD0BCFF)

/**
 * Secondary color for dark theme
 */
val PurpleGrey80 = Color(0xFFCCC2DC)

/**
 * Tertiary color for dark theme
 */
val Pink80 = Color(0xFFEFB8C8)

// ============================================================================
// Custom Brand Colors
// ============================================================================

/**
 * Primary brand color (Indigo)
 * Modern, professional color for todo app branding
 */
val PrimaryIndigo = Color(0xFF6366F1)

/**
 * Lighter variant of primary color
 * Used for hover states and light backgrounds
 */
val PrimaryIndigoLight = Color(0xFF818CF8)

/**
 * Darker variant of primary color
 * Used for pressed states and emphasis
 */
val PrimaryIndigoDark = Color(0xFF4F46E5)

/**
 * Success color (Green)
 * Used for completed todos and success messages
 */
val SuccessGreen = Color(0xFF10B981)

/**
 * Warning color (Amber)
 * Used for warnings and pending states
 */
val WarningAmber = Color(0xFFF59E0B)

/**
 * Error color (Red)
 * Used for errors and delete actions
 */
val ErrorRed = Color(0xFFEF4444)

// ============================================================================
// Gradient Colors for Decorative Backgrounds
// ============================================================================

/**
 * Gradient start color (Purple)
 * Top color for linear gradient backgrounds
 */
val GradientPurple = Color(0xFF8B5CF6)

/**
 * Gradient middle color (Pink)
 * Middle color for complex gradients
 */
val GradientPink = Color(0xFFEC4899)

/**
 * Gradient end color (Blue)
 * Bottom color for linear gradient backgrounds
 */
val GradientBlue = Color(0xFF3B82F6)

/**
 * Alternative gradient start (Indigo)
 * For header/banner gradients
 */
val GradientIndigo = Color(0xFF6366F1)

/**
 * Alternative gradient end (Purple)
 * For header/banner gradients
 */
val GradientPurpleEnd = Color(0xFFA855F7)

// ============================================================================
// Neutral Colors for Text and Surfaces
// ============================================================================

/**
 * Primary text color for light theme
 * Near-black for optimal readability
 */
val TextPrimary = Color(0xFF1F2937)

/**
 * Secondary text color for light theme
 * Gray for less important text
 */
val TextSecondary = Color(0xFF6B7280)

/**
 * Disabled text color
 * Light gray for disabled states
 */
val TextDisabled = Color(0xFF9CA3AF)

/**
 * Primary text color for dark theme
 * Near-white for optimal readability
 */
val TextPrimaryDark = Color(0xFFF9FAFB)

/**
 * Secondary text color for dark theme
 */
val TextSecondaryDark = Color(0xFFD1D5DB)

// ============================================================================
// Surface and Background Colors
// ============================================================================

/**
 * Main background color for light theme
 * Soft white for reduced eye strain
 */
val BackgroundLight = Color(0xFFFAFAFA)

/**
 * Surface color for light theme (cards, sheets)
 * Pure white for contrast with background
 */
val SurfaceLight = Color(0xFFFFFFFF)

/**
 * Main background color for dark theme
 * Soft black for reduced eye strain
 */
val BackgroundDark = Color(0xFF111827)

/**
 * Surface color for dark theme (cards, sheets)
 * Elevated dark surface
 */
val SurfaceDark = Color(0xFF1F2937)

// ============================================================================
// Additional Semantic Colors
// ============================================================================

/**
 * Color for dividers and borders (light theme)
 */
val DividerLight = Color(0xFFE5E7EB)

/**
 * Color for dividers and borders (dark theme)
 */
val DividerDark = Color(0xFF374151)

/**
 * Color for completed todo items
 * Muted green to indicate completion
 */
val CompletedTodoColor = Color(0xFF9CA3AF)

/**
 * Overlay color for modals and dialogs
 */
val OverlayColor = Color(0x80000000) // 50% black

/**
 * Ripple effect color for interactive elements
 */
val RippleColor = Color(0x1F000000) // 12% black
