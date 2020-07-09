'use strict'

const User = use('App/Models/User')
const Database = use('Database')

class UserController {
  async store ({ request, response }) {
    try {
      const data = request.only(['username', 'email', 'password'])

      const trx = await Database.beginTransaction()

      const user = await User.create(data, trx)
      await trx.commit()

      return user
    } catch (err) {
      return err
    }
  }
}

module.exports = UserController
