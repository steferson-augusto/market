import React, { Component } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Button, TouchableRipple, TextInput, HelperText } from 'react-native-paper'
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

export default class SignUp extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            password_confirmation: '',
            name: '',
            error: [],
            loading: false,
        }
    }

    onSignup = async () => {
        this.setState({ loading: true })
        const { email, password, password_confirmation, name } = this.state
        try {
            const response = await api.post('/users', { email, password, password_confirmation, name })
            const error = response.data.error ? response.data.error : []
            this.setState({ loading: false, error })
            if (error.length == 0) {
                setTimeout(() => {
                    this.props.navigation.dispatch(SwitchActions.jumpTo({ routeName: 'Login' }))
                }, 2500)
            }
        } catch (err) {
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
        const { email, password, loading, password_confirmation, name, error } = this.state
        return (
            <View style={stylesMain.appContainer}>
                <Image style={styles.logo}
                    resizeMode="contain"
                    source={require('../../assets/logo.png')}
                />
                <TextInput label='Nome' mode='outlined'
                    placeholder="Digite o seu nome" autoCapitalize="words"
                    value={name} style={[stylesMain.input, styles.input]} error={hasError('name', error)}
                    onChangeText={name => this.setState({ name })}
                />
                <HelperText type="error" visible={hasError('name', error)} >
                    {getError('name', error)}
                </HelperText>
                <TextInput label='Email' mode='outlined'
                    placeholder="Digite o seu email" keyboardType="email-address"
                    value={email} style={[stylesMain.input, styles.input]} autoCapitalize="none"
                    onChangeText={email => this.setState({ email })} error={hasError('email', error)}
                />
                <HelperText type="error" visible={hasError('email', error)} >
                    {getError('email', error)}
                </HelperText>
                <TextInput label='Senha' mode='outlined'
                    placeholder="Digite a sua senha" secureTextEntry={true}
                    value={password} style={[stylesMain.input, styles.input]}
                    onChangeText={password => this.setState({ password })} error={hasError('password', error)}
                />
                <HelperText type="error" visible={hasError('password', error)} >
                    {getError('password', error)}
                </HelperText>
                <TextInput label='Confirme a senha' mode='outlined'
                    placeholder="Confirme a sua senha" secureTextEntry={true}
                    value={password_confirmation} style={stylesMain.input}
                    onChangeText={password_confirmation => this.setState({ password_confirmation })}
                />

                <HelperText type="error" visible={hasError('general', error)} >
                    {getError('general', error)}
                </HelperText>
                <View style={styles.buttonContainer}>
                    <TouchableRipple
                        onPress={this.onSignup} >
                        <Button mode="contained" style={styles.button} loading={loading}>
                            REGISTRAR
                    </Button>
                    </TouchableRipple>
                </View>
                <AuthMenu {...this.props} items={items} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    logo: {
        height: 100,
        width: 100,
        marginTop: '5%',
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