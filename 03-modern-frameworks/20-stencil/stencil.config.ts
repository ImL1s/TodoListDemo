/**
 * Stencil Configuration
 *
 * Stencil is a compiler that generates Web Components.
 * This config controls the build process and output targets.
 *
 * Official Docs: https://stenciljs.com/docs/config
 */

import { Config } from '@stencil/core';

export const config: Config = {
  /**
   * Namespace for the component library
   * Used to prefix generated files and avoid conflicts
   */
  namespace: 'todo-app',

  /**
   * Output Targets
   *
   * Stencil can generate multiple output formats:
   * - dist: Distribution files for npm packages
   * - www: Development server files
   * - dist-custom-elements: Framework-agnostic components
   */
  outputTargets: [
    /**
     * WWW Output - For development and standalone apps
     *
     * Features:
     * - Development server
     * - Service worker support
     * - Pre-rendering support
     * - Copy assets
     */
    {
      type: 'www',
      // Output directory for built files
      dir: 'www',
      // Copy static assets
      copy: [
        { src: 'index.html' }
      ],
      // Service worker for PWA support (optional)
      serviceWorker: null,
      // Base URL for the app
      baseUrl: '/',
    },

    /**
     * Distribution Output - For npm packages
     *
     * Generates:
     * - Lazy loadable components
     * - Type definitions
     * - CSS files
     * - Loader script
     */
    {
      type: 'dist',
      // Output directory
      dir: 'dist',
      // Generate type declarations
      esmLoaderPath: '../loader',
    },

    /**
     * Custom Elements Output - Framework Integration
     *
     * Generates standalone custom elements that can be:
     * - Imported individually
     * - Tree-shakeable
     * - Framework-agnostic
     * - No lazy loading overhead
     */
    {
      type: 'dist-custom-elements',
      dir: 'dist/components',
      // Copy type declarations
      copy: [
        {
          src: '../scripts/custom-elements',
          dest: 'dist/components',
          warn: false,
        }
      ],
      // Include polyfills
      includeGlobalScripts: false,
    },

    /**
     * Documentation Output (Optional)
     *
     * Auto-generate component documentation
     */
    {
      type: 'docs-readme',
      // Generate README.md for each component
      dir: 'docs',
    },
  ],

  /**
   * Global Styles (Optional)
   *
   * CSS that applies to all components
   * Injected into the document head
   */
  // globalStyle: 'src/global/global.css',

  /**
   * Global Scripts (Optional)
   *
   * JavaScript that runs before components load
   * Useful for polyfills or global setup
   */
  // globalScript: 'src/global/global.ts',

  /**
   * Development Server Configuration
   */
  devServer: {
    // Port for dev server
    port: 3333,
    // Open browser on start
    openBrowser: true,
    // Enable hot module replacement
    reloadStrategy: 'pageReload',
  },

  /**
   * Testing Configuration
   */
  testing: {
    // Browser for testing
    browserHeadless: true,
    // Transform options
    transform: {
      '^.+\\.(ts|tsx)$': '@stencil/core/testing/jest-preprocessor',
    },
  },

  /**
   * Build Options
   */
  buildEs5: 'prod', // Build ES5 for production only
  extras: {
    // Enable extra features
    enableImportInjection: true,
  },

  /**
   * Source Map Configuration
   */
  sourceMap: true,

  /**
   * Hashed Filenames (for caching)
   */
  // hashedFileNameLength: 8,

  /**
   * Optimization
   */
  minifyJs: true,
  minifyCss: true,

  /**
   * TypeScript Configuration
   * Uses tsconfig.json in project root
   */
  // Automatically detected

  /**
   * Plugins (Optional)
   *
   * Extend Stencil with rollup plugins
   */
  // plugins: [],

  /**
   * Enable/Disable Features
   */
  enableCache: true, // Enable build caching for faster rebuilds

  /**
   * Watch Options (Development)
   */
  watchIgnoredRegex: /(?:^|[\\\/])(\.(?!\.)[^\\\/]+)$|node_modules/,

  /**
   * Task Queue
   *
   * Controls how Stencil schedules component updates
   * - 'async': Uses requestAnimationFrame (default, best for most apps)
   * - 'immediate': Synchronous updates (for testing)
   */
  taskQueue: 'async',
};
