const Service = require('../Service')
const { UserRepository } = require('../../repositories')

class UserService extends Service {
  _requiredFields = ['fullName', 'username', 'email', 'password', 'admin', 'active']
  _updateRequiredFields = ['id']
  _deleteUserRequiredFields = ['id']
  _getUserRequiredFields = ['id']
  _changePasswordRequiredFields = ['password', 'newPassword', 'reqUserId', 'admin']
  _resetPasswordRequiredFields = ['password', 'id']
  _listRequiredFields = ['x-profiles']
  _createRequiredFields = ['fullName', 'username', 'profileId', 'password']

  constructor(){
    super()
    this._userRepository = new UserRepository()
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

  async deleteUser(fields) {
    await this._checkRequiredFields(this._deleteUserRequiredFields, fields)
    const user = await this._userRepository.getOne(fields)
    await this._checkEntityExsits(user)
    return await this._userRepository.delete(fields)
  }

  async getUser(fields) {
    await this._checkRequiredFields(this._getUserRequiredFields, fields)
    const user = await this._userRepository.getOne(fields)
    await this._checkEntityExsits(user)
    return user
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
    const { id, password } = fields
    const user = await this._userRepository.getOne({id: id})
    await this._checkEntityExsits(user, "id")
    await this._checkSameOldPassword(user, password)
    const passwordHash = await user.generatePasswordHash(password)
    return await this._userRepository.changePassword(user, passwordHash)
  }

}

module.exports = UserService