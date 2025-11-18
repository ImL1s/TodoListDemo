import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  // Site metadata
  siteMetadata: {
    title: "Gatsby Todo App",
    description: "A modern Todo List application built with Gatsby, React, and TypeScript",
    author: "@yourusername",
    siteUrl: "https://your-site-url.com",
  },

  // Enable GraphQL type generation
  graphqlTypegen: true,

  // Plugins
  plugins: [
    // TypeScript support
    "gatsby-plugin-typescript",

    // SEO optimization
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Gatsby Todo App",
        short_name: "Todo",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#4f46e5",
        display: "standalone",
        icon: "src/images/icon.png", // Optional: create an icon if needed
      },
    },
  ],

  // Build optimization
  flags: {
    DEV_SSR: false, // Disable SSR in development for faster builds
  },
};

export default config;
