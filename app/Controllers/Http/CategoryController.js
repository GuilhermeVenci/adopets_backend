'use strict'

const Category = use("App/Models/Category")
const Database = use('Database')

class CategoryController {
  async index () {
    const categories = await Category.all()

    return categories
  }

  async store ({ request, response }) {
    try {
      const data = request.only(['name', 'description'])

      const trx = await Database.beginTransaction()

      const category = await Category.create(data, trx)
      await trx.commit()

      return category
    } catch (err) {
      return err
    }
  }

  async show ({ params, request, response, view }) {
    const category = await Category.findByOrFail('id', params.id)
    await category.load('products')

    return category
  }

  async update ({ params, request, response }) {
    try {
      const trx = await Database.beginTransaction()
      const data = request.all()
      const category = await Category.findByOrFail('id', params.id)

      category.merge(data)

      await category.save(trx)
      await trx.commit()

      return category
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: 'Não foi possivel editar a Categoria.'
        }
      })
    }
  }

  async destroy ({ params, response, auth }) {
    try {
      const trx = await Database.beginTransaction()
      const category = await Category.findByOrFail('id', params.id)

      await category.delete(trx)
      await trx.commit()
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: 'Não foi possivel excluir a Categoria.'
        }
      })
    }
  }
}

module.exports = CategoryController
