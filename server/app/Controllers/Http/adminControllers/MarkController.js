'use strict'

const Mark = use("App/Models/Mark")
const MessageError = use('./../Helpers/MessageError')

class MarkController {

    async index({ request, response }) {
        try {
            const { page, perPage } = request.only(['page', 'perPage'])
            const data = await Mark.query().paginate(page, perPage)
            return response.status(200).send(data)
        } catch (error) {
            return response.status(500).send({ error: MessageError.requestFail })
        }
    }

    async create({ request }) {
    }

    async store({ request }) {
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
