const { ProfilesController } = require('../../controllers')
const Mocks = require('../helpers/Mocks')
const ModelsExpected = require('../helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()
const profilesController = new ProfilesController

const Setup = require('../helpers/Setups')
const setupTests = new Setup()


describe("PROFILES CONTROLLER Tests", () => {
  let profile


  beforeAll(async () => {
    await setupTests.destroyProfiles()

    await setupTests.databaseSetup()
    profile = await setupTests.generateProfile("Administrador", true, false)


  })

  afterAll(async () => {
    await setupTests.destroyProfiles()
  })


  describe("1 - LIST ALL tests", () => {
    it("1.1 - Should return 200", async () => {
      const req = mocks.mockReq()
      const res = mocks.mockRes()
      await profilesController.listAll(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
        ...modelsExpected.profilesModel()
      })]))
    })
  })


})
