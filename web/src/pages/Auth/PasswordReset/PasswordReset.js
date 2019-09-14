import React from "react"
import { withRouter } from "react-router-dom"
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import api from '../../../services/api'
import { hasError, getError } from '../../../services/errors'
import styles from './../styles.module.css'
import logo from '../../../assets/logop.png'

const PasswordReset = props => {
    const [error, setError] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [values, setValues] = React.useState({
        email: '',
        password: '',
        password_confirmation: ''
    })

    const handleChange = field => event => setValues({ ...values, [field]: event.target.value })

    const handleSend = async () => {
        const { email, password, password_confirmation } = values
        if (!email || !password || !password_confirmation) setError([{
            field: 'general',
            message: 'Preencha todos campos para trocar a senha'
        }])
        else {
            const token = props.match.params.token
            setLoading(true)
            try {
                const response = await api.post(`/password/reset/${token}`, { ...values, token })
                const err = response.data.error ? response.data.error : []
                setLoading(false)
                setError(err)
                setSuccess(err.length === 0)
                if (success) {
                    setValues({
                        email: '',
                        password: '',
                        password_confirmation: ''
                    })
                }
            } catch (err) {
                console.log(err)
                setLoading(false)
                setError([{
                    field: 'general',
                    message: 'Falha na requisição'
                }])
            }
        }
    }

    return (
        <div className={styles.body}>
            <div>
                <img src={logo} alt="Logo" className={styles.img} />
            </div>

            <span className={styles.text2}>Redefina sua senha e o guarda deixará você passar</span>
            <TextField
                id="email"
                error={hasError('email', error)}
                label="Email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange('email')}
                margin="normal"
                variant="outlined"
                helperText={getError('email', error)}
                className={styles.input}
            />
            <TextField
                id="password"
                error={hasError('password', error)}
                label="Senha"
                type="password"
                value={values.password}
                onChange={handleChange('password')}
                margin="normal"
                variant="outlined"
                helperText={getError('password', error)}
                className={styles.input}
            />
            <TextField
                id="password_confirmation"
                label="Confirme a senha"
                type="password"
                value={values.password_confirmation}
                onChange={handleChange('password_confirmation')}
                margin="normal"
                variant="outlined"
                className={styles.input}
            />
            <span className={styles.error}>{getError('general', error)}</span>
            <div className={styles.wrapper}>
                <Button variant="contained" color="primary" onClick={() => handleSend()}
                    className={styles.button} disabled={loading}
                    style={success ? css.buttonSuccess : css.marginButton}
                >
                    ENVIAR
                    </Button>
                {loading && <CircularProgress size={24} className={styles.buttonProgress} />}
            </div>
            <div className={styles.menuBottom}>
                <Button variant="contained" onClick={() => props.history.push("/")}
                    className={styles.button} style={css.marginButton}
                >
                    VOLTAR PARA TELA DE LOGIN
                    </Button>
            </div>
        </div>
    )
}

const css = {
    marginButton: {
        marginTop: 10,
    },
    buttonSuccess: {
        backgroundColor: '#4caf50',
    }
}

export default withRouter(PasswordReset)