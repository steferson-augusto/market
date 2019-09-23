'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {
    mark() {
        return this.belongsTo('App/Models/Mark')
    }
}

module.exports = Product
