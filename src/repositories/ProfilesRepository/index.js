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

  async getSellerProfile(){
    return await Profiles.findOne({
      where: {
        name: 'Corretor'
      }
    })
  }

}


module.exports = ProfileRepository