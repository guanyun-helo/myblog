import axios from "axios"
import base64 from "hi-base64"
import utf8 from "utf8"
import { nanoid } from "nanoid"
import { format } from "date-fns"

class Git {
  constructor(token, value) {
    this.token = token
    this.value = value
    this.axios = axios.create({
      baseURL: "https://api.github.com",
      timeout: 10000,
      headers: {
        accept: "application/vnd.github.v3+json",
        Authorization: `token ${this.token}`,
      },
    })
  }

  setPostValue(value) {
    this.value = JSON.stringify(value)
  }

  setToken(token) {
    this.token = token
    this.axios = axios.create({
      baseURL: "https://api.github.com",
      timeout: 10000,
      headers: {
        accept: "application/vnd.github.v3+json",
        Authorization: `token ${this.token}`,
      },
    })
  }

  authGithub() {
    return new Promise((resolve, reject) => {
      let windowUrl = ""
      if (window) {
        windowUrl = window.location.href
      }
      axios
        .post("https://guanyun.nl/api/github-auth", {
          client_id: "a08706cc30fd0e8f0ca7",
          scope: "repo",
          redirect_uri: windowUrl,
        })
        .then(response => {
          resolve(response)
        })
        .catch(function(error) {
          console.log(error)
        })
    })
  }
  loginGithub(code) {
    return new Promise((resolve, reject) => {
      let windowUrl = ""
      if (window) {
        windowUrl = window.location.href
      }
      axios
        .post("https://guanyun.nl/api/github-login", {
          client_id: "a08706cc30fd0e8f0ca7",
          scope: "repo",
          redirect_uri: windowUrl,
          code: code,
          client_secret: "",
        })
        .then(response => {
          resolve(response)
        })
        .catch(function(error) {
          console.log(error)
        })
    })
  }

  createContent() {
    return new Promise((resolve, reject) => {
      const nid = nanoid()
      const content = {
        path: `${nid}.md`,
        date: `${new Date().toISOString()}`,
        title: `${this.value.slice(0, 10)}`,
        category: "thoughts",
        content: `${this.value}`,
      }

      this.axios
        .put(
          `/repos/guanyun-helo/myblog/contents/content/thoughts/${format(
            new Date(),
            "yyyy-MM-dd"
          )}/${nanoid()}.json`,
          {
            message: `create ${nanoid()}.json`,
            content: base64.encode(JSON.stringify(content, 4)),
            path: `${nanoid()}.json`,
          }
        )
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  getPost() {
    return axios.get(
      `https://api.github.com/repos/guanyun-helo/myblog/contents/content/thoughts/`,
      {}
    )
  }
}
export default Git
