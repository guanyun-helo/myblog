import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"
import Image from "../../content/assets/zendaya.jpg"
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html"
import KeyboardBackspaceTwoToneIcon from "@material-ui/icons/KeyboardBackspaceTwoTone"
import '../styles/conponents/singleThought/index.scss'
import LikeCoinButton from "../utils/like.button.sdk"

function singleThought(props) {
    const post = props.thought
    useEffect(() => {
        const likeButton = new LikeCoinButton({
            likerId: "guanyun",
            ref: document.querySelector("#like-button"),
        })
        likeButton.mount()
    })
    if (window) {
        document.title = post.title + '| guanyun'
    }
    return (
        <div className="single-thought animate__animated animate__fadeInRight animate__faster">
            <div className="return-bar">
                <div className="return" onClick={props.close}>
                    <KeyboardBackspaceTwoToneIcon />
                </div>
                <div
                    className="send"
                >
                    guanyun's microblog
        </div>
            </div>
            <div className="thought-container post">
                <div className="post-content">
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