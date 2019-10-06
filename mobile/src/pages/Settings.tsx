import React from 'react'
import { View, Text } from 'react-native'
import { Button, TouchableRipple } from 'react-native-paper'

const Settings = ({ navigation }) => {
return (
    <View>
        <Text>Configurações</Text>
            <TouchableRipple
                onPress={() => navigation.navigate('Login')} >
                <Button icon="camera" mode="contained" >
                    Sair
                </Button>
            </TouchableRipple>
    </View>
    )
}

export default Settings