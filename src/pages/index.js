import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"

class IndexPage extends React.Component {
  constructor() {
    super()
    this.state = {
      nodes: [],
    }
  }
  componentDidMount() {
    this.setState({
      nodes: this.props.data.allMdx.edges,
    })
  }
  render() {
    const siteTitle = "This is my blog"
    const { nodes } = this.state
    if (!nodes) return
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Home"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <div className="latest-actions">
          <div className="latest-posts">
            <div className="latest-title">Latest Posts</div>
            <div className="latest-posts-container">
              {nodes.map((node, ndx) => {
                const post = node.node
                return (
                  <Link key={ndx} to={`/post` + post.fields.slug}>
                    <div key={ndx} className="post">
                      <div className="post-content">
                        <div className="post-title">
                          {post.frontmatter.title}
                        </div>
                        <div className="post-desc">
                          {post.frontmatter.description}
                        </div>
                        <div className="post-time">{post.frontmatter.date}</div>
                      </div>
                      {post.frontmatter.featuredImage ? (
                        <div className="post-img">
                          <img
                            src={
                              post.frontmatter.featuredImage.childImageSharp
                                .fluid.src
                            }
                          />
                        </div>
                      ) : null}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="latest-project">
            <div className="latest-title">Latest Project</div>
            <div className="latest-project-container"></div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default IndexPage
IndexPage.propTypes = {
  data() {
    return {
      allMdx: {},
    }
  },
}
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    localSearchBlog {
      index
      store
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            category
            featuredImage {
              childImageSharp {
                fluid(maxWidth: 800) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
