'use strict'

const Model = use('Model')
const uuid = require('uuid');

class Category extends Model {
  // static boot () {
  //   const category = {
  //     id : uuid.v4()
  //   }
  //   super.boot()

  //   this.addHook('beforeCreate', async (categoryInstance) => {
  //     categoryInstance.id = category.id
  //   })
  //   this.addHook('afterCreate', async (categoryInstance) => {
  //     categoryInstance.id = await category.id
  //     await delete category.id
  //     category.id = await uuid.v4()
  //   })
  // }

  products () {
    return this.hasMany('App/Models/Product')
  }
}

module.exports = Category
