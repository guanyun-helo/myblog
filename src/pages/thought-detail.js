import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"
import Image from "../../content/assets/zendaya.jpg"
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html"
import KeyboardBackspaceTwoToneIcon from "@material-ui/icons/KeyboardBackspaceTwoTone"
import "../styles/conponents/singleThought/index.scss"
import LikeCoinButton from "../utils/like.button.sdk"
import axios from "axios"
function singleThought(props) {
  const [post, setPost] = useState({})
  // const [close, setClose] = useState(() => {})

  const getPost = path => {
    return axios.get(
      `https://raw.githubusercontent.com/guanyun-helo/myblog/master/content/thoughts/${path}`,
      {}
    )
  }
  useEffect(() => {
    console.log("location.hash", location.hash)
    const hash = location.hash.replace("#", "").replace(".md", "")
    getPost(hash).then(res => {
      const node = {
        path: res.data.path,
        date: res.data.date,
        title: res.data.title,
        category: res.data.category,
        content: res.data.content.replace("\n", "\\n"),
      }
      try {
        const contvert = new QuillDeltaToHtmlConverter(
          JSON.parse(node.content).ops
        )
        node.content = contvert.convert()
        if (window) {
          document.title = node.title + "| guanyun"
          // location.hash = post?.path
        }
      } catch (error) {}
      setPost(node)
    })
    const likeButton = new LikeCoinButton({
      likerId: "guanyun",
      ref: document.querySelector("#like-button"),
    })
    likeButton.mount()
  }, [props])
  return (
    <div className="single-thought animate__animated animate__fadeInRight animate__faster">
      <div className="return-bar">
        <div className="return">
          <Link to="/thoughts">
            {" "}
            <KeyboardBackspaceTwoToneIcon />
          </Link>
        </div>
        <div className="send">guanyun's microblog</div>
      </div>
      <div className="thought-container post">
        <div className="post-content">
          <div className="post-desc">
            <div
              dangerouslySetInnerHTML={{
                __html: post?.content || "",
              }}
            ></div>
          </div>
          <div className="post-time">
            {new Date(post?.date).toLocaleString()}
          </div>
        </div>
      </div>
      <div className="like-button-container">
        <div
          id="like-button"
          className="likecoin-embed likecoin-button"
          data-liker-id="guanyun"
          data-href="https://guanyun.live"
        ></div>
      </div>
    </div>
  )
}
export default singleThought
