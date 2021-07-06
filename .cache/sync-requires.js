const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---node-modules-gatsby-theme-garden-src-templates-local-file-js": hot(preferDefault(require("/home/cloufish/Projects/knowledge-base/node_modules/gatsby-theme-garden/src/templates/local-file.js")))
}

