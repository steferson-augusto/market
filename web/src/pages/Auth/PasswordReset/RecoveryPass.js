import React from "react"
import { withRouter } from "react-router-dom"
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import api from '../../../services/api'
import styles from './../styles.module.css'
import logo from '../../../assets/logop.png'

const RecoveryPass = props => {
    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [email, setEmail] = React.useState('')

    const handleChangeEmail = event => setEmail(event.target.value)

    const handleSend = async () => {
        if (!email) setError('Preencha o email para trocar a senha')
        else {
            setLoading(true)
            try {
                const response = await api.post('/password/email', { email })
                const err = response.data.error ? response.data.error : []
                setLoading(false)
                const success = err.length > 0 ? false : true

                if (success) {
                    setError('')
                    setEmail('')
                    setSuccess(true)
                } else {
                    setError(err[0].message)
                    setSuccess(false)
                }
                // this.setState({ loading: false, error, visible })
            } catch (err) {
                console.log(err.response)
                setError('Falha na requisição')
                setLoading(false)
            }
        }
    }

    return (
        <div className={styles.body}>
            <div>
                <img src={logo} alt="Logo" className={styles.img} />
            </div>

            <span className={styles.text2}>Insira seu email e o pombo correio retornará uma mensagem para você trocar sua senha</span>
            <TextField
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={event => handleChangeEmail(event)}
                margin="normal"
                variant="outlined"
                className={styles.input}
            />
            <span className={styles.error}>{error}</span>
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

export default withRouter(RecoveryPass)