import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"
// import SearchPosts from "../components/searchPosts"
import "../styles/thoughts/index.scss"
const siteTitle = "This is my blog"

function Post(props) {
    const [nodes, setNodes] = useState([])

    const loginWithGithub = () => {
        const url = new URL('https://github.com/login/oauth/authorize')
        const params = { client_id: 'a08706cc30fd0e8f0ca7' } // or:
        url.search = new URLSearchParams(params).toString();

        fetch(url, {
            mode: 'cors'
        }).then((res) => {
            console.log(res)
        })
    }
    useEffect(() => {
        let postNodes = []
        props.data.allMdx.edges.map(item => {
            if (item.node.frontmatter.category === "thoughts") postNodes.push(item)
        })
        setNodes(postNodes)
    }, [props.data.allMdx.edges])
    return (
        <Layout location={props.location} title={siteTitle}>
            <SEO title="Creative thoughts" />
            <div className="thoughts-container">
                <div>
                  <a href="https://github.com/login/oauth/authorize?scope=user:email&client_id=a08706cc30fd0e8f0ca7">Click here</a>


                </div>
                <div class="login-with-github">
                    <div class="github-logo" onClick={loginWithGithub}>
                        <svg class="octicon octicon-mark-github v-align-middle" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                    </div>
                    <div class="login-with-github-title">login with github</div>
                </div>
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
