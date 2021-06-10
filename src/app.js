const Server = require('./Server')
const {
  LoginController,
  UserController,
  GenericController
} = require('./controllers')

const database = require('./database')


async function app() {
  try {
    await database()
    const server = new Server([
      new UserController(),
      new LoginController(),
      new GenericController()
    ])

    await server.listen()
  } catch (error) {
    console.error(error)
  }

}

app()