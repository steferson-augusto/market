'use strict'

const Helpers = use('Helpers')
const Product = use("App/Models/Product")

class ImageController {
    async store({ request, params, response }) {
        try {
            const product = await Product.find(params.id)
            if (!product) return response.status(404).send({ error: 'Produto não existe' })

            const images = request.file('image', { types: ['image'], size: '2mb' })

            await images.move(Helpers.tmpPath('uploads'), { name: `${params.id}.png`, overwrite: true })

            if (!images.moved()) return response.status(400).send({ error: images.errors() })

            return response.status(200).send('SUCESSO')
        } catch {
            return response.status(500).send('ERROR')
        }
    }

    async show({ params, response }) {
        return response.download(Helpers.tmpPath(`uploads/${params.id}.png`))
    }
}

module.exports = ImageController
