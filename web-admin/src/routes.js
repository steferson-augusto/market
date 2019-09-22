import React from "react"
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"

import { isAuthenticated } from "./services/auth"

import Login from "./pages/Auth/Login"
import App from "./pages/App/index"
import Mark from './pages/App/Mark'
import Section from './pages/App/Section'
import UM from './pages/App/Um'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
          <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
        )
    }
  />
)

export const routes = [
  {
    path: "/",
    exact: true,
    component: Mark
  },
  {
    path: "/marks",
    exact: true,
    component: Mark
  },
  {
    path: "/sections",
    exact: true,
    component: Section
  },
  {
    path: "/ums",
    exact: true,
    component: UM
  }
]

const Routes = () => (
  <BrowserRouter>
    <>
      <Switch>
        <Route exact path="/login" component={Login} />
        <PrivateRoute path="/" component={App} />
        <Route path="*" component={() => <h1>Page not found</h1>} />
      </Switch>
    </>
  </BrowserRouter>
)

export default Routes