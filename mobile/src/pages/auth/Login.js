import React, { useState, useEffect } from 'react'
import { AsyncStorage, View, StyleSheet, Image } from 'react-native'
import { Button, TouchableRipple, TextInput, HelperText } from 'react-native-paper'
import { SwitchActions } from 'react-navigation'
import { AccessToken, LoginManager } from 'react-native-fbsdk'
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin'

import api from '../../services/api'
import stylesMain, { AuthMenu } from './style'
import { Logo } from './utils/Components'
import { ButtonFacebook } from './utils/SocialButtons'

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

const Login = (props) => {
    const [values, setValues] = useState({ email: 'steferson_a@hotmail.com', password: '123456' })
    const [state, setState] = useState({ loading: false, error: '' })

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '743673046912-0qanl6aul79s33d7at83pq4qheajctu2.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        })
    }, [])

    const handleLogin = async () => {
        setState({ ...state, loading: true })
        if (values.email.length + values.password.length === 0) {
            setState({ error: 'Preencha email e senha para continuar!', loading: false })
        } else {
            // try {
            //     const { data: { token } } = await api.post('/sessions', values)
            //     await AsyncStorage.setItem('@RPG:token', token)
            //     setState({ loading: false, error: '' })
            //     props.navigation.dispatch(SwitchActions.jumpTo({ routeName: 'Home' }))
            // } catch ({ response }) {
            //     const e = response ? 'Verifique suas credenciais!' : 'Não houve comunicação com o servidor'
            //     setState({ loading: false, error: e })
            // }
            setTimeout(() => props.navigation.dispatch(SwitchActions.jumpTo({ routeName: 'Home' })), 500)
        }
    }

    const socialLogin = async (provider, accessToken, provider_id) => {
        if (accessToken) {
            setState({ ...state, loading: true })
            try {
                const { data: { token } } = await api.post(`/auth/${provider}`, { accessToken, provider_id })
                await AsyncStorage.setItem('@RPG:token', token)
                setState({ loading: false, error: '' })
                props.navigation.dispatch(SwitchActions.jumpTo({ routeName: 'Home' }))
            } catch {
                setState({ loading: false, error: 'Houve um problema ao realizar login' })
            }
        }
    }

    const handleFacebookLogin = () => {
        LoginManager.logInWithPermissions(["public_profile"]).then(
            function (result) {
                if (result.isCancelled) {
                    return
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        ({ accessToken, userID }) => socialLogin('facebook', accessToken, userID)
                    )
                }
            },
            function () {
                setState({ loading: false, error: 'Houve um problema ao tentar realizar login no Facebook' })
            }
        )
    }
    
    const handleGoogleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            const { accessToken } = await GoogleSignin.getTokens()
            const { user: { id } } = userInfo
            socialLogin('google', accessToken, id)
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                return
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
                return
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                setState({ loading: false, error: 'Ocorreu um problema com o Google Play Services' })
            } else {
                // some other error happened
                // console.log(error)
                // console.log(error.statusCodes)
                setState({ loading: false, error: 'Houve um problema ao tentar realizar login no Google' })
            }
        }
    }

    const handleInputChange = field => text => setValues({ ...values, [field]: text })

    return (
        <View style={stylesMain.appContainer}>
            <Logo style={styles.logo} />
            <ButtonFacebook press={handleFacebookLogin} />
            <GoogleSigninButton
                style={{ width: 200, height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={handleGoogleLogin}
            />
            <TextInput label='Email' mode='outlined'
                placeholder="Digite o seu email" keyboardType="email-address"
                value={values.email} style={stylesMain.input}
                onChangeText={handleInputChange('email')}
            />
            <TextInput label='Senha' mode='outlined'
                placeholder="Digite a sua senha" secureTextEntry={true}
                value={values.password} style={stylesMain.input}
                onChangeText={handleInputChange('password')}
            />
            <HelperText type="error" visible={state.error.length >= 0} >
                {state.error}
            </HelperText>
            <TouchableRipple
                onPress={handleLogin} >
                <Button mode="contained" style={styles.login} loading={state.loading}>
                    LOGIN
                </Button>
            </TouchableRipple>
            <AuthMenu {...props} items={items} />
        </View>
    )
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

export default Login
