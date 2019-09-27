'use strict'

const { validateAll } = use('Validator')
const Um = use("App/Models/Um")
const MessageError = use('./../Helpers/MessageError')
const Operations = use('./../Helpers/Operations')

const rules = {
    name: 'required|max:40|min:2|unique:ums,name',
    abbreviation: 'required|max:2|min:1|unique:ums,abbreviation',
    active: 'required|boolean',
    description: 'min:2|max:200'
}

const rulesUpdate = {
    ...rules,
    name: 'required|max:40|min:2',
    abbreviation: 'required|max:2|min:1',
}

const messages = {
    required: 'Campo obrigatório',
    unique: 'Este item já foi cadastrado anteriormente',
    'abbreviation.min': 'Deve conter 2 caracteres',
    min: 'Deve conter 2 caracteres ou mais',
    boolean: 'Valor não permitido',
    'name.max': 'A quantidade máxima de 40 caracteres foi excedida',
    'description.max': 'A quantidade máxima de 200 caracteres foi excedida',
    'abbreviation.max': 'Deve conter 2 caracteres',
}

const requestFields = ['name', 'abbreviation', 'active', 'description']

class UmController {

    async index({ request, response }) {
        try {
            const { page, perPage, filters, sorting: [{ columnName, direction }] } = request.only(['page', 'perPage', 'sorting', 'filters'])
            let query = Um.query()
            let data = Operations.operation(query, filters)
            data = await data.orderBy(columnName, direction)
                .paginate(page + 1, perPage)

            return response.status(200).send(data)
        } catch {
            return response.status(500).send({ error: MessageError.requestFail })
        }
    }

    async store({ request, response }) {
        try {
            const data = request.only(requestFields)
            const validation = await validateAll(data, rules, messages)
            if (validation.fails()) return response.status(400).send({ error: validation.messages() })

            const um = await Um.create(data)
            return response.status(201).send({ data: um })
        } catch {
            return response.status(500).send({ error: MessageError.requestFail })
        }
    }

    async update({ params, request, response }) {
        try {
            const um = await Um.find(params.id)
            if (!um) return response.status(404).send({ error: MessageError.notFound })

            const data = request.only(requestFields)
            um.merge(data)
            const validation = await validateAll({ ...um.$attributes }, rulesUpdate, messages)
            if (validation.fails()) return response.status(400).send({ error: validation.messages() })

            await um.save()
            return response.status(200).send({ success: true })
        } catch {
            return response.status(500).send({ error: MessageError.requestFail })
        }
    }
}

module.exports = UmController