import React, { Component } from 'react'
import { AsyncStorage, View, StyleSheet, Image } from 'react-native'
import { Button, TouchableRipple, TextInput, HelperText } from 'react-native-paper'
import { SwitchActions } from 'react-navigation'
import { AccessToken, LoginManager } from 'react-native-fbsdk'
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin'

import api from '../../services/api'
import stylesMain, { AuthMenu } from './style'
import { ButtonFacebook } from './Utils/SocialButtons'

const items = [
    {
        label: 'REGISTRAR-SE',
        icon: 'add',
        destiny: 'Signup',
    }, {
        label: 'RECUPERAR SENHA',
        icon: 'lock-open',
        destiny: 'RecoveryPass'
    },
]

export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            lembrarMe: false,
            email: 'steferson_a@hotmail.com',
            password: '123456',
            error: '',
            loading: false,
        }
    }

    componentDidMount() {
        GoogleSignin.configure({
            webClientId: '743673046912-0qanl6aul79s33d7at83pq4qheajctu2.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        })
    }

    onLogin = async () => {
        this.setState({ loading: true })
        const { email, password } = this.state
        if (email.length === 0 || password.length === 0) {
            this.setState({ error: 'Preencha usuário e senha para continuar!' })
        } else {
            try {
                const response = await api.post('/sessions', { email, password })

                //console.log(response.data)
                await AsyncStorage.setItem('@RPG:token', response.data.token)
                this.setState({ loading: false, error: '' })
                this.props.navigation.dispatch(SwitchActions.jumpTo({ routeName: 'Home' }))
            } catch (err) {
                console.log(err.data)
                this.setState({
                    loading: false,
                    error: 'Verifique suas credenciais!'
                })
            }
        }
    }

    socialLogin = async (provider, accessToken, provider_id) => {
        if (accessToken) {
            this.setState({ loading: true })
            try {
                const { data: { token } } = await api.post(`/auth/${provider}`, { accessToken, provider_id })
                await AsyncStorage.setItem('@RPG:token', token)
                this.setState({ loading: false, error: '' })
                this.props.navigation.dispatch(SwitchActions.jumpTo({ routeName: 'Home' }))
            } catch (err) {
                this.setState({
                    loading: false,
                    error: 'Houve um problema com o login, verifique suas credenciais. T.T'
                })
            }
        }
    }

    handleFacebookLogin = () => {
        _ = this
        LoginManager.logInWithPermissions(["public_profile"]).then(
            function (result) {
                if (result.isCancelled) {
                    console.log("Login cancelled")
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        ({ accessToken, userID }) => {
                            _.socialLogin('facebook', accessToken, userID)
                        }
                    )
                }
            },
            function (error) {
                console.log("Login fail with error: " + error)
            }
        )
    }

    handleGoogleLogin = async () => {
        _ = this
        try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            const { accessToken } = await GoogleSignin.getTokens()
            const { user: { id } } = userInfo
            _.socialLogin('google', accessToken, id)
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                console.log('user cancelled the login flow')
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
                console.log('operation (f.e. sign in) is in progress already')
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                console.log('play services not available or outdated')
            } else {
                // some other error happened
                console.log('some other error happened')
                console.log(error)
                console.log(error.statusCodes)
            }
        }
    }

    render() {
        const { email, password, loading, error } = this.state
        return (
            <View style={stylesMain.appContainer}>
                <Image style={styles.logo}
                    resizeMode="contain"
                    source={require('../../assets/logo.png')}
                />
                <ButtonFacebook press={this.handleFacebookLogin} />
                <GoogleSigninButton
                    style={{ width: 200, height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={this.handleGoogleLogin}
                />
                <TextInput label='Email' mode='outlined'
                    placeholder="Digite o seu email" keyboardType="email-address"
                    value={email} style={stylesMain.input}
                    onChangeText={email => this.setState({ email })}
                />
                <TextInput label='Senha' mode='outlined'
                    placeholder="Digite a sua senha" secureTextEntry={true}
                    value={password} style={stylesMain.input}
                    onChangeText={password => this.setState({ password })}
                />
                <HelperText type="error" visible={error.length >= 0} >
                    {error}
                </HelperText>
                <TouchableRipple
                    onPress={this.onLogin} >
                    <Button mode="contained" style={styles.login} loading={loading}>
                        LOGIN
                    </Button>
                </TouchableRipple>
                <AuthMenu {...this.props} items={items} />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    logo: {
        height: 150,
        width: 150,
        marginTop: '10%',
        marginBottom: 40,
    },
    login: {
        width: 150,
    },
})
