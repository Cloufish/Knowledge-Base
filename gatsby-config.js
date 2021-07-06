module.exports = {
  pathPrefix: `/CTF-Write-Ups`,
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
    title: `Site title`,
  },
}


