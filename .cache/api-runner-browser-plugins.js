module.exports = [{
      plugin: require('../node_modules/gatsby-remark-images/gatsby-browser.js'),
      options: {"plugins":[],"maxWidth":650,"linkImagesToOriginal":true,"showCaptions":false,"markdownCaptions":false,"sizeByPixelDensity":false,"backgroundColor":"white","quality":50,"withWebp":false,"tracedSVG":false,"loading":"lazy","disableBgImageOnAlpha":false,"disableBgImage":false},
    },{
      plugin: require('../node_modules/gatsby-plugin-mdx/gatsby-browser.js'),
      options: {"plugins":[],"extensions":[".md",".mdx"],"gatsbyRemarkPlugins":["gatsby-remark-double-brackets-link","gatsby-remark-double-parenthesis-link",{"resolve":"gatsby-remark-images","options":{"maxWidth":561}},"gatsby-remark-copy-linked-files",{"resolve":"gatsby-remark-autolink-headers","options":{"icon":false}}],"defaultLayouts":{},"lessBabel":false,"remarkPlugins":[],"rehypePlugins":[],"mediaTypes":["text/markdown","text/x-markdown"],"root":"/home/cloufish/Projects/knowledge-base"},
    }]
