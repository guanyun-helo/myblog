import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"
// import SearchPosts from "../components/searchPosts"
import "../styles/post/index.scss"
const siteTitle = "This is my blog"

function Post(props) {
  const [nodes, setNodes] = useState([])
  useEffect(() => {
    let postNodes = []
    props.data.allMdx.edges.map(item => {
      if (item.node.frontmatter.category === "post") postNodes.push(item)
    })
    setNodes(postNodes)
  }, [props.data.allMdx.edges])
  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title="All posts" />
      {/* <Bio /> */}
      {/* <SearchPosts
                posts={posts}
                localSearchBlog={localSearchBlog}
                navigate={navigate}
                location={location}
              /> */}
      <div className="posts-container">
        {nodes.map((node, ndx) => {
          const post = node.node
          return (
            <Link key={ndx} to={`/post` + post.fields.slug}>
              <div className="post">
                <div className="post-content">
                  <div className="post-title">{post.frontmatter.title}</div>
                  <div className="post-desc">
                    {post.frontmatter.description}
                  </div>
                  <div className="post-time">{post.frontmatter.date}</div>
                </div>
                {post.frontmatter.featuredImage ? (
                  <div className="post-img">
                    <img
                      src={
                        post.frontmatter.featuredImage.childImageSharp.fluid.src
                      }
                    />
                  </div>
                ) : null}
              </div>
            </Link>
          )
        })}
      </div>
      <Link to="/">{/* <Button marginTop="85px">Go Home</Button> */}</Link>
    </Layout>
  )
}

export default Post

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
