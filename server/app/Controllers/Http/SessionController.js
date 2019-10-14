'use strict'

const Database = use('Database')
const MessageError = use('./Helpers/MessageError')

const select = ['users.id', 'users.email', 'users.name', 'users.date_birth', 'users.image_path',
'users.active', 'users.description']

class SessionController {
  // Padronizar MessageError e response.status
  async create({ request, auth }) {
    const { email, password } = request.all()
    const { token } = await auth.attempt(email, password)
    delete token.refreshToken
    const user = await Database.table('users').where({ email }).select(select).first()
    return { token, user }
  }

  async createAdmin({ request, response, auth }) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await Database
        .table('users')
        .innerJoin('administrators', 'users.id', 'administrators.user_id')
        .where('users.email', email)
        .where('administrators.active', true)
        .select(select)
        .first()

      if (!user) return response.status(401).send({ error: MessageError.notAdminLogin })
      else {
        try {
          const { token } = await auth.attempt(email, password)
          return response.status(200).send({ token, user })
        } catch (e) { return response.status(401).send({ error: MessageError.loginFail }) }
      }
    } catch (e) { return response.status(500).send({ error: MessageError.requestFail }) }
  }

  async app({ response }){
    return response.status(200).send('SUCESSO')
  }
}

module.exports = SessionController