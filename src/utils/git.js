import axios from "axios"
import base64 from "base-64"
import utf8 from "utf8"
import { nanoid } from "nanoid"

class Git {
  constructor(token, value) {
    this.token = token
    this.value = value
  }

  createContent() {
    const nid = nanoid()
    const content = `
    ---

    path: ${nid}

    date: ${new Date().toISOString()}

    title: ${nid}

    category: 'thoughts'

    description: ${encodeURI(this.value)}


    ---
    `
    console.log("content", content)
    // axios
    //   .get(
    //     "https://api.github.com/repos/guanyun-helo/myblog",
    //     {},
    //     {
    //       headers: { accept: "application/vnd.github.v3+json" },
    //     }
    //   )
    //   .then(res => {
    //     console.log(res)
    //   })
    axios
      .put(
        `https://api.github.com/repos/guanyun-helo/myblog/contents/content/thoughts/${nanoid()}.mdx`,
        {
          message: `create ${nanoid()}.mdx`,
          content: base64.encode(content),
          path: `${nanoid()}.mdx`,
          //   path: "a.md",
        },
        {
          headers: {
            accept: "application/vnd.github.v3+json",
            Authorization: `token ${this.token}`,
          },
        }
      )
      .then(res => {
        console.log(res)
      })
  }
}
export default Git
