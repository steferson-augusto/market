'use strict'

const { validateAll } = use('Validator')
const Product = use("App/Models/Product")
const MessageError = use('./../Helpers/MessageError')
const Operations = use('./../Helpers/Operations')

const rules = {
    name: 'required|max:40|min:2',
    active: 'required|boolean',
    price: 'required|numeric|min:1',
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
    numeric: 'Deve ser um número'
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
}

module.exports = ProductController
