'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UmSchema extends Schema {
  up () {
    this.create('ums', (table) => {
      table.increments()
      table.string('name', 40).notNullable()
      table.string('abbreviation', 15).notNullable()
      table.text('description').nullable()
      table.boolean('active').defaultTo(1).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('ums')
  }
}

module.exports = UmSchema
