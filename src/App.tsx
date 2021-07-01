import { ChakraProvider, Container, Grid, theme } from "@chakra-ui/react"
import * as React from "react"
import { Route, BrowserRouter as Router, Switch } from "react-router-dom"

import { LandingPage } from "./screens/LandingPage"

export const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Grid minH="100vh" px={3} py={16}>
          <Container maxW="container.md">
            <Switch>
              <Route path="/">
                <LandingPage />
              </Route>
              <Route path="/app"></Route>
            </Switch>
          </Container>
        </Grid>
      </Router>
    </ChakraProvider>
  )
}
