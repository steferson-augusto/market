import React, { Component } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Button, TouchableRipple, HelperText, Snackbar } from 'react-native-paper'
import { SwitchActions } from 'react-navigation'

import api from '../../services/api'
import removeItemValue from '../../services/storage'
import { hasError, getError } from '../../services/errors'
import stylesMain from './style'

export default class SignUp extends Component {
    constructor(props) {
        super(props)

        this.state = {
            error: [],
            visible: false,
            loading: false,
        }
    }

    _onSignOut = () => {
        removeItemValue('@RPG:token')
        this.props.navigation.dispatch(SwitchActions.jumpTo({ routeName: 'Login' }))
    }

    onSend = async () => {
        this.setState({ loading: true })
        
    }

    render() {
        const { loading, error, visible } = this.state
        return (

            <View style={stylesMain.appContainer}>
                <Image style={styles.logo}
                    resizeMode="contain"
                    source={require('../../assets/logo.png')}
                />
                <HelperText type="error" visible={hasError('general', error)} >
                    {getError('general', error)}
                </HelperText>

                <View style={styles.buttonContainer}>
                    <TouchableRipple
                        onPress={this._onSignOut} >
                        <Button mode="outlined" style={styles.button}>
                            SAIR
                    </Button>
                    </TouchableRipple>
                    <TouchableRipple
                        onPress={this.onSend} >
                        <Button mode="contained" style={styles.button} loading={loading}>
                            ENVIAR
                    </Button>
                    </TouchableRipple>
                </View>
                <Snackbar
                    visible={visible}
                    onDismiss={() => this.setState({ visible: false })}
                    action={{
                        label: 'Login',
                        onPress: this._goBack
                    }}
                >
                    Acesse o seu email para redefinir a senha!
                </Snackbar>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    logo: {
        height: 200,
        width: 200,
        marginTop: '15%',
        marginBottom: 40,
    },
    input: {
        marginBottom: 0,
    },
    buttonContainer: {
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        width: 140,
        marginHorizontal: 5,
    },
})