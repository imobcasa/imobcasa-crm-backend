const { Profiles } = require('../../models')


class ProfileRepository {

  async listAll(){
    return await Profiles.findAll()
  }

}


module.exports = ProfileRepository