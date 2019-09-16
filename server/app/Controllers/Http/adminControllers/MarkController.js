'use strict'

const { validateAll } = use('Validator')
const Mark = use("App/Models/Mark")
const MessageError = use('./../Helpers/MessageError')

const rules = {
    name: 'required|max:40|min:2',
    active: 'required|boolean',
    description: 'min:2'
}

const messages = {
    required: 'Campo obrigatório',
    min: 'Deve conter 2 caracteres ou mais',
    max: 'Tamanho máximo de 40 caracteres',
    boolean: 'Valor não permitido'
}

class MarkController {

    async index({ request, response }) {
        try {
            const { page, perPage } = request.only(['page', 'perPage'])
            const data = await Mark.query().paginate(page, perPage)
            return response.status(200).send(data)
        } catch {
            return response.status(500).send({ error: MessageError.requestFail })
        }
    }

    async store({ request, response }) {
        try {
            const data = request.only(['name', 'active', 'description'])
            const validation = await validateAll(data, rules, messages)
            if (validation.fails()) return response.status(400).send({ error: validation.messages() })
            
            const mark = await Mark.create(data)
            return response.status(201).send({ data: mark })
        } catch {
            return response.status(500).send({ error: MessageError.requestFail })
        }
    }

    async show({ params, request }) {
    }

    async edit({ params, request }) {
    }

    async update({ params, request }) {
    }

    async destroy({ params, request }) {
    }
}

module.exports = MarkController
