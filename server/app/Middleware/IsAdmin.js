'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')
const MessageError = use('./../Controllers/Http/Helpers/MessageError')

class IsAdmin {

  async handle({ request, response, auth }, next) {
    // call next to advance the request
    const { id: user_id } = auth.user
    const [count] = await Database
      .table('administrators')
      .where({ user_id, active: true })
      .count()

    const total = count['count(*)']
    
    if (total == 0) {
      return response.status(403).send({ error: MessageError.notAdmin })
    }
    await next()
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async wsHandle({ request }, next) {
    // call next to advance the request
    await next()
  }
}

module.exports = IsAdmin
