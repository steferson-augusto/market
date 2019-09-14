import React from 'react'
import { StyleSheet, View, TouchableNativeFeedback } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export const ButtonFacebook = ({ press }) => (
            <Icon.Button
                name="facebook"
                backgroundColor="#3b5998"
                style={styles.button}
                onPress={press}
            >
                Login com Facebook
        </Icon.Button>
)

const styles = StyleSheet.create({
    container: {
        marginVertical: 9,
    },
    button: {
        paddingVertical: 10,
        width: 200,
        fontSize: 15,
        fontWeight: 'bold',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
})
