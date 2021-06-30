const Service = require('../Service')
const { UserRepository, ProfilesRepository } = require('../../repositories')

class UserService extends Service {
  _requiredFields = ['fullName', 'username', 'email', 'password', 'admin', 'active']
  _updateRequiredFields = ['id']
  _deleteUserRequiredFields = ['x-user-id']
  _getUserRequiredFields = ['x-user-id']
  _changePasswordRequiredFields = ['password', 'newPassword', 'reqUserId', 'admin']
  _resetPasswordRequiredFields = ['password', 'x-user-id']
  _listRequiredFields = ['x-profiles']
  _createRequiredFields = ['fullName', 'username', 'profileId', 'password']
  _updateMyUserRequiredFields = ['fullName', 'email', 'phone', 'username', 'reqUserId']

  constructor(){
    super()
    this._userRepository = new UserRepository()
    this._profilesRepository = new ProfilesRepository()
  }

  
  async _checkPassword(user, password) {
    if (!await user.validPassword(password)) {
      this._throwUnalthorizedError("password")
    }
  }

  async _checkSameOldPassword(user, password) {
    if (await user.validPassword(password)) {
      this._throwInvalidParamError("password")
    }
  }


  async _getManager(user){
    if(user.managerId){
      const manager = await this._userRepository.getOne({ id: user.managerId })
      user.manager = {
        fullName: manager.fullName,
        id: manager.id
      }
    }
    return user
  }

  async createUser(fields) {
    await this._checkRequiredFields(this._createRequiredFields, fields)
    const {
      fullName,
      username,
      email,
      phone,
      profileId,
      managerId,
      password      
    } = fields

    if(managerId){
      this._checkEntityExsits(
        await this._userRepository.getOne({ id: managerId }),
        "managerId"
      )
    }
    
    this._checkEntityExsits(
      await this._profilesRepository.getOne({ id: profileId }),
      "profileId"
    )


    return await this._userRepository.create({
      fullName,
      username,
      email,
      phone,
      profileId,
      managerId,
      password      
    })
  }

  async list(fields) {
    await this._checkRequiredFields(this._listRequiredFields, fields)
    await this._checkFieldExists(fields['x-profiles'], 'x-profiles')

    const users =  await this._userRepository.list()


    return users.filter(user => fields['x-profiles'].includes(user.profile.name.toUpperCase()))
  }

  async updateUser(fields) {
    await this._checkRequiredFields(this._updateRequiredFields, fields)
    const user = await this._userRepository.getOne(fields)
    await this._checkEntityExsits(user)    
    return await this._userRepository.update(user, fields)
  }

  async updateMyUser(fields) {
    await this._checkRequiredFields(this._updateMyUserRequiredFields, fields)    

    const {
      fullName,
      username,
      email,
      phone,
      reqUserId
    } = fields

    const user = await this._userRepository.getOne({
      id: reqUserId
    })
    await this._checkEntityExsits(user)    

    return await this._userRepository.updateMyUser({
      fullName,
      username,
      email,
      phone,
      id: reqUserId
    })
  }

  async deleteUser(fields) {
    await this._checkRequiredFields(this._deleteUserRequiredFields, fields)
    const user = await this._userRepository.getOne({
      id: fields['x-user-id']
    })
    await this._checkEntityExsits(user)
    return await this._userRepository.delete({
      id:  fields['x-user-id']
    })
  }

  async getUser(fields) {
    this._checkRequiredFields(this._getUserRequiredFields, fields)
    this._checkFieldExists(fields['x-user-id'], 'x-user-id')
    const user = await this._userRepository.getOne({
      id: fields['x-user-id']
    })
    await this._checkEntityExsits(user, 'x-user-id')    
    if(!user.managerId){
      return user
    }
    const userWithManager = await this._getManager(user)
    return {
      id: userWithManager.id,
      fullName: userWithManager.fullName,
      username: userWithManager.username,
      email: userWithManager.email,
      phone: userWithManager.phone,
      profileId: userWithManager.profileId,
      managerId: userWithManager.managerId,
      createdAt: userWithManager.createdAt,
      updatedAt: userWithManager.updatedAt,
      profile: {
        id: userWithManager.profile.id,
        name: userWithManager.profile.name,
        admin: userWithManager.profile.admin,
        teamManager: userWithManager.profile.teamManager,
        createdAt: userWithManager.profile.createdAt,
        updatedAt: userWithManager.profile.updatedAt,
      },
      manager: {
        fullName: userWithManager.manager.fullName,
        id: userWithManager.manager.id,
      }
    }
  }

  async changePassword(fields){
    await this._checkRequiredFields(this._changePasswordRequiredFields, fields)
    const user = await this._userRepository.getOne({id: fields.reqUserId}, [])
    await this._checkEntityExsits(user, "reqUserId")
    await this._checkPassword(user, fields.password)
    await this._checkSameOldPassword(user, fields.newPassword)
    const passwordHash = await user.generatePasswordHash(fields.newPassword)

    return await this._userRepository.changePassword(user, passwordHash)
  }

  async resetPassword(fields){
    await this._checkRequiredFields(this._resetPasswordRequiredFields, fields)
    const { password } = fields
    const id = fields['x-user-id']
    const user = await this._userRepository.getOne({id: id}, [])
    await this._checkEntityExsits(user, "id")
    await this._checkSameOldPassword(user, password)
    const passwordHash = await user.generatePasswordHash(password)
    return await this._userRepository.changePassword(user, passwordHash)
  }

}

module.exports = UserService
