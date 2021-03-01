// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"
import "./src/styles/global.css"
import "./src/styles/index.scss"
import "animate.css"
import React from "react"
import { SnackbarProvider } from "notistack"

export const wrapRootElement = ({ element }) => {
  return <SnackbarProvider maxSnack={3}>{element}</SnackbarProvider>
}
