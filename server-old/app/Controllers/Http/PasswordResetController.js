'use strict'

const { validate, validateAll } = use('Validator')
const User = use('App/Models/User')
const PasswordReset = use('App/Models/PasswordReset')
const randomString = require('random-string')
const Mail = use('Mail')
const { MessageError, responseError } = use('./Helpers/MessageError')

const rules = {
  email: 'required|email|exists:users,email|min:4|max:254',
  password: 'required|confirmed|max:30|min:6',
  token: 'required'
}

const mensagens = {
  required: 'Campo obrigatório',
  min: 'Mínimo de caracteres não atingido',
  max: 'Máximo de caracteres excedido',
  'email.email': 'Email com formato inválido',
  'email.exists': 'Este email ainda não foi cadastrado',
  'password.confirmed': 'As senhas não conferem',
}

class PasswordResetController {
  async sendResetLinkEmail({ request, response }) {
    const validation = await validateAll(request.only('email'), {
      email: 'required|email|exists:users,email|min:4|max:254'
    }, mensagens)

    if (validation.fails()) return response.status(400).send({ error: validation.messages() })

    const user = await User.findBy('email', request.input('email'))
    if (user.provider) {
        const error = [{
            field: 'email',
            message: `Email cadastrado com ${user.provider}, redefina sua senha através da respectiva rede social`
        }]
        return response.send(400).send({ error })
    }

    try {
      await PasswordReset.query().where('email', user.email).delete()
      const { token } = await PasswordReset.create({ email: user.email, token: randomString({ length: 40 }) })
      const mailData = { user: user.toJSON(), token }

      await Mail.send('emails.password_reset', mailData, message => {
        message
          .to(user.email)
          .from('steferson1996@gmail.com')
          .subject('Recuperação de Senha')
      })

      return response.status(200).send(true)
    } catch { return response.status(400).send({ error: MessageError.passwordResetFailed }) }
  }

  async reset({ request, response }) {
    // validate form inputs
    const validation = await validateAll(request.all(), rules, mensagens)

    if (validation.fails()) return response.status(400).send({ error: validation.messages() })

    try {
      // get user by the provider email
      const user = await User.findBy('email', request.input('email'))

      // check if password reet token exist for user
      const token = await PasswordReset.query()
        .where('email', user.email)
        .where('token', request.input('token'))
        .first()

      if (!token) return response.status(400).send({ error: MessageError.recoveryInvalid })

      user.password = request.input('password')
      await user.save()

      // delete password reset token
      await PasswordReset.query().where('email', user.email).delete()

      return response.status(200).send(true)
    } catch { return response.status(500).send({ error: MessageError.requestFail }) }
  }
}

module.exports = PasswordResetController
