const Service = require('../Service')
const { ProfilesRepository } = require('../../repositories')

class ProfileService extends Service {

  constructor(){
    super()
    this._profilesRepository = new ProfilesRepository()
  }


  async listAll(){
    return await this._profilesRepository.listAll()
  }


}

module.exports = ProfileService
