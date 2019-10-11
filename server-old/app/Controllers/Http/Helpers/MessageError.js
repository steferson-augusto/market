const MessageError = {
    requestFail: [{
        field: 'general',
        message: 'Falha na requisição, tente novamente ou contate o administrador',
    }],
    loginFail: [{
        field: 'general',
        message: 'Falha no login, verifique suas credenciais',
    }],
    notAdminLogin: [{
        field: 'general',
        message: 'Este email não existe ou não pertence a um administrador',
    }],
    notAdmin: [{
        field: 'general',
        message: 'Você deve ser administrador para realizar esta operação',
    }],
    notFound: [{
        field: 'general',
        message: 'O item solicitado não foi encontrado',
    }],
    userInvalid: [{
        field: 'general',
        message: 'Usuário inválido',
    }],
    passwordResetFailed: [{
        field: 'general',
        message: 'Houve uma falha no envio do email, certifique-se de que você informou o email correto',
    }],
    recoveryInvalid: [{
        field: 'general',
        message: 'Email de recuperação inválido ou expirado',
    }],
}

const e = 'Falha na requisição, tente novamente ou contate o administrador'
const responseError = (kind = 'requestFail', errors = [], message = e, field = 'general' ) => {
    if (kind && MessageError[kind]) {
        return { error: MessageError[kind] }
    } else if (errors.length > 0) {
        return { error: errors }
    } else {
        return { error: [{ message, field }] }
    }
}

module.exports = { MessageError, responseError }