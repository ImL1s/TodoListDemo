package com.example.todocompose.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

/**
 * Dark color scheme for the Todo Compose app
 *
 * This scheme is automatically applied when:
 * - System is in dark mode (Settings > Display > Dark theme)
 * - Battery saver is enabled (on some devices)
 * - Time-based dark mode schedule is active
 *
 * Benefits of dark theme:
 * - Reduces eye strain in low-light environments
 * - Saves battery on OLED/AMOLED screens
 * - Provides visual comfort for extended use
 * - Follows user's system-wide preference
 *
 * Color choices:
 * - Light colors on dark backgrounds (high contrast)
 * - Reduced brightness levels to prevent glare
 * - Desaturated colors for comfortable viewing
 */
private val DarkColorScheme = darkColorScheme(
    // Primary colors - Used for FABs, app bars, prominent buttons
    primary = Purple80,
    onPrimary = Color(0xFF381E72), // Dark purple for text on primary
    primaryContainer = Color(0xFF4F378B), // Container color
    onPrimaryContainer = Color(0xFFEADDFF), // Text on container

    // Secondary colors - Used for less prominent components
    secondary = PurpleGrey80,
    onSecondary = Color(0xFF332D41), // Dark gray for text on secondary
    secondaryContainer = Color(0xFF4A4458), // Container color
    onSecondaryContainer = Color(0xFFE8DEF8), // Text on container

    // Tertiary colors - Complementary accent
    tertiary = Pink80,
    onTertiary = Color(0xFF492532), // Dark pink for text on tertiary
    tertiaryContainer = Color(0xFF633B48), // Container color
    onTertiaryContainer = Color(0xFFFFD8E4), // Text on container

    // Error colors - Used for errors and destructive actions
    error = Color(0xFFF2B8B5), // Light red
    onError = Color(0xFF601410), // Dark red for text on error
    errorContainer = Color(0xFF8C1D18), // Error container
    onErrorContainer = Color(0xFFF9DEDC), // Text on error container

    // Background and Surface colors
    background = BackgroundDark,
    onBackground = TextPrimaryDark,
    surface = SurfaceDark,
    onSurface = TextPrimaryDark,
    surfaceVariant = Color(0xFF49454F), // Variant surface
    onSurfaceVariant = Color(0xFFCAC4D0), // Text on variant surface

    // Outline colors - Used for borders and dividers
    outline = DividerDark,
    outlineVariant = Color(0xFF49454F), // Subtle outline
)

/**
 * Light color scheme for the Todo Compose app
 *
 * This is the default scheme when the system is in light mode.
 *
 * Benefits of light theme:
 * - Better readability in bright environments
 * - Familiar and traditional appearance
 * - Easier to read text and see details
 * - Default preference for most users
 *
 * Color choices:
 * - Dark colors on light backgrounds (high contrast)
 * - Vibrant colors for engaging UI
 * - Clean and modern appearance
 */
private val LightColorScheme = lightColorScheme(
    // Primary colors
    primary = Purple40,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFEADDFF),
    onPrimaryContainer = Color(0xFF21005D),

    // Secondary colors
    secondary = PurpleGrey40,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFE8DEF8),
    onSecondaryContainer = Color(0xFF1D192B),

    // Tertiary colors
    tertiary = Pink40,
    onTertiary = Color.White,
    tertiaryContainer = Color(0xFFFFD8E4),
    onTertiaryContainer = Color(0xFF31111D),

    // Error colors
    error = Color(0xFFB3261E),
    onError = Color.White,
    errorContainer = Color(0xFFF9DEDC),
    onErrorContainer = Color(0xFF410E0B),

    // Background and Surface colors
    background = BackgroundLight,
    onBackground = TextPrimary,
    surface = SurfaceLight,
    onSurface = TextPrimary,
    surfaceVariant = Color(0xFFE7E0EC),
    onSurfaceVariant = Color(0xFF49454F),

    // Outline colors
    outline = DividerLight,
    outlineVariant = Color(0xFFCAC4D0),
)

/**
 * TodoComposeTheme - Main theme composable for the application
 *
 * This theme wrapper applies Material Design 3 theming to all child composables.
 * It handles:
 * 1. Dynamic color scheme (Android 12+)
 * 2. Dark/Light theme switching
 * 3. System bar colors
 * 4. Typography and shapes
 *
 * Features:
 * - **Dynamic Color**: Uses colors from wallpaper (Android 12+)
 * - **Dark Theme**: Automatically follows system setting
 * - **Edge-to-Edge**: Transparent system bars for immersive UI
 * - **Material 3**: Latest Material Design guidelines
 *
 * Dynamic Color (Android 12+):
 * Android 12 introduced Material You, which generates a color scheme
 * from the user's wallpaper. This provides a personalized, cohesive
 * experience across all apps that support dynamic color.
 *
 * @param darkTheme Whether to use dark theme (default: system setting)
 * @param dynamicColor Whether to use dynamic color from wallpaper (default: true on Android 12+)
 * @param content The composable content to be themed
 *
 * Usage:
 * ```kotlin
 * TodoComposeTheme {
 *     // Your app content here
 *     TodoListScreen()
 * }
 * ```
 *
 * Custom theme usage:
 * ```kotlin
 * // Force dark theme
 * TodoComposeTheme(darkTheme = true) { ... }
 *
 * // Disable dynamic color
 * TodoComposeTheme(dynamicColor = false) { ... }
 * ```
 */
@Composable
fun TodoComposeTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true, // Enable dynamic color on Android 12+
    content: @Composable () -> Unit
) {
    // Determine the color scheme to use
    val colorScheme = when {
        // Dynamic color is available on Android 12 and above
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) {
                dynamicDarkColorScheme(context)
            } else {
                dynamicLightColorScheme(context)
            }
        }

        // Use dark theme colors
        darkTheme -> DarkColorScheme

        // Use light theme colors (default)
        else -> LightColorScheme
    }

    // Get the current view for system bar customization
    val view = LocalView.current
    if (!view.isInEditMode) {
        // SideEffect runs after every successful recomposition
        // Perfect for updating non-Compose system UI like status bar
        SideEffect {
            val window = (view.context as Activity).window
            // Set status bar color to transparent for edge-to-edge
            window.statusBarColor = Color.Transparent.toArgb()
            // Set navigation bar color to transparent
            window.navigationBarColor = Color.Transparent.toArgb()

            // Get window insets controller for appearance customization
            val windowInsetsController = WindowCompat.getInsetsController(window, view)

            // Set status bar icons to dark (for light background) or light (for dark background)
            windowInsetsController.isAppearanceLightStatusBars = !darkTheme
            // Set navigation bar icons to dark or light
            windowInsetsController.isAppearanceLightNavigationBars = !darkTheme
        }
    }

    // Apply Material Theme with the selected color scheme
    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography, // Defined typography (could be customized)
        content = content
    )
}

/**
 * Preview themes for Compose previews
 * These are used in @Preview annotations to show different theme variants
 */

/**
 * Light theme preview wrapper
 */
@Composable
fun LightThemePreview(content: @Composable () -> Unit) {
    TodoComposeTheme(
        darkTheme = false,
        dynamicColor = false // Disable dynamic color for consistent previews
    ) {
        content()
    }
}

/**
 * Dark theme preview wrapper
 */
@Composable
fun DarkThemePreview(content: @Composable () -> Unit) {
    TodoComposeTheme(
        darkTheme = true,
        dynamicColor = false // Disable dynamic color for consistent previews
    ) {
        content()
    }
}
