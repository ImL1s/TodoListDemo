import { StyleSheet, Platform } from 'react-native';

/**
 * Color palette for the application
 */
export const colors = {
  primary: '#667eea',
  primaryDark: '#5568d3',
  secondary: '#764ba2',
  background: '#f8f9fa',
  cardBackground: '#ffffff',
  text: '#2d3436',
  textSecondary: '#636e72',
  textLight: '#b2bec3',
  border: '#dfe6e9',
  success: '#00b894',
  danger: '#d63031',
  warning: '#fdcb6e',
  shadow: '#000000',
};

/**
 * Typography scale
 */
export const typography = {
  h1: 32,
  h2: 24,
  h3: 20,
  body: 16,
  small: 14,
  tiny: 12,
};

/**
 * Spacing scale
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Border radius scale
 */
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

/**
 * Shadow styles for both iOS and Android
 */
export const shadows = {
  small: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  }),
  large: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    android: {
      elevation: 8,
    },
  }),
};

/**
 * Global styles
 */
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

/**
 * Main app styles
 */
export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: 'bold',
    color: colors.cardBackground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.cardBackground,
    opacity: 0.9,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: colors.cardBackground,
    fontSize: typography.small,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    marginTop: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.h2,
    fontWeight: 'bold',
    color: colors.cardBackground,
  },
  statLabel: {
    fontSize: typography.small,
    color: colors.cardBackground,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
});

/**
 * TodoInput component styles
 */
export const todoInputStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    ...shadows.medium,
  },
  input: {
    flex: 1,
    fontSize: typography.body,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  addButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.5,
  },
  addButtonText: {
    color: colors.cardBackground,
    fontSize: typography.body,
    fontWeight: '600',
  },
});

/**
 * TodoList component styles
 */
export const todoListStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: typography.h3,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

/**
 * TodoItem component styles
 */
export const todoItemStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
  },
  checkboxContainer: {
    marginRight: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkboxText: {
    color: colors.cardBackground,
    fontSize: typography.small,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  text: {
    fontSize: typography.body,
    color: colors.text,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  timestamp: {
    fontSize: typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.cardBackground,
    fontSize: typography.body,
    fontWeight: 'bold',
  },
});
