import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Button, TouchableRipple } from 'react-native-paper'

export default class Home extends Component{
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

  render() {
    return (
        <View>
            <Text>Listas de Compras</Text>
                <TouchableRipple
                    onPress={() => this.props.navigation.navigate('Login')} >
                    <Button icon="camera" mode="contained" >
                        Sair
                    </Button>
                </TouchableRipple>
        </View>
      )
  }
}