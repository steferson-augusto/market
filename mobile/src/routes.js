import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation'


import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import RecoveryPass from './pages/auth/RecoveryPass'
import Home from './pages/Home'

const Routes = createAppContainer(
  createSwitchNavigator({
    Login, Home, Signup, RecoveryPass
  })
)

export default Routes