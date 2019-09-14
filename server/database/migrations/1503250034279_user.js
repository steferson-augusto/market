'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('email', 254).notNullable().unique()
      table.string('password', 90).notNullable()
      table.boolean('active').defaultTo(0).notNullable()
      table.string('name', 120).notNullable()
      table.string('image_path', 254).nullable()
      table.string('provider_id').nullable()
      table.string('provider').nullable()
      table.date('date_birth').nullable()
      table.text('description').nullable()
      table.string('confirmation_token')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema