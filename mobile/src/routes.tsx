import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import Icon from 'react-native-vector-icons/MaterialIcons'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import RecoveryPass from './pages/auth/RecoveryPass'
import History from './pages/History'
import Lists from './pages/Lists'
import Settings from './pages/Settings'
import Shop from './pages/Shop'
import { Header } from './pages/Components'

const createTabOption = (screen, title, icon) => {
  return {
    screen,
    navigationOptions: {
      title,
      tabBarIcon: ({ tintColor }) => <Icon name={icon} size={20} color={tintColor} />
    },
  }
}

const Main = createMaterialBottomTabNavigator({
  Album: createTabOption(Lists, 'Listas', 'list'),
  Library: createTabOption(History, 'Pedidos', 'history'),
  History: createTabOption(Shop, 'Produtos', 'shopping-basket'),
  Cart: createTabOption(Settings, 'Configurações', 'settings'),
}, {
  initialRouteName: 'Album',
  activeColor: '#efefef',
})

const titles = ['LISTA DE COMPRAS', 'PEDIDOS', 'COMPRAR', 'CONFIGURAÇÕES']
const Home = createStackNavigator(
  {
    Main: {
      screen: Main,
      navigationOptions: ({ navigation }) => ({ header: <Header title={titles[navigation.state.index]} /> }),
    }
  },
  {

  }
)

const Routes = createAppContainer(
  createSwitchNavigator({
    Login, Home, Signup, RecoveryPass
  })
)



export default Routes