'use strict'

const Product = use("App/Models/Product")
const Database = use('Database')
const { responseError } = use('./Helpers/MessageError')
const select = ['products.id', 'products.name', 'products.description', 'products.price',
  'marks.name as mark', 'sections.name as section', 'ums.abbreviation as um']

class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, params }) {
    try {
      const products = await Database.table('products')
        .leftJoin('marks', 'products.mark_id', 'marks.id')
        .leftJoin('sections', 'products.section_id', 'sections.id')
        .leftJoin('ums', 'products.um_id', 'ums.id')
        .select(select)
      return response.status(200).send(products)

      // const all = Database.table('products').query()
    } catch {
      return response.status(500).send(responseError())
    }
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

}

module.exports = ProductController
