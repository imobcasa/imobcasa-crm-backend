const { Profiles } = require('../../models')


class ProfileRepository {

  async listAll(){
    return await Profiles.findAll()
  }

  async getOne({ id }){
    return await Profiles.findOne({
      where: {
        id
      }
    })
  }

}


module.exports = ProfileRepository