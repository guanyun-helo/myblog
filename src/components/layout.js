import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import "../styles/layout/index.scss"
import { Drawer, Button } from "@material-ui/core"
import LikeCoinButton from "../utils/like.button.sdk"
import MenuIcon from "@material-ui/icons/Menu"
export function Layout(props) {
  const { children } = props
  const [drawerStatus, setDrawerStatus] = useState(false)
  useEffect(() => {
    const likeButton = new LikeCoinButton({
      likerId: "guanyun",
      ref: document.querySelector("#like-button"),
    })
    likeButton.mount()
  })
  return (
    <Wrapper>
      <div className="wrapper-container animate__animated animate__fadeIn">
        <div className="header">
          <div className="logo">
            {" "}
            <Link to="/">{`Guanyun's blog`}</Link>
          </div>
          <div className="menus">
            <div className="post item">
              {" "}
              <Link to="/post">Post</Link>{" "}
            </div>
            <div className="projects item">
              <Link to="/project">Projects</Link>
            </div>
            <div className="philosophy item">
              <Link to="/philosophy">Philosophy</Link>
            </div>
          </div>
          <div className="mobile-menus">
            <Button
              onClick={() => {
                setDrawerStatus(!drawerStatus)
              }}
            >
              <MenuIcon />
            </Button>
            <Drawer
              anchor={"right"}
              open={drawerStatus}
              className="drawer"
              onClose={() => {
                setDrawerStatus(!drawerStatus)
              }}
            >
              <div className="drawer-container">
                <div className="post item">
                  {" "}
                  <Link to="/post">Post</Link>{" "}
                </div>
                <div className="projects item">
                  <Link to="/project">Projects</Link>
                </div>
                <div className="philosophy item">
                  <Link to="/philosophy">Philosophy</Link>
                </div>
              </div>
            </Drawer>
          </div>
        </div>
        <main>{children}</main>
      </div>
      <div className="like-button-container">
        <div
          id="like-button"
          className="likecoin-embed likecoin-button"
          data-liker-id="guanyun"
          data-href="https://guanyun.live"
        ></div>
      </div>
      <Footer>
        © {new Date().getFullYear()}, Built By{" "}
        <a href="https://www.gatsbyjs.org">Guanyun</a>
      </Footer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  min-height: 100vh;
`

const Footer = styled.footer`
  text-align: center;
  margin: 24px;
`

export default Layout
