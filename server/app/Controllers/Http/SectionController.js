'use strict'

const Section = use("App/Models/Section")
const { responseError } = use('./Helpers/MessageError')

class SectionController {
  async index({ response }) {
    try {
      const sections = await Section.query().where('active', true).orderBy('name', 'asc').select(['id', 'name']).fetch()
      return response.status(200).send(sections)
    } catch {
      return response.status(500).send(responseError())
    }
  }

  async show({ params: { id }, response }) {
    const section = await Section.query().where({ id }).where('active', true).fetch()
    return response.status(200).send(section)
  }
}

module.exports = SectionController
