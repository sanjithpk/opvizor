var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
const operation_1 = __importDefault(require("../../dist/models/operation"))

const {
  updateSubOperation,
  finishOperation,
  deleteOperation,
  updateOperation,
  getOperationById,
  getOperation,
  createOperation
} = require("../../dist/controllers/operation-controllers")

const mockRequest = (sessionData, body, params) => ({
  session: { data: sessionData },
  body,
  params
})

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.text = jest.fn().mockReturnValue(res)
  return res
}

describe("Operation API", () => {
  test("get operation", () => {
    const req = mockRequest({}, {}, {})
    const res = mockResponse()
    const spy = jest
      .spyOn(operation_1.default, "find")
      .mockImplementation(() => {
        return Promise.resolve(true)
      })
    getOperation(req, res)
    expect(spy).toHaveBeenCalled()
  })

  test("get operation by Id", () => {
    const req = mockRequest({}, {}, { id: "6087aff171a3610784fbf2f0" })
    const res = mockResponse()
    const spy = jest
      .spyOn(operation_1.default, "findById")
      .mockImplementation(() => {
        return Promise.resolve(true)
      })
    getOperationById(req, res)
    expect(spy).toHaveBeenCalled()
  })

  test("update operation", () => {
    const req = mockRequest({}, {}, { id: "6087aff171a3610784fbf2f0" })
    const res = mockResponse()
    const spy = jest
      .spyOn(operation_1.default, "updateOne")
      .mockImplementation(() => {
        return Promise.resolve(true)
      })
    updateOperation(req, res)
    expect(spy).toHaveBeenCalled()
  })

  test("delete operation", () => {
    const req = mockRequest({}, {}, { id: "6087aff171a3610784fbf2f0" })
    const res = mockResponse()
    const spy = jest
      .spyOn(operation_1.default, "findByIdAndDelete")
      .mockImplementation(() => {
        return Promise.resolve(true)
      })
    deleteOperation(req, res)
    expect(spy).toHaveBeenCalled()
  })

  test("update sub operation", () => {
    const req = mockRequest({}, {}, { id: "6087aff171a3610784fbf2f0" })
    const res = mockResponse()
    const spy = jest
      .spyOn(operation_1.default, "findByIdAndUpdate")
      .mockImplementation(() => {
        return Promise.resolve(true)
      })
    updateSubOperation(req, res)
    expect(spy).toHaveBeenCalled()
  })

  test("finish operation", () => {
    const req = mockRequest({}, {}, { id: "6087aff171a3610784fbf2f0" })
    const res = mockResponse()
    const spy = jest
      .spyOn(operation_1.default, "findByIdAndUpdate")
      .mockImplementation(() => {
        return Promise.resolve(true)
      })
    finishOperation(req, res)
    expect(spy).toHaveBeenCalled()
  })
})
