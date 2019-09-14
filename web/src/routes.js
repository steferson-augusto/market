import React, { Fragment } from "react"
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"

import api from './services/api'
import { isAuthenticated } from "./services/auth"

import Login from "./pages/Auth/Login/index"
import Signup from "./pages/Auth/Signup/index"
import App from "./pages/App/index"
import confirmationFailed from './pages/Auth/RegisterConfirmation/Failed'
import confirmationSuccess from './pages/Auth/RegisterConfirmation/Success'
import RecoveryPass from './pages/Auth/PasswordReset/RecoveryPass'
import PasswordReset from './pages/Auth/PasswordReset/PasswordReset'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
)

const Routes = () => (
  <BrowserRouter>
    <Fragment>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/register/confirm/failed" component={confirmationFailed} />
        <Route path="/register/confirm/success" component={confirmationSuccess} />
        <Route exact path="/password/reset" component={RecoveryPass} />
        <Route path="/password/reset/:token" component={PasswordReset} />
        <Route exact path='/auth/google' component={() => { 
            window.location.href = `${api.defaults.baseURL}/auth/google`
            return null
        }}/>
        <PrivateRoute path="/app" component={App} />
        <Route path="*" component={() => <h1>Page not found</h1>} />
      </Switch>
      
    </Fragment>
  </BrowserRouter>
)

export default Routes