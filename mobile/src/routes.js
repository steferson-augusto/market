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

const Home = createMaterialBottomTabNavigator({
  Album: {
    screen: Lists,
    navigationOptions: {
      title: 'Listas',
      tabBarIcon: ({ tintColor }) => <Icon name="list" size={20} color={tintColor} />
    },
  },
  Library: {
    screen: History,
    navigationOptions: {
      title: 'Pedidos',
      tabBarIcon: ({ tintColor }) => <Icon name="history" size={20} color={tintColor} />
    }
  },
  History: {
    screen: Shop,
    navigationOptions: {
      title: 'Comprar',
      tabBarIcon: ({ tintColor }) => <Icon name="shopping-basket" size={20} color={tintColor} />
    },
  },
  Cart: {
    screen: Settings,
    navigationOptions: {
      title: 'Configurações',
      tabBarIcon: ({ tintColor }) => <Icon name="settings" size={20} color={tintColor} />
    },
  },
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