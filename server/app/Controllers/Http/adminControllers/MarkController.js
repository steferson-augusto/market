'use strict'

const { validateAll } = use('Validator')
const Mark = use("App/Models/Mark")
const MessageError = use('./../Helpers/MessageError')
const Operations = use('./../Helpers/Operations')

const rules = {
    name: 'required|max:40|min:2',
    active: 'required|boolean',
    description: 'min:2|max:200'
}

const messages = {
    required: 'Campo obrigatório',
    min: 'Deve conter 2 caracteres ou mais',
    boolean: 'Valor não permitido',
    'name.max': 'A quantidade máxima de 40 caracteres foi excedida',
    'description.max': 'A quantidade máxima de 200 caracteres foi excedida',
}

class MarkController {

    async index({ request, response }) {
        try {
            const { page, perPage, filters, sorting: [{columnName, direction}] } = request.only(['page', 'perPage', 'sorting', 'filters'])
            let query = Mark.query()
            let data = Operations.operation(query, filters)
            data = await data.orderBy(columnName, direction)
                .paginate(page+1, perPage)
                
            return response.status(200).send(data)
        } catch (e) {
            return response.status(500).send({ error: MessageError.requestFail, e })
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

    async update({ params, request, response }) {
        try {
            const mark = await Mark.find(params.id)
            if (!mark) return response.status(404).send({ error: MessageError.notFound })

            const data = request.only(['name', 'active', 'description'])
            mark.merge(data)
            const validation = await validateAll({...mark.$attributes}, rules, messages)
            if (validation.fails()) return response.status(400).send({ error: validation.messages() })
            
            await mark.save()
            return response.status(200).send({success: true})
        } catch {
            return response.status(500).send({ error: MessageError.requestFail })
        }
    }
}

module.exports = MarkController
