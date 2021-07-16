const jwt = require('jsonwebtoken')

class JwtImplementation {
  privateKey = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n')
  publicKey = process.env.PUBLIC_KEY.replace(/\\n/gm, '\n')



  async generateAccessToken(id, profile){
    console.log("privateKey", this.privateKey)
    console.log("publicKey", this.publicKey)

    return await jwt.sign({id, profile}, this.privateKey, {
      expiresIn: "1d",
      algorithm: 'RS256'
    })
  }

  async generateRefreshToken(id, profile){    
    console.log("privateKey", this.privateKey)
    console.log("publicKey", this.publicKey)
    return await jwt.sign({id, profile}, this.privateKey, {
      expiresIn: "30d",
      algorithm: 'RS256'
    })
  }

  async decodeToken(token){
    return await jwt.verify(token, this.publicKey, {
      algorithms: ['RS256']
    })    
  }
}

module.exports = JwtImplementation
