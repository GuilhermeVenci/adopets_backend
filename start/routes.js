'use strict'

const Route = use('Route')

Route.get('/', () => {
  return { gretting: 'Welcome to API Adopets!' }
})
Route.post('users', 'UserController.store')
Route.post('sessions', 'SessionController.store')

Route.group(() => {
  Route.resource('categories', 'CategoryController').apiOnly()
  Route.resource('products', 'ProductController').apiOnly()
}).middleware(['auth'])
