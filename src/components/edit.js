import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"
import KeyboardBackspaceTwoToneIcon from "@material-ui/icons/KeyboardBackspaceTwoTone"
import "../styles/conponents/edit/index.scss"
import Image from "../../content/assets/zendaya.jpg"

function editArea(props) {
  const [thoughts, setThoughts] = useState("")
  const onTextChange = e => {
    setThoughts(e.target.value)
  }
  return (
    <div className="edit-area animate__animated animate__fadeInUp animate__faster">
      <div className="return-bar">
        <div className="return" onClick={props.toggleEditArea}>
          <KeyboardBackspaceTwoToneIcon />
        </div>
        <div
          className="send"
          onClick={() => {
            props.sendThoughts(thoughts)
          }}
        >
          SEND
        </div>
      </div>
      <div className="content-bar">
        <div className="icon">
          <img src={Image} />
        </div>
        <div className="input-container">
          <textarea onChange={onTextChange} id="text-area"></textarea>
        </div>
      </div>
    </div>
  )
}
export default editArea
