module.exports = {
  pathPrefix: `/knowledge-base`,
  plugins: [
    {
      resolve: `gatsby-theme-garden`,
      options: {
        contentPath: `${__dirname}/content/garden`,
        rootNote: `/HELLO-WORLD`,
      },
    },
  ],
  siteMetadata: {
    title: `Cloufish's Knowledge Base`,
  },
}
