import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"
import Bio from "../components/bio"

class IndexPage extends React.Component {
  constructor() {
    super()
    this.state = {
      nodes: [],
    }
  }
  isNotSupported() {
    const ua = ""
    if (typeof window !== "undefined") {
      ua = navigator.userAgent.split("(")[1].split(")")[0]
    }
    let brand = ""
    const phone = [
      /IPHONE/gi,
      /huawei/gi,
      /mi/gi,
      /vivo/gi,
      /OPPO/gi,
      /samsung/gi,
      /SONY/gi,
      /Nokia/gi,
      /HTC/gi,
      /ZTE/gi,
      /Lenovo/gi,
      /ZUK/gi,
    ]
    if (phone[0].test(ua)) {
      brand = "iPhone"
    } else if (phone[1].test(ua)) {
      brand = "HUAWEI"
    } else if (phone[2].test(ua)) {
      brand = "小米"
    } else if (phone[3].test(ua)) {
      brand = "vivo"
    } else if (phone[4].test(ua)) {
      brand = "OPPO"
    } else if (phone[5].test(ua)) {
      brand = "SAMSUNG"
    } else if (phone[6].test(ua)) {
      brand = "SONY"
    } else if (phone[7].test(ua)) {
      brand = "Nokia"
    } else if (phone[8].test(ua)) {
      brand = "HTC"
    } else if (phone[9].test(ua)) {
      brand = "ZTE"
    } else if (phone[10].test(ua) || phone[11].test(ua)) {
      brand = "Lenovo"
    } else {
      brand = "Android"
    }
    return brand
  }
  componentDidMount() {
    this.setState({
      nodes: this.props.data.allMdx.edges,
    })
  }
  render() {
    const siteTitle = "This is my blog"
    const { nodes } = this.state
    if (this.isNotSupported() === "HUAWEI") {
      alert("Not support your devices!")
      return
    }
    if (!nodes) return
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Home"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        {/* <Bio /> */}
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
