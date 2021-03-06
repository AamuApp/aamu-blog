const path = require('path')
const remark = require('remark')
const remark_html = require('remark-html')
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

const normalize = require('mdurl/encode.js');
const all = require('mdast-util-to-hast/lib/all.js')

// highlighter
const remark_prism = require('remark-prism')
const merge = require('deepmerge');
const github = require('hast-util-sanitize/lib/github');

// Preserve className attributes when sanitizing the HTML
// This is necessary for syntax highlighting
const schema = merge(github, { attributes: { '*': ['className'] } });
 

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  
  const result = await graphql(`
    {
      aamu {
        BlogPostCollection {
          title
          slug
          status
        }
      }
    }
  `);

  if (result.errors) {
    return reporter.panicOnBuild('🚨 ERROR: Loading "createPages" query');
  }

  const posts = result.data.aamu.BlogPostCollection || [];
  posts.forEach((post, index) => {
    createPage({
      path: `/${post.slug}/`,
      component: path.resolve('./src/templates/blog-post.js'),
      context: {
        slug: post.slug
      },
    })
  });
}

// https://stackoverflow.com/questions/63124432/how-do-i-configure-mini-css-extract-plugin-in-gatsby
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === "develop" || stage === 'build-javascript') {
    const config = getConfig()
    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
    )
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true
    }
    actions.replaceWebpackConfig(config)
  }
}

exports.createResolvers = (
  {
    actions,
    cache,
    createNodeId,
    createResolvers,
    store,
    reporter,
  },
) => {
  const { createNode } = actions;

  createResolvers({

    // Turn Aamu_BlogPost.body into html
    Aamu_BlogPost: {
      body: {
        type: 'String',
        resolve(source, args, context, info) {
          const file = remark()
            .use(remark_html, {
              sanitize: schema,
              handlers: {
                link(h, node) {
                  const props = { href: normalize(node.url), target: '_blank' }

                  if (node.title !== null && node.title !== undefined) {
                    props.title = node.title
                  }

                  return h(node, 'a', props, all(h, node))
                }
              }
            })
            .use(remark_prism)
            .processSync(source.body);

          return String(file);
        }
      }
    },

    // Handle images
    Aamu_GraphQLMediaItem: {
      image: {
        type: `File`,
        resolve(source, args, context, info) {
          return createRemoteFileNode({
            url: source.url,
            store,
            cache,
            createNode,
            createNodeId,
            reporter,
          })
        },
      },
    },
  })
}


