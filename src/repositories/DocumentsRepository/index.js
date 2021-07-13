const { Documents } = require('../../models')


class DocumentsRepository {

  async create({
    name,
    url,
    statusId,
    size,
    key,
    customerId
  }) {
    return await Documents.create({
      name,
      url,
      statusId,
      size,
      key,
      customerId
    }, {
      include: ['customer', 'status', 'type']
    })
  }


  async listByCustomerId({ customerId }) {
    return await Documents.findAll({
      where: {
        customerId
      },
      include: [
        {
          association: "type",
          attributes: ["id", "key", "name", "providedByCustomer"]
        }, {
          association: "status",
          attributes: ["id", "name", "key", "order"]
        }
      ],
      attributes: ['id', 'name', 'typeId', 'statusId', 'size', 'customerId', 'createdAt', 'updatedAt'],
      
    })
  }

  async changeStatus({
    id,
    statusId
  }) {
    return await Documents.update({
      statusId
    }, {
      where: {
        id
      }
    })
  }

  async getOne({
    id
  }) {
    return await Documents.findOne({
      where: {
        id
      },
      include: ['status', 'customer', 'type']
    })
  }

  async updateFile({
    name,
    url,
    size,
    id
  }) {
    return await Documents.update({
      name,
      url,
      size
    }, {
      where: {
        id
      }
    })
  }

  async changeType({
    id,
    typeId
  }) {
    return Documents.update({ typeId }, {
      where: {
        id
      }
    })
  }

  async findByCustomerAndTypeId({
    customerId,
    typeId
  }){
    return await Documents.findOne({
      where: {
        customerId,
        typeId
      }
    })
  }


  async delete({ id }) {
    return await Documents.destroy({
      where: {
        id
      }
    })
  }

  async findAllByMultipleStatuses({ 
    ids = [],
    customerId
  }) {
    return await Documents.findAll({
      where: {
        statusId: ids,
        customerId
      }
    })
  }  

}

module.exports = DocumentsRepository
