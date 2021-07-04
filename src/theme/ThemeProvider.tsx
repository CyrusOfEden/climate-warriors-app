import {
  CSSReset,
  ThemeProvider as ChakraThemeProvider,
} from "@chakra-ui/react"
import React from "react"

import theme from "./theme"

export const ThemeProvider: React.FC = ({ children }) => (
  <ChakraThemeProvider theme={theme}>
    <CSSReset />
    {children}
  </ChakraThemeProvider>
)
