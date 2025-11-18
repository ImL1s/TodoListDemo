'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },

    // Enable auto-import for npm packages
    autoImport: {
      watchDependencies: ['tracked-built-ins'],
    },

    // CSS minification
    minifyCSS: {
      enabled: true,
      options: {
        processImport: false,
      },
    },

    // JS minification
    minifyJS: {
      enabled: true,
    },

    // Fingerprinting for cache busting
    fingerprint: {
      enabled: true,
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map'],
    },
  });

  return app.toTree();
};
