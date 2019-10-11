import React, { useState } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Button, TouchableRipple, TextInput, HelperText, Snackbar } from 'react-native-paper'
import { SwitchActions } from 'react-navigation'

import api from '../../services/api'
import { hasError, getError, responseToError, Errors } from '../../services/errors'
import { Logo } from './utils/Components'
import stylesMain, { AuthMenu, ItemButton } from './style'

interface State {
    loading: boolean
    error: Array<Errors> | []
    visible: boolean
}

const items: Array<ItemButton> = [{
    label: 'VOLTAR',
    icon: 'arrow-back',
    destiny: 'Login',
}]

const RecoveryPass = props => {
    const [email, setEmail] = useState<string>('')
    const [state, setState] = useState<State>({ error: [], visible: false, loading: false })
    
    const handleBack = () => props.navigation.dispatch(SwitchActions.jumpTo({ routeName: 'Login' }))

    const handleSignUp = async () => {
        setState({ ...state, loading: true })
        // try {
        //     await api.post('/password/email', { email })
        //     setState({ loading: false, error: [], visible: true })
        // } catch ({ response }) {
        //     setState({ ...state, loading: false, error: responseToError(response) })
        // }
        setTimeout(() => setState({ loading: false, error: [], visible: true }), 600)
    }

    return (
        <View style={stylesMain.appContainer}>
            <Logo style={styles.logo} />
            <TextInput label='Email' mode='outlined'
                placeholder="Digite o seu email" keyboardType="email-address"
                value={email} style={[stylesMain.input, styles.input]} autoCapitalize="none"
                onChangeText={email => setEmail(email)} error={hasError('email', state.error)}
            />
            <HelperText type="error" visible={hasError('email', state.error)} >
                {getError('email', state.error)}
            </HelperText>

            <View style={styles.buttonContainer}>
                <TouchableRipple
                    onPress={handleSignUp} >
                    <Button mode="contained" style={styles.button} loading={state.loading}>
                        ENVIAR
                </Button>
                </TouchableRipple>
            </View>
            <AuthMenu {...props} items={items} />
            <Snackbar
                visible={state.visible}
                onDismiss={() => setState({ ...state, visible: false })}
                action={{
                    label: 'Login',
                    onPress: handleBack
                }}
            >
                Acesse o seu email para redefinir a senha!
            </Snackbar>
        </View>
    )
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

export default RecoveryPass