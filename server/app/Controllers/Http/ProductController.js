'use strict'

const Product = use("App/Models/Product")
const Database = use('Database')
const { responseError } = use('./Helpers/MessageError')

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
      const products = await Product.all()
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
