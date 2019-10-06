import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialIcons'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import RecoveryPass from './pages/auth/RecoveryPass'
import History from './pages/History'
import Lists from './pages/Lists'
import Settings from './pages/Settings'
import Shop from './pages/Shop'

const createTabOption = (screen, title, icon) => ({
  screen,
  navigationOptions: {
    title,
    tabBarIcon: ({ tintColor }) => <Icon name={icon} size={20} color={tintColor} />
  },
})

const Home = createMaterialBottomTabNavigator({
  Album: createTabOption(Lists, 'Listas', 'list'),
  Library: createTabOption(History, 'Pedidos', 'history'),
  History: createTabOption(Shop, 'Comprar', 'shopping-basket'),
  Cart: createTabOption(Settings, 'Configurações', 'settings'),
}, {
  initialRouteName: 'Album',
  activeColor: '#efefef',
  style: { minHeight: '100%' }
})

const Routes = createAppContainer(
  createSwitchNavigator({
    Login, Home, Signup, RecoveryPass
  })
)

export default Routes