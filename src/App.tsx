import { Grid } from "@chakra-ui/react"
import * as React from "react"
import { Route, BrowserRouter as Router, Switch } from "react-router-dom"

import { HowItWorks } from "./screens/HowItWorks"
import { Vault } from "./screens/Vault"
import { Welcome } from "./screens/Welcome"
import { ThemeProvider } from "./theme/ThemeProvider"

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Grid minH="100vh" px={8} py={16} backgroundColor="gray.50">
          <Switch>
            <Route path="/welcome">
              <Welcome />
            </Route>
            <Route path="/how-it-works">
              <HowItWorks />
            </Route>
            <Route path="/vault">
              <Vault />
            </Route>
          </Switch>
        </Grid>
      </Router>
    </ThemeProvider>
  )
}
