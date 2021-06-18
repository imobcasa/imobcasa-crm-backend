const Server = require('./Server')
const {
  LoginController,
  UserController,
  GenericController,
  CustomerController,
  SalesController,
  DocumentsController,
  ProfilesController
} = require('./controllers')

const database = require('./database')


async function app() {
  try {
    await database()
    const server = new Server([
      new UserController(),
      new LoginController(),
      new GenericController(),
      new CustomerController(),
      new SalesController(),
      new DocumentsController(),
      new ProfilesController()
    ])

    await server.listen()
  } catch (error) {
    console.error(error)
  }

}

app()