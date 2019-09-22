'use strict'

const { validateAll } = use('Validator')
const Product = use("App/Models/Product")
const MessageError = use('./../Helpers/MessageError')
const Operations = use('./../Helpers/Operations')

const rules = {
    name: 'required|max:40|min:2',
    active: 'required|boolean',
    price: 'required|number|above:0',
    description: 'min:2|max:200',
    mark_id: 'exists:marks,id',
    um_id: 'exists:ums,id',
    section_id: 'exists:sections,id',
}

const messages = {
    required: 'Campo obrigatório',
    min: 'Deve conter 2 caracteres ou mais',
    boolean: 'Valor não permitido',
    'name.max': 'A quantidade máxima de 40 caracteres foi excedida',
    'description.max': 'A quantidade máxima de 200 caracteres foi excedida',
    exists: 'Pré-requisito deve existir',
    number: 'Deve ser um número válido',
    above: 'Deve ser maior que 0'
}

class ProductController {

    async index({ request, response }) {
        try {
            const { page, perPage, filters, sorting: [{ columnName, direction }] } = request.only(['page', 'perPage', 'sorting', 'filters'])
            let query = Product.query()
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
            const data = request.only(['name', 'price', 'active', 'description'])
            const validation = await validateAll(data, rules, messages)
            if (validation.fails()) return response.status(400).send({ error: validation.messages() })

            const product = await Product.create(data)
            return response.status(201).send({ data: product })
        } catch {
            return response.status(500).send({ error: MessageError.requestFail })
        }
    }

    async update({ params, request, response }) {
        try {
            const product = await Product.find(params.id)
            if (!product) return response.status(404).send({ error: MessageError.notFound })

            const data = request.only(['name', 'price', 'active', 'description'])
            product.merge(data)
            const validation = await validateAll({ ...product.$attributes }, rules, messages)
            if (validation.fails()) return response.status(400).send({ error: validation.messages() })

            await product.save()
            return response.status(200).send({ success: true })
        } catch {
            return response.status(500).send({ error: MessageError.requestFail })
        }
    }
}

module.exports = ProductController
