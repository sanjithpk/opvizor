const request = require("supertest")
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
const user_1 = __importDefault(require("../../dist/models/user"))

const {
  getEmployees,
  getEmployeeByEmployeeEmailId,
  updateEmployee,
  deleteEmployee
} = require("../../dist/controllers/employee-controllers")

const mockRequest = (sessionData, body, params) => ({
  session: { data: sessionData },
  body,
  params
})

const mockResponse = () => {
  const res = { status: 200 }
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.text = jest.fn().mockReturnValue(res)
  return res
}

describe("Employee API", () => {
  test("get employee", () => {
    const req = mockRequest(
      {},
      { email: "demo4@emp.com" },
      { email: "demo4@emp.com" }
    )
    const res = mockResponse()
    const spy = jest.spyOn(user_1.default, "find").mockImplementation(() => {
      return Promise.resolve(true)
    })
    const output = getEmployees(req, res)
    expect(spy).toHaveBeenCalled()
  })

  test("get employee by email", () => {
    const req = mockRequest(
      {},
      { email: "demo4@emp.com" },
      { email: "demo4@emp.com" }
    )
    const res = mockResponse()
    const spy = jest.spyOn(user_1.default, "find").mockImplementation(() => {
      return Promise.resolve(true)
    })
    getEmployeeByEmployeeEmailId(req, res)
    expect(spy).toHaveBeenCalled()
  })

  test("update employee", () => {
    const req = mockRequest(
      {},
      { email: "demo4@emp.com" },
      { email: "demo4@emp.com" }
    )
    const res = mockResponse()
    const spy = jest
      .spyOn(user_1.default, "findOneAndUpdate")
      .mockImplementation(() => {
        return Promise.resolve(true)
      })
    updateEmployee(req, res)
    expect(spy).toHaveBeenCalled()
  })

  test("delete employee", () => {
    const req = mockRequest(
      {},
      { email: "demo4@emp.com" },
      { email: "demo4@emp.com" }
    )
    const res = mockResponse()
    const spy = jest
      .spyOn(user_1.default, "findOneAndDelete")
      .mockImplementation(() => {
        return Promise.resolve(true)
      })
    deleteEmployee(req, res)
    expect(spy).toHaveBeenCalled()
  })
})
