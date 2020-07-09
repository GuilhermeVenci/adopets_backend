'use strict'

const Product = use("App/Models/Product")
const Database = use('Database')

class ProductController {
  async index ({ request, response, view }) {
    const pageInt = parseInt(request.get().page)
    const perPageInt = parseInt(request.get().per_page)
    const searchTerm =
      request.get().q === 'undefined' ? '' : String(request.get().q)

    const page = Number.isInteger(pageInt) ? pageInt : 1
    const perPage = Number.isInteger(perPageInt) ? perPageInt : 1000
    const search = `%${decodeURIComponent(searchTerm)}%`

    const products = await Product.query()
      .whereRaw("LOWER(name) || LOWER(description) LIKE '%' || LOWER(?) || '%' ", search)
      .orWhereHas('category', (builder) => {
        builder.whereRaw("LOWER(name) || LOWER(description) LIKE '%' || LOWER(?) || '%' ", search)
      })
      .with('category')
      .orderBy('name', 'asc')
      .paginate(page, perPage)

    return products
  }

  async store ({ request, response }) {
    try {
      const data = request.all()

      const trx = await Database.beginTransaction()

      const product = await Product.create(data, trx)
      await trx.commit()

      return product
    } catch (err) {
      return err
    }
  }

  async show ({ params, request, response, view }) {
    const product = await Product.findByOrFail('id', params.id)
    await product.load('category')

    return product
  }

  async update ({ params, request, response }) {
    try {
      const trx = await Database.beginTransaction()
      const data = request.all()
      console.log(params.id)
      const product = await Product.findByOrFail('id', params.id)
      console.log(product.toJSON())

      product.merge(data)

      await product.save(trx)
      await trx.commit()

      return product
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: 'Product dont updated.'
        }
      })
    }
  }

  async destroy ({ params, request, response }) {
    try {
      const trx = await Database.beginTransaction()
      const product = await Product.findByOrFail('id', params.id)

      await product.delete(trx)
      await trx.commit()
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: 'Product dont deleted.'
        }
      })
    }
  }
}

module.exports = ProductController
