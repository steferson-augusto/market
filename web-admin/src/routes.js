import React, { Fragment } from "react"
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"

import { isAuthenticated } from "./services/auth"

import Login from "./pages/Auth/Login"
import App from "./pages/App/index"
import Mark from './pages/App/Mark'
import Section from './pages/App/Section'

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
  }
]

const Routes = () => (
  <BrowserRouter>
    <Fragment>
      <Switch>
        <Route exact path="/login" component={Login} />
        <PrivateRoute path="/" component={App} />
        <Route path="*" component={() => <h1>Page not found</h1>} />
      </Switch>

    </Fragment>
  </BrowserRouter>
)

export default Routes