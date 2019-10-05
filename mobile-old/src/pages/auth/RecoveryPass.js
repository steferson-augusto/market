import React, { Component } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Button, TouchableRipple, TextInput, HelperText, Snackbar } from 'react-native-paper'
import { SwitchActions } from 'react-navigation'

import api from '../../services/api'
import { hasError, getError } from '../../services/errors'
import stylesMain, { AuthMenu } from './style'

const items = [
    {
        label: 'VOLTAR',
        icon: 'arrow-back',
        destiny: 'Login',
    },
]

export default class RecoveryPass extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            error: [],
            visible: false,
            loading: false,
        }
    }

    _goBack = () => this.props.navigation.dispatch(SwitchActions.jumpTo({ routeName: 'Login' }))

    onSend = async () => {
        this.setState({ loading: true })
        try {
            const response = await api.post('/password/email', { email: this.state.email })
            const error = response.data.error ? response.data.error : []
            const visible = error.length > 0 ? false : true
            this.setState({ loading: false, error, visible })
        } catch (err) {
            console.log(err.response)
            this.setState({
                loading: false,
                error: {
                    field: 'general',
                    message: 'Falha na requisição'
                }
            })
        }

    }

    render() {
        const { email, loading, error, visible } = this.state
        return (
            <View style={stylesMain.appContainer}>
                <Image style={styles.logo}
                    resizeMode="contain"
                    source={require('../../assets/logo.png')}
                />
                <TextInput label='Email' mode='outlined'
                    placeholder="Digite o seu email" keyboardType="email-address"
                    value={email} style={[stylesMain.input, styles.input]} autoCapitalize="none"
                    onChangeText={email => this.setState({ email })} error={hasError('email', error)}
                />
                <HelperText type="error" visible={hasError('email', error)} >
                    {getError('email', error)}
                </HelperText>

                <View style={styles.buttonContainer}>
                    <TouchableRipple
                        onPress={this.onSend} >
                        <Button mode="contained" style={styles.button} loading={loading}>
                            ENVIAR
                    </Button>
                    </TouchableRipple>
                </View>
                <AuthMenu {...this.props} items={items} />
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