'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate } = use('Validator')
const Tabletop = use("App/Models/Tabletop")
const Master = use("App/Models/Master")

class MasterController {
  async store({ auth, request }) {
    try {
      const user_id = auth.user.id
      
      const data = request.only(['tabletop_id', 'user_id'])
      //usar validate

      const query = await Master.query()
        .where({ user_id }).where('tabletop_id', data.tabletop_id)
        .first()
  
      if (!query) return {
        error: true,
        message: 'Você deve ser mestre para definir outro mestre.'
      }

      const master = await Master.findOrCreate(
        { user_id: data.user_id, tabletop_id: data.tabletop_id }, data
      )
      return { master }
    } catch(error) {
      return { 
        error: true,
        message: 'Nome da mesa inválido ou diferente.'
      }
    }
  }

  async destroy({ auth, params }) {
    try {
      const user_id = auth.user.id
      const master = await Master.find(params.id)

      const query = await Master.query()
        .where({ user_id })
        .where('tabletop_id', master.tabletop_id)
        .first()
  
      if (!query) return {
        error: true,
        message: 'Você deve ser mestre para excluir outro mestre desta mesa.'
      }

      await master.delete()
      return {
        success: true,
        message: `Mestre removido com sucesso`
      }
    } catch(error) {
      return { 
        error: true,
        message: 'Falha na requisição.'
      }
    }
  }
}

module.exports = MasterController
