import React from 'react'
import { View, Text } from 'react-native'
import { Button, TouchableRipple } from 'react-native-paper'

const Shop = ({ navigation }) => {
return (
    <View>
        <Text>Comprar</Text>
            <TouchableRipple
                onPress={() => navigation.navigate('Login')} >
                <Button icon="camera" mode="contained" >
                    Sair
                </Button>
            </TouchableRipple>
    </View>
    )
}

export default Shop