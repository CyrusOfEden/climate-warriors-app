import { theme as chakra } from "@chakra-ui/react"

import colors from "./colors"

const sans = `-apple-system, BlinkMacSystemFont, "Segoe UI",
Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
"Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`

const fonts = {
  ...chakra.fonts,
  heading: `Inter, ${sans}`,
  body: `Inter, ${sans}`,
}

const theme = {
  ...chakra,
  colors,
  fonts,
  breakpoints: ["600px", "840px", "1280px", "1600px", "2160px"],
}

export default theme
