const { Op } = require('sequelize')
const { Users } = require('../../models')



class UserRepository {

  async create(fields){
    const user = await Users.create(fields, {
      attributes: {
        exclude: ['password']
      }
    })
    delete user.password
    return user
  }
  
  async list(fullNameQuery = ""){
    return await Users.findAll({
      where: {
        fullName: {
          [Op.like]: `%${fullNameQuery}%`
        }
      },
      attributes: {
        exclude: ['password']
      },
      include: ['profile'],
    })
  }

  async findAll(){
    const users = await Users.findAll({
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

  async updateMyUser({
    fullName,
    username,
    email,
    phone,
    id
  }){       
    return await Users.update({
      fullName,
      username,
      email,
      phone
    }, {
      where: {
        id
      }
    })
  }

  async delete(fields){
    const result = await Users.destroy({
      where:
      {
        id:fields.id
      },
    })
    return result
  }

  async getOne(fields, exclude = ['password'], raw = false){
    const user = await Users.findOne({
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

  async usersForSales(profileId){
    return await Users.findAll({
      where: {
        profileId
      },
      attributes: {
        exclude: ['email', 'phone', 'profileId', 'createdAt', 'updatedAt', 'password', 'managerId', 'username']
      }
    })
  }
  
  
}

module.exports = UserRepository
