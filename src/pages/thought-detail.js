import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"
import Image from "../../content/assets/zendaya.jpg"
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html"
import KeyboardBackspaceTwoToneIcon from "@material-ui/icons/KeyboardBackspaceTwoTone"
import "../styles/conponents/singleThought/index.scss"
import LikeCoinButton from "../utils/like.button.sdk"

function singleThought(props) {
  console.log("props", props)
  const [post, setPost] = useState({})
  // const [close, setClose] = useState(() => {})
  useEffect(() => {
    if (!props.location?.state) return
    setPost(props.location?.state?.post)
    const likeButton = new LikeCoinButton({
      likerId: "guanyun",
      ref: document.querySelector("#like-button"),
    })
    likeButton.mount()
    if (window) {
      document.title = props.location?.state?.post?.title + "| guanyun"
      // location.hash = post?.path
    }
  }, [props])
  return (
    <div className="single-thought animate__animated animate__fadeInRight animate__faster">
      <div className="return-bar">
        <div className="return">
          <KeyboardBackspaceTwoToneIcon />
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
