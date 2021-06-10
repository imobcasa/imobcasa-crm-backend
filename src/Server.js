const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '..', '..', '.env')})

class Server {
  port = process.env.PORT || 8000
  secret = process.env.JWT_SECRET
  token = 'teste'
  controllers


  constructor(controllers){
    this.controllers = controllers
    this.app = express()
    this._loadMiddlewares()
    this._loadRoutes()
  }


  _loadMiddlewares(){
    this.app.use(cors({
      credentials: true,
      origin: "http://localhost:3001"
    }))
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: true}))
    this.app.use(cookieParser(this.secret))
  }
  
  _loadRoutes(){
    for(const controller of this.controllers){
      this.app.use(controller.routes)
    }
  }


  listen(){
    this.app.listen(this.port, () => {
      console.log("Servidor executando na porta "+this.port)
    })
  }
}

module.exports = Server