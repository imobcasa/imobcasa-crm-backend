const { Op } = require('sequelize')
const { User } = require('../../models')



class UserRepository {

  async create(fields){
    const user = await User.create(fields, {
      attributes: {
        exclude: ['password']
      }
    })
    delete user.password
    return user
  }
  
  async list(){
    return await User.findAll({
      attributes: {
        exclude: ['password']
      },
      include: ['profile'],
    })
  }

  async findAll(){
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    })
    return users
  }

  async update(user, fields){   
    user.fullName = fields.fullName
    user.username = fields.username
    user.email = fields.email
    user.phone = fields.phone
    user.profileId = fields.profileId
    user.managerId = fields.managerId

    await user.save()
    return user
  }

  async delete(fields){
    const result = await User.destroy({
      where:
      {
        id:fields.id
      },
    })
    return result
  }

  async getOne(fields, exclude = ['password'], raw = false){
    const user = await User.findOne({
      where: {
        id: fields.id
      },
      attributes: {
        exclude
      },
      include: ['profile'],
      raw
    })
    return user
  }

  async changePassword(user, passwordHash){
    user.password = passwordHash
    return await user.save()
  } 
  
}

module.exports = UserRepository
