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
}

module.exports = MessageError