import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { IconButton, Colors } from 'react-native-paper'

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

const navOption = {
  headerMode: 'float',
  defaultNavigationOptions: ({ navigation }) => ({
    title: 'LOGONAME',
    headerTitleStyle: {
      textAlign: "center",
      flex: 1,
      color: '#fff'
    },
    headerStyle: {
      backgroundColor: Colors.deepPurpleA700,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    headerLeft: () => <IconButton icon='chevron-left' color='transparent' size={32} />,
    headerRight: () => <IconButton icon='chevron-right' color='transparent' size={32} />,
  })
}

const ShopStack = createStackNavigator({
  Products: Shop, 
}, navOption)

const Home = createMaterialBottomTabNavigator({
  Lists: createTabOption(Lists, 'Listas', 'list'),
  History: createTabOption(History, 'Pedidos', 'history'),
  Shop: createTabOption(ShopStack, 'Produtos', 'shopping-basket'),
  Settings: createTabOption(Settings, 'Configurações', 'settings'),
}, {
  initialRouteName: 'Lists',
  activeColor: '#efefef',
})

// const titles = ['LISTA DE COMPRAS', 'PEDIDOS', 'COMPRAR', 'CONFIGURAÇÕES']
// const Home = createStackNavigator(
//   {
//     Main: {
//       screen: Main,
//       navigationOptions: ({ navigation }) => ({ header: <Header title={titles[navigation.state.index]} /> }),
//     }
//   },
//   {

//   }
// )

const Routes = createAppContainer(
  createSwitchNavigator({
    Login, Home, Signup, RecoveryPass
  })
)

export default Routes