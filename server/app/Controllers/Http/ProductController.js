'use strict'

const Product = use("App/Models/Product")
const Database = use('Database')
const { responseError } = use('./Helpers/MessageError')
const select = ['products.id', 'products.name', 'products.description', 'products.price',
  'marks.name as mark', 'sections.name as section', 'ums.abbreviation as um']

class ProductController {
  async index ({ request, response }) {
    try {
      const { direction, columnName, section, page, perPage, query } = request.only(['direction', 'columnName', 'section', 'page', 'perPage', 'query']) 
      const products = await Database.table('products')
        .where(function() {
          this.where('products.active', true)
          if (query) this.where('products.name', 'like', `%${query}%`)
        })
        .where(function() {
          this.where('sections.active', true).where('products.section_id', section > 0 ? '=' : '>' , section)
          if (section == 0) this.orWhereNull('products.section_id')
        })
        .where(function() {
          this.where('marks.active', true).orWhereNull('products.mark_id')
        })
        .leftJoin('marks', 'products.mark_id', 'marks.id')
        .leftJoin('sections', 'products.section_id', 'sections.id')
        .leftJoin('ums', 'products.um_id', 'ums.id')
        .select(select)
        .orderBy(`products.${columnName}`, direction)
        .paginate(page + 1, perPage)

      return response.status(200).send(products)
    } catch {
      return response.status(500).send(responseError())
    }
  }

  async show ({ params, request, response, view }) {
  }

}

module.exports = ProductController
