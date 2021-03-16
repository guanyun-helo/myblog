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

  createContent(value, text) {
    return new Promise((resolve, reject) => {
      const nid = nanoid()
      const content = {
        path: `${nid}.json`,
        date: `${new Date().toISOString()}`,
        title: `${text || "guanyun"}`,
        category: "thoughts",
        content: `${this.value}`,
      }

      this.axios
        .put(
          `/repos/guanyun-helo/myblog/contents/content/thoughts/${nid}.json`,

          {
            message: `create ${nid}.json`,
            content: base64.encode(JSON.stringify(content, 4)),
            path: `${nid}.json`,
          }
        )
        .then(res => {
          resolve(content)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  getPosts() {
    return axios.get(
      `https://api.github.com/repos/guanyun-helo/myblog/contents/content/thoughts/`,
      {}
    )
  }
  getPost(path) {
    return axios.get(
      `https://api.github.com/repos/guanyun-helo/myblog/contents/content/thoughts/${path}.json`,
      {}
    )
  }
}
export default Git
