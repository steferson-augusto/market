import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, TouchableRipple } from 'react-native-paper'
import { Colors } from 'react-native-paper'

export const AuthMenu = props => {
    return (
        <View style={styles.bottonContainer}>
            {props.items.map((item, index) => {
                return (
                    <TouchableRipple key={`${index}`}
                        onPress={() => props.navigation.navigate(item.destiny)} >
                        <Button mode="contained" style={styles.buttonBottom} icon={item.icon}>
                            {item.label}
                        </Button>
                    </TouchableRipple>
                )
            })}
        </View>
    )
}

export default styles = StyleSheet.create({
    appContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: Colors.indigo50,
        alignItems: 'center',
    },
    input: {
        width: 300,
        marginBottom: 10,
        backgroundColor: Colors.indigo50,
    },
    bottonContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        marginBottom: 0
    },
    buttonBottom: {
        width: '100%',
        borderTopColor: '#FFF',
        borderTopWidth: 1,
        borderRadius: 0,
    },
})