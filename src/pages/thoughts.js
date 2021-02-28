import React, { useState, useEffect } from "react"
import { useSnackbar } from "notistack"
import base64 from "base-64"
import marked from "marked"
import { Link, graphql } from "gatsby"
import localforage from "localforage"
import CreateTwoToneIcon from "@material-ui/icons/CreateTwoTone"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"
import EditArea from "../components/edit"
// import SearchPosts from "../components/searchPosts"
import "../styles/thoughts/index.scss"
import axios from "axios"
import Git from "../utils/git"
const siteTitle = "This is my blog"

const git = new Git()

function Thoughts(props) {
  console.log(props)
  const [nodes, setNodes] = useState([])
  const [code, setCode] = useState("")
  const [token, setToken] = useState("")
  const [tokenType, setTokenType] = useState("")
  const [showEditArea, setShowEditArea] = useState(false)
  // const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const loginGithub = code => {
    git.loginGithub().then(response => {
      const urlParams = new URLSearchParams(response.data.data)
      if (urlParams.get("access_token").length > 0) {
        setToken(urlParams.get("access_token"))
        setTokenType(urlParams.get("token_type"))
        localforage.setItem("token", urlParams.get("access_token"))
      }
    })
  }
  const authGithub = () => {
    git.authGithub().then(response => {
      const url = response.data.url
      if (window) {
        window.location = response.data.url
      }
    })
  }

  const sendThoughts = value => {
    git.setPostValue(value)
    git.createContent().then(res => {
      edit()
    })
  }

  const edit = () => {
    setShowEditArea(!showEditArea)
  }
  useEffect(() => {
    if (window) {
      localforage.getItem("token", (err, value) => {
        if (err || !value) {
          const queryString = window.location.search
          if (queryString.length !== 0) {
            const urlParams = new URLSearchParams(queryString)
            if (urlParams.get("code").length > 0) {
              loginGithub(urlParams.get("code"))
              localforage.setItem("code", urlParams.get("code"))
            }
          } else {
            authGithub()
          }
        }
        if (value) {
          setToken(value)
          console.log("value", value)
          git.setToken(value)
          git
            .getPost()
            .then(response => {
              if (!response.data || response.data.length === 0) return
              let nodes = []
              response.data.forEach(post => {
                axios.get(post.download_url).then(postRes => {
                  console.log(postRes.data)
                  // postRes.data = base64.decode(postRes.data)
                  if (marked.lexer(postRes.data)[14]) {
                    const node = {
                      description: marked.lexer(postRes.data)[4].text,
                      date: marked.lexer(postRes.data)[10].text,
                      content: marked.lexer(postRes.data)[14].text,
                      path: marked.lexer(postRes.data)[1].text,
                    }
                    nodes.push(node)
                    setNodes(nodes)
                  }
                })
              })
              console.log("posts", response)
            })
            .catch(err => {
              // enqueueSnackbar("get post failed!")
            })
          let postNodes = []
          props.data.allMdx.edges.map(item => {
            if (item.node.frontmatter.category === "thoughts")
              postNodes.push(item)
          })
          setNodes(postNodes)
        }
      })
    }
  }, [props.data.allMdx.edges])
  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title="Creative thoughts" />
      <div className="thoughts-container">
        <div className="thoughts-list">
          {nodes.map((node, ndx) => {
            console.log(node)
            const post = node
            return (
              <Link key={ndx} to={`/post` + post.path}>
                <div key={ndx} className="post">
                  <div className="post-content">
                    {/* <div className="post-title">{post.frontmatter.title}</div> */}
                    <div className="post-desc">{post.content}</div>
                    <div className="post-time">{post.date}</div>
                  </div>
                  {/* {post.frontmatter.featuredImage ? (
                    <div className="post-img">
                      <img
                        src={
                          post.frontmatter.featuredImage.childImageSharp.fluid
                            .src
                        }
                      />
                    </div>
                  ) : null} */}
                </div>
              </Link>
            )
          })}
        </div>
        <div className="login-with-github">
          <div className="github-logo" onClick={authGithub}>
            <svg
              className="octicon octicon-mark-github v-align-middle"
              height="32"
              viewBox="0 0 16 16"
              version="1.1"
              width="32"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              ></path>
            </svg>
          </div>
          <div className="login-with-github-title">login with github</div>
          {/* <div onClick={commitFile} className="upload">
            Upload
          </div> */}
        </div>
        <div className="edit-container">
          <div className="edit-button" onClick={edit}>
            <CreateTwoToneIcon />
          </div>
          {showEditArea ? (
            <EditArea toggleEditArea={edit} sendThoughts={sendThoughts} />
          ) : null}
        </div>
      </div>
      <Link to="/">{/* <Button marginTop="85px">Go Home</Button> */}</Link>
    </Layout>
  )
}

export default Thoughts

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
