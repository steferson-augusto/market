import React from "react"
import { withRouter } from "react-router-dom"
import { useDispatch } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import api from '../../services/api'
import { login } from '../../services/auth'
import { SET_USER } from '../../store/actionTypes'
import styles from './styles.module.css'
import logo from '../../assets/logo.png'

const Login = props => {
    const dispatch = useDispatch()
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
                const { data } = await api.post("/sessions/admin", { email, password })
                console.log(data)
                login(data.token)
                dispatch({ type: SET_USER, payload: data.user })
                setLoading(false)
                props.history.push("/home")
            } catch (err) {
                setLoading(false)
                setError('Houve um problema com o login, verifique suas credenciais. T.T')
            }
        }
    }

    return (
        <div className={styles.body}>
            <div>
                <img src={logo} alt="Logo" className={styles.img} />
            </div>

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
        </div>
    )
}

const css = {
    marginButton: {
        marginTop: 10,
    },
}

export default withRouter(Login)