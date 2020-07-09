'use strict'

const Model = use('Model')
const uuid = require('uuid');

class Product extends Model {
  static boot () {
    const product = {
      id : uuid.v4()
    }
    super.boot()

    this.addHook('beforeCreate', async (productInstance) => {
      productInstance.id = product.id
    })
    this.addHook('afterCreate', async (productInstance) => {
      productInstance.id = await product.id
      await delete product.id
      product.id = await uuid.v4()
    })
  }

  category () {
    return this.belongsTo('App/Models/Category')
  }
}

module.exports = Product
