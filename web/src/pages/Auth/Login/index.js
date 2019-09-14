import React from "react"
import { withRouter } from "react-router-dom"
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { GoogleLogin } from 'react-google-login'
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons"

import api from '../../../services/api'
import { login } from '../../../services/auth'
import styles from './../styles.module.css'
import logo from '../../../assets/logop.png'

const Login = props => {
    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [values, setValues] = React.useState({
        email: 'steferson_a@hotmail.com',
        password: '123456',
    })

    const handleChange = field => event => setValues({ ...values, [field]: event.target.value })

    const handleLogin = async () => {
        const { email, password } = values
        if (!email || !password) {
            setError('Preencha e-mail e senha para continuar!')
        } else {
            setLoading(true)
            try {
                const response = await api.post("/sessions", { email, password })
                login(response.data.token)
                setLoading(false)
                props.history.push("/app")
            } catch (err) {
                setLoading(false)
                setError('Houve um problema com o login, verifique suas credenciais. T.T')
            }
        }
    }

    const socialLogin = async (provider, accessToken, provider_id) => {
        if (accessToken) {
            setLoading(true)
            try {
                const { data: { token } } = await api.post(`/auth/${provider}`, { accessToken, provider_id })
                login(token)
                setLoading(false)
                props.history.push("/app")
            } catch (err) {
                setLoading(false)
                setError('Houve um problema com o login, verifique suas credenciais. T.T')
            }
        }
    }

    const responseGoogle = ({ accessToken, googleId }) => socialLogin('google', accessToken, googleId)
    const responseFacebook = ({ accessToken, id }) => socialLogin('facebook', accessToken, id)

    return (
        <div className={styles.body}>
            <div>
                <img src={logo} alt="Logo" className={styles.img} />
            </div>

            {/* <GoogleLoginButton  style={css.buttonSocial} onClick={() => handleGoogleLogin} /> */}

            <FacebookLogin
                appId="420398128570280"
                callback={responseFacebook}
                render={renderProps => (
                    <FacebookLoginButton onClick={renderProps.onClick} style={css.buttonSocial} />
                )}
            />

            <GoogleLogin
                clientId="743673046912-1a4k3jej7fg8p5k16lsptg0vrd77t4um.apps.googleusercontent.com"
                render={renderProps => (
                    <GoogleLoginButton style={css.buttonSocial} onClick={renderProps.onClick} disabled={renderProps.disabled} />
                )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
            <TextField
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange('email')}
                margin="normal"
                variant="outlined"
                className={styles.input}
            />
            <TextField
                id="password"
                label="Senha"
                type="password"
                value={values.password}
                onChange={handleChange('password')}
                margin="normal"
                variant="outlined"
                className={styles.input}
            />
            <span className={styles.error}>{error}</span>
            <div className={styles.wrapper}>
                <Button variant="contained" color="primary" onClick={() => handleLogin()}
                    className={styles.button} style={css.marginButton} disabled={loading}
                >
                    LOGIN
                </Button>
                {loading && <CircularProgress size={24} className={styles.buttonProgress} />}
            </div>
            <div className={styles.menuBottom}>
                <Button variant="contained" onClick={() => props.history.push("/signup")}
                    className={styles.button} style={css.marginButton} color="primary"
                >
                    CRIE UMA CONTA
                </Button>
                <Button variant="contained" onClick={() => props.history.push("/password/reset")}
                    className={styles.button} style={css.marginButton}>
                    ESQUECEU SUA SENHA?
                </Button>
            </div>
        </div>
    )
}

const css = {
    marginButton: {
        marginTop: 10,
    },
    buttonSocial: {
        width: '300px'
    }
}

export default withRouter(Login)