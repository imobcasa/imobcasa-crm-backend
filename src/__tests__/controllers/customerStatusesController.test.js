const { CustomerStatusesController } = require('../../controllers')
const Mocks = require('../helpers/Mocks')
const ModelsExpected = require('../helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()
const customerStatusesController = new CustomerStatusesController()

const Setup = require('../helpers/Setups')
const setupTests = new Setup()


describe("CUSTOMER STATUSES CONTROLLER Tests", () => {
  let customerStatus

  beforeAll(async () => {
    await setupTests.destroyCustomerStatuses()

    await setupTests.databaseSetup()
    customerStatus = await setupTests.generateCustomerStatus("Pendente de Documentação", 1, "DOC_PENDING")


  })

  afterAll(async () => {
    await setupTests.destroyCustomerStatuses()
  })


  describe("1 - LIST ALL tests", () => {
    it("1.1 - Should return 200", async () => {
      const req = mocks.mockReq()
      const res = mocks.mockRes()
      await customerStatusesController.listAll(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
        ...modelsExpected.customerSatatusesModel()
      })]))
    })
  })


})
