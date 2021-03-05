import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"
import KeyboardBackspaceTwoToneIcon from "@material-ui/icons/KeyboardBackspaceTwoTone"
import "../styles/conponents/edit/index.scss"
import Image from "../../content/assets/zendaya.jpg"
import { useQuill } from "react-quilljs"
import "quill/dist/quill.bubble.css" // Add css for snow theme
import { Skeleton } from "@material-ui/lab"
import { useSnackbar } from "notistack"

function editArea(props) {
  const theme = "bubble"
  // const theme = 'bubble';

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
  }

  const placeholder = "There must be something else..."

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ]
  const [thoughts, setThoughts] = useState({})
  const { quill, quillRef } = useQuill({ theme, modules, formats, placeholder })
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const onTextChange = e => {
    setThoughts(e.target.value)
  }
  React.useEffect(() => {
    if (quill) {
      quill.on("text-change", value => {
        quill.getContents()
        setThoughts(quill.getContents())
      })
    }
  }, [quill])

  return (
    <div className="edit-area animate__animated animate__fadeInUp animate__faster">
      <div className="return-bar">
        <div className="return" onClick={props.toggleEditArea}>
          <KeyboardBackspaceTwoToneIcon />
        </div>
        <div
          className="send"
          onClick={() => {
            if(props.loading) {
                enqueueSnackbar("publishing", {
                    variant: "info",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                    autoHideDuration: 1000
                })
                return
            }
            props.sendThoughts(thoughts,quill.getText())
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
          <div style={{ width: "100%", height: 300 }}>
            <div ref={quillRef} />
          </div>
          {/* <textarea onChange={onTextChange} id="text-area"></textarea> */}
        </div>
      </div>
    </div>
  )
}
export default editArea
