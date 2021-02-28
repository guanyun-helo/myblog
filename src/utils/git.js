import axios from "axios"
import base64 from "base-64"
import utf8 from "utf8"
import { nanoid } from "nanoid"

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
    this.value = value
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
  loginGithub() {
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
      const content = `---
  
path: ${nid}.mdx
      
date: ${new Date().toISOString()}
      
title: thoughts:${nid}
      
category: 'thoughts'
      
description: ${encodeURI(this.value).slice(0, 10)}...
      
      
---
  
  
   

> ${encodeURI(this.value)}
      `.trimStart()
      this.axios
        .put(
          `/repos/guanyun-helo/myblog/contents/content/thoughts/${nanoid()}.mdx`,
          {
            message: `create ${nanoid()}.mdx`,
            content: base64.encode(content),
            path: `${nanoid()}.mdx`,
            //   path: "a.md",
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
    return this.axios
      .get("/repos/guanyun-helo/myblog/contents/content/thoughts", {})
      .then(res => {
        console.log("myblog", res)
      })
  }
}
export default Git
