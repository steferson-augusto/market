'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tabletops
 */

const { validate } = use('Validator')
const Tabletop = use("App/Models/Tabletop")
const Master = use("App/Models/Master")

const rules = {
  name: 'required|max:40|min:4',
  type: 'required|in:public,private',
  password: 'max:30|min:6',
  description: 'max:254',
  locked: 'boolean'
}
const messages = {
  required: (field) => `Campo ${field} é obrigatório`,
  min: 'Mínimo de caracteres não atingido',
  max: 'Máximo de caracteres excedido',
  boolean: 'Valor inválido',
  'type.in': 'Este campo deve ser public ou private'
}

class TabletopController {
  // cria uma mesa e define o criador como mestre da mesa
  async store({ request, auth }) {
    try {
      const user_id = auth.user.id
      const data = request.only(['name', 'description', 'locked', 'type', 'password'])

      const validation = await validate(data, rules, messages)
      if (validation.fails()) return validation.messages()

      const tabletop = await Tabletop.create(data)
      const master = await Master.create({ user_id, tabletop_id: tabletop.id })
      return { tabletop, master }
    } catch (error) {
      return { 
        error: true,
        message: 'Falha na requisição.'
      }
    }
  }

  // lista todas mesas para todos os usuário com paginate
  async list({ request }) {
    try {
      const query = request.only(['page', 'limit'])
      const tabletops = await Tabletop.query()
        .setHidden(['password', 'created_at', 'updated_at'])
        .paginate(query.page, query.limit)
      return { tabletops }

    } catch (error) {
      return { 
        error: true,
        message: 'Falha na requisição.'
      }
    }
  }

  // retorna a mesa solicitada
  async show({ params }) {
    try {
      let tabletop = await Tabletop.find(params.id)

      return { tabletop }
    } catch (error) {
      return { 
        error: true,
        message: 'Falha na requisição.'
      }
    }
  }

  async update({ request, params, auth }) {
    try {
      const user_id = auth.user.id
      const tabletop_id = params.id
      const subquery = await Master.query()
        .where({ user_id }).where({ tabletop_id })
        .first()
  
      if (!subquery) return {
        error: true,
        message: 'Você deve ser mestre para realizar estas alterações.'
      }

      // Validar campos
      const data = request.only(['name', 'description', 'locked', 'type', 'password'])
      const tabletop = await Tabletop.find(tabletop_id)
      tabletop.merge(data)
      await tabletop.save()
      return { tabletop }
    } catch(error) {
      return { 
        error: true,
        message: 'Falha na requisição.'
      }
    }
  }

  // retorna as mesas onde o user é mestre ou jogador
  async tabletopsByUser({ auth, request }) {
    try {
      const { id: user_id } = await auth.getUser()
      const query = request.only(['page', 'limit'])
      const subquery_master = await Master.query()
        .where({ user_id })
        .pluck('tabletop_id')

      const tabletops = await Tabletop.query()
        .whereIn('id', subquery_master)
        .setHidden(['password', 'created_at', 'updated_at'])
        .paginate(query.page, query.limit)
      return { tabletops }

    } catch (error) {
      return { 
        error: true,
        message: 'Falha na requisição.'
      }
    }
  }

  async destroy ({ params, request, auth }) {
    try {
      const user_id = auth.user.id
      const tabletop_id = params.id
      const subquery = await Master.query()
        .where({ user_id }).where({ tabletop_id })
        .first()
  
      if (!subquery) return {
        error: true,
        message: 'Você deve ser mestre para excluir esta mesa.'
      }

      // Validar campos
      const name = request.only(['name'])
      const tabletop = await Tabletop.find(tabletop_id)
      
      if (name != tabletop.name || name.length < 4) {
        return { 
          error: true,
          message: 'Nome da mesa inválido ou diferente.'
        }
      }

      await tabletop.delete()
      return {
        success: true,
        message: `Mesa ${name} apagado com sucesso`
      }
    } catch(error) {
      return { 
        error: true,
        message: 'Falha na requisição.'
      }
    }
  }

}

module.exports = TabletopController
