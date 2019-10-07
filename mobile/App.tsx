
import React, {Fragment} from 'react'
import { SafeAreaView, StatusBar, StyleSheet, YellowBox } from 'react-native'
import { Colors } from 'react-native-paper'
import Routes from './src/routes'

YellowBox.ignoreWarnings([
  "Remote debugger"
])
const App = () => {
  return (
    <Fragment>
      <StatusBar backgroundColor={Colors.indigo900} barStyle="light-content" />
      <SafeAreaView style={{ minHeight: '100%' }}>
        <Routes />
      </SafeAreaView>
    </Fragment>
  )
}

export default App
