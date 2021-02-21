/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import styled from "styled-components"

import { rhythm } from "../utils/typography"
import "../styles/bio/index.scss"
const soicalPlatforms = [
  {
    title: "Matters",
    url: "https://matters.news/@guanyun",
  },
  {
    title: "LikeCoin",
    url: "https://liker.land/guanyun",
  },
  {
    title: "Github",
    url: "https://github.com/guanyun-helo",
  },
  {
    title: "Gmail",
    url: "mailto:guanyun.helo@gmail.com",
  },
]
function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <Container className="bio-container">
            <div className="soicals">
              {soicalPlatforms.map((soical, sdx) => {
                return (
                  <div className="soical-item" key={sdx}>
                    <a href={soical.url}>{soical.title}</a>
                  </div>
                )
              })}
            </div>
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 50,
                borderRadius: `100%`,
              }}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
            <p>
              加入赞赏公民支持我的创作，
              {` `}
              <a
                href={`https://liker.land/guanyun/civic?from=guanyun&utm_source=button`}
              >
                点击下面的按钮订阅！
              </a>
            </p>
          </Container>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/zendaya.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

const Container = styled.div`
  display: flex;
`

export default Bio
