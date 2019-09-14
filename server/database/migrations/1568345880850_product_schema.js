'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.integer('section_id').unsigned().references('id').inTable('sections').nullable()
      table.integer('mark_id').unsigned().references('id').inTable('marks').nullable()
      table.integer('um_id').unsigned().references('id').inTable('ums').nullable()
      table.decimal('price').notNullable()
      table.boolean('active').defaultTo(1).notNullable()
      table.integer('estoque').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductSchema
