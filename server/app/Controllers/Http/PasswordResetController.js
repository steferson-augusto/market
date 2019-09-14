'use strict'

const { validate, validateAll } = use('Validator')
const User = use('App/Models/User')
const PasswordReset = use('App/Models/PasswordReset')
const randomString = require('random-string')
const Mail = use('Mail')

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
  async sendResetLinkEmail({ request }) {
    // validate form inputs
    const validation = await validate(request.only('email'), {
      email: 'required|email|exists:users,email|min:4|max:254'
    }, mensagens)

    if (validation.fails()) return { error: validation.messages() }

    const user = await User.findBy('email', request.input('email'))
    if (user.provider) {
      return {
        error: [
          {
            field: 'email',
            message: `Email cadastrado com ${user.provider}, redefina sua senha através da respectiva rede social`
          }
        ]
      }
    }

    try {
      // get user

      await PasswordReset.query().where('email', user.email).delete()

      const { token } = await PasswordReset.create({
        email: user.email,
        token: randomString({ length: 40 })
      })

      const mailData = {
        user: user.toJSON(),
        token
      }

      await Mail.send('emails.password_reset', mailData, message => {
        message
          .to(user.email)
          .from('steferson1996@gmail.com')
          .subject('Recuperação de Senha')
      })

      return true
    } catch (error) {
      return {
        error: [
          {
            field: 'email',
            message: 'Houve uma falha no envio do email, certifique-se de que você informou o email correto'
          }
        ]
      }
    }

  }

  // showResetForm({ params, view }) {
  //   return view.render('layouts.reset_pass', { token: params.token })
  // }

  async reset({ request, response }) {
    // validate form inputs
    const validation = await validateAll(request.all(), rules, mensagens)

    if (validation.fails()) {
      const error = validation.messages()
      return { error }
    }

    try {
      // get user by the provider email
      const user = await User.findBy('email', request.input('email'))

      // check if password reet token exist for user
      const token = await PasswordReset.query()
        .where('email', user.email)
        .where('token', request.input('token'))
        .first()

      if (!token) {
        return { error: [
          {
            field: 'general',
            message: 'Email de recuperação inválido ou expirado',
            validation: 'token'
          }
        ]}
      }

      user.password = request.input('password')
      await user.save()

      // delete password reset token
      await PasswordReset.query().where('email', user.email).delete()

      return response.status(200).send(true)
    } catch (error) {
      // display error message
      return { error: [
        {
          field: 'general',
          message: 'Falha na requisição',
          validation: 'general'
        }
      ]}
    }
  }
}

module.exports = PasswordResetController
