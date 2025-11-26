import type { GatsbyNode } from "gatsby";

/**
 * Gatsby Node API Configuration
 *
 * This file is used for build-time customizations:
 * - Creating dynamic pages
 * - Adding custom webpack config
 * - Modifying GraphQL schema
 * - Creating custom nodes
 */

// Create pages programmatically (optional for this simple app)
export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const { createPage } = actions;

  // For a simple Todo app, we only have one page (index)
  // But you could create dynamic pages here if needed
  // Example:
  // createPage({
  //   path: "/todos",
  //   component: require.resolve("./src/templates/todos.tsx"),
  //   context: {},
  // });
};

// Webpack customization (optional)
export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
  stage,
}) => {
  // Add custom webpack config if needed
  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /canvas/,
            use: "null-loader",
          },
        ],
      },
    });
  }
};

// Source nodes (optional - for GraphQL data)
export const sourceNodes: GatsbyNode["sourceNodes"] = ({ actions }) => {
  const { createNode } = actions;

  // You could create custom GraphQL nodes here
  // For example, to load todos from an API at build time
  // This is useful for static data, but our todos are dynamic
};
