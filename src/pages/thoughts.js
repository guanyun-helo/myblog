import React, { useState, useEffect } from "react"
import { useSnackbar } from "notistack"
import { Link, graphql } from "gatsby"

import { QuillDeltaToHtmlConverter } from "quill-delta-to-html"
import { Skeleton } from "@material-ui/lab"

import { sortBy } from "lodash"
import Fade from "@material-ui/core/Fade"
import localforage from "localforage"
import CreateTwoToneIcon from "@material-ui/icons/CreateTwoTone"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"
import EditArea from "../components/edit"
import SingleThought from "../components/singleThought"
// import SearchPosts from "../components/searchPosts"
import "../styles/thoughts/index.scss"
import axios from "axios"
import Git from "../utils/git"
import { format, subDays } from "date-fns"

const soicalPlatforms = [
  {
    title: "Matters",
    url: "https://matters.news/@guanyun",
  },
  {
    title: "LikeCoin",
    url: "https://liker.land/guanyun",
  },
  {
    title: "Gmail",
    url: "mailto:guanyun.helo@gmail.com",
  },
]
const siteTitle = "This is my blog"

const git = new Git()

function Thoughts(props) {
  const [nodes, setNodes] = useState([])
  const [code, setCode] = useState("")
  const [token, setToken] = useState("")
  const [tokenType, setTokenType] = useState("")
  const [showEditArea, setShowEditArea] = useState(false)
  const [loadCounter, setLoadCounter] = useState(3)
  const [loading, setLoading] = useState(false)
  const [showSingleThought, setShowSingleThought] = useState(false)
  const [thought, setThought] = useState({})
  if (!useSnackbar()) return null
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const loginGithub = code => {
    git.loginGithub(code).then(response => {
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

  const sendThoughts = (value, text) => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      git.setPostValue(value)
      git
        .createContent(value, text)
        .then(res => {
          resolve(true)
          edit()
          setLoading(false)
          enqueueSnackbar("published", {
            variant: "info",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            TransitionComponent: Fade,
            autoHideDuration: 1000,
          })

          try {
            const contvert = new QuillDeltaToHtmlConverter(
              JSON.parse(res.content).ops
            )
            res.content = contvert.convert()
            let postNodes = [res].concat(nodes)
            setNodes(postNodes)
          } catch (error) {}
          //   getPosts()
        })
        .catch(err => {
          reject()
          setLoading(false)
        })
    })
  }
  const loadMore = () => {
    setLoadCounter(loadCounter + 1)
    let date = format(subDays(new Date(), loadCounter), "yyyy-MM-dd")
    getPosts()
  }

  const getPosts = date => {
    git
      .getPosts()
      .then(response => {
        if (!response.data || response.data.length === 0) return
        let postNodes = []
        let raws = response.data.map(post => {
          if (nodes.find(item => item.path === post.path)) return
          return post.download_url
        })
        Promise.all(raws.map(u => axios.get(u))).then(responses => {
          responses.forEach(post => {
            const node = {
              path: post.data.path,
              date: post.data.date,
              title: post.data.title,
              category: post.data.category,
              content: post.data.content.replace("\n", "\\n"),
            }

            try {
              const contvert = new QuillDeltaToHtmlConverter(
                JSON.parse(node.content).ops
              )
              node.content = contvert.convert()
            } catch (error) {}
            postNodes.push(node)
            postNodes = sortBy(postNodes, [
              function(o) {
                return new Date(o.date).getTime()
              },
            ])
            setNodes(postNodes.slice(0, postNodes.length).reverse())
          })
        })
      })
      .catch(err => {
        setLoading(false)
        enqueueSnackbar("get post failed!", {
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          TransitionComponent: Fade,
          autoHideDuration: 1000,
        })
      })
  }

  const edit = () => {
    setShowEditArea(!showEditArea)
  }

  const getSingleThought = post => {
    setShowSingleThought(!showSingleThought)
    setThought(post)
  }
  const closeSingleThought = () => {
    setShowSingleThought(!showSingleThought)
    if (window) {
      document.title = "micro blog | guanyun"
      location.hash = ""
    }
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
            // authGithub()
          }
        }
        if (value) {
          setToken(value)
          git.setToken(value)
        }
      })
      getPosts()
    }
  }, [props.data.allMdx.edges])
  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title="Creative thoughts" />
      <div className="thoughts-container">
        <div className="thoughts-list">
          {nodes.map((node, ndx) => {
            const post = node
            // console.log(post)
            return (
              <Link
                key={ndx}
                to={`/thought-detail/#${post.path}`}
                state={{ post: post, close: closeSingleThought }}
              >
                <div
                  onClick={() => {
                    // getSingleThought(post)
                  }}
                >
                  {loading ? (
                    <Skeleton animation="wave"></Skeleton>
                  ) : (
                    <div key={ndx} className="post">
                      <div className="post-content">
                        {/* <div className="post-title">{post.frontmatter.title}</div> */}
                        <div className="post-desc">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: post.content || "",
                            }}
                          ></div>
                        </div>
                        <div className="post-time">
                          {new Date(post.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="login-with-github">
          {soicalPlatforms.map((soical, sdx) => {
            return (
              <div className="soical-item" key={sdx}>
                <a href={soical.url}>{soical.title}</a>
              </div>
            )
          })}
          <div className="github-logo soical-item" onClick={authGithub}>
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
        </div>
        <div className="edit-container">
          <div className="edit-button" onClick={edit}>
            <CreateTwoToneIcon />
          </div>
          {showEditArea ? (
            <EditArea
              loading={loading}
              toggleEditArea={edit}
              sendThoughts={sendThoughts}
            />
          ) : null}
        </div>
        <div className="single-thought-container">
          {showSingleThought ? (
            <SingleThought thought={thought} close={closeSingleThought} />
          ) : null}
        </div>
      </div>
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
