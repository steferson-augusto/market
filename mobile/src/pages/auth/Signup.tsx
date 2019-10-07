import React, { useState } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Button, TouchableRipple, TextInput, HelperText } from 'react-native-paper'
import { SwitchActions } from 'react-navigation'

import api from '../../services/api'
import { hasError, getError, responseToError, Errors } from '../../services/errors'
import { Logo } from './utils/Components'
import stylesMain, { AuthMenu, ItemButton } from './style'

interface Form {
    email: string
    password: string
    password_confirmation: string
    name: string
}

interface State {
    loading: boolean
    error: Array<Errors> | []
}

const items: Array<ItemButton> = [{
    label: 'VOLTAR',
    icon: 'arrow-back',
    destiny: 'Login',
}]

const SignUp = props => {
    const [state, setState] = useState<State>({ loading: false, error: [] })
    const [values, setValues] = useState<Form>({
        email: '',
        password: '',
        password_confirmation: '',
        name: '',
    })

    const handleSignup = async () => {
        setState({ ...state, loading: true })
        try {
            await api.post('/users', values)
            setState({ loading: false, error: [] })

            setTimeout(() => {
                props.navigation.dispatch(SwitchActions.jumpTo({ routeName: 'Login' }))
            }, 2500)
        } catch ({ response }) {
            setState({ loading: false, error: responseToError(response) })
        }
    }

    const handleChangeInput = field => text => setValues({ ...values, [field]: text }) 

    return (
        <View style={stylesMain.appContainer}>
            <Logo style={styles.logo} />
            <TextInput label='Nome' mode='outlined'
                placeholder="Digite o seu nome" autoCapitalize="words"
                value={values.name} style={[stylesMain.input, styles.input]} error={hasError('name', state.error)}
                onChangeText={handleChangeInput('name')}
            />
            <HelperText type="error" visible={hasError('name', state.error)} >
                {getError('name', state.error)}
            </HelperText>
            <TextInput label='Email' mode='outlined'
                placeholder="Digite o seu email" keyboardType="email-address"
                value={values.email} style={[stylesMain.input, styles.input]} autoCapitalize="none"
                onChangeText={handleChangeInput('email')} error={hasError('email', state.error)}
            />
            <HelperText type="error" visible={hasError('email', state.error)} >
                {getError('email', state.error)}
            </HelperText>
            <TextInput label='Senha' mode='outlined'
                placeholder="Digite a sua senha" secureTextEntry={true}
                value={values.password} style={[stylesMain.input, styles.input]}
                onChangeText={handleChangeInput('password')} error={hasError('password', state.error)}
            />
            <HelperText type="error" visible={hasError('password', state.error)} >
                {getError('password', state.error)}
            </HelperText>
            <TextInput label='Confirme a senha' mode='outlined'
                placeholder="Confirme a sua senha" secureTextEntry={true}
                value={values.password_confirmation} style={stylesMain.input}
                onChangeText={handleChangeInput('password_confirmation')}
            />

            <HelperText type="error" visible={hasError('general', state.error)} >
                {getError('general', state.error)}
            </HelperText>
            <View style={styles.buttonContainer}>
                <TouchableRipple
                    onPress={handleSignup} >
                    <Button mode="contained" style={styles.button} loading={state.loading}>
                        REGISTRAR
                </Button>
                </TouchableRipple>
            </View>
            <AuthMenu {...props} items={items} />
        </View>
    )
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

export default SignUp