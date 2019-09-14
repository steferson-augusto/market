import React from "react"
import { withRouter } from "react-router-dom"
import Button from '@material-ui/core/Button'

import styles from './../styles.module.css'
import logo from '../../../assets/logop.png'

const Failed = props => {
    return (
        <>
            <div className={styles.body}>
                <div>
                    <img src={logo} alt="Logo" className={styles.img} />
                </div>
                <p className={styles.text}>Email de confirmação expirado ou inválido</p>
                <div className={styles.menuBottom}>
                    <Button variant="contained" onClick={() => props.history.push("/")}
                        className={styles.button}
                    >
                        VOLTAR PARA TELA DE LOGIN
                    </Button>
                </div>
            </div>
        </ >
    )
}

export default withRouter(Failed)