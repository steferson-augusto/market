'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SectionSchema extends Schema {
  up () {
    this.create('sections', (table) => {
      table.increments()
      table.string('name', 40).notNullable()
      table.text('description').nullable()
      table.boolean('active').defaultTo(1).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('sections')
  }
}

module.exports = SectionSchema
