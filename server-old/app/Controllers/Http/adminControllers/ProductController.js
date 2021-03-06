'use strict'

const { validateAll } = use('Validator')
const Product = use("App/Models/Product")
const Mark = use("App/Models/Mark")
const Section = use("App/Models/Section")
const Um = use("App/Models/Um")
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

const columns = [
    'products.id', 'products.name', 'products.active', 'products.price', 'products.description', 
    'products.mark_id', 'products.um_id', 'products.section_id',
]

const requestFields = ['name', 'price', 'active', 'description', 'mark_id', 'section_id', 'um_id']

class ProductController {

    async index({ request, response }) {
        try {
            const { page, perPage, filters, sorting: [{ columnName, direction }] } = request.only(['page', 'perPage', 'sorting', 'filters'])
            let query = Product.query()
            let data = Operations.operation(query, filters)
            data = await data
                .select(...columns)
                .orderBy(`products.${columnName}`, direction)
                .paginate(page + 1, perPage)

            const marks = await Mark.query().orderBy('name', 'asc').fetch()
            const sections = await Section.query().orderBy('name', 'asc').fetch()
            const ums = await Um.query().orderBy('name', 'asc').fetch()
            return response.status(200).send({ data, marks, sections, ums })
        } catch {
            return response.status(500).send({ error: MessageError.requestFail })
        }
    }

    async store({ request, response }) {
        try {
            const data = request.only(requestFields)
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

            const data = request.only(requestFields)
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
