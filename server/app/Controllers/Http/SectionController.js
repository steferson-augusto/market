'use strict'

const Section = use("App/Models/Section")

class SectionController {
  /**
     * Show a list of all products.
     * GET products
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
  async index({ response }) {
    const sections = await Section.query().where('active', true).orderBy('name', 'asc').pluck('name')
    return response.status(200).send(sections)
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
  async show({ params: { id }, response }) {
    const section = await Section.query().where({ id }).where('active', true).fetch()
    return response.status(200).send(section)
  }
}

module.exports = SectionController
