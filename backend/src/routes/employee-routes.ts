import express, { Request, Response } from "express"
import Authentication from "../config/auth"

import {
  createEmployee,
  getEmployees,
  updateIsRead,
  loginIn,
  getEmployeeByEmployeeEmailId,
  deleteEmployee,
  updateEmployee,
  isLogout
} from "../controllers/employee-controllers"

const router = express.Router()

router.get("/success", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Success" })
})

router.get("/failure", (_req: Request, res: Response) => {
  res.status(401).json({ message: "Failure" })
})

router.get(
  "/logout",
  Authentication.ensureAuthenticated,
  Authentication.isEmployee,
  isLogout
) //logout

router.post(
  "/register",
  Authentication.ensureAuthenticated,
  Authentication.isManager,
  createEmployee
) // Create an employee

router.post("/login", loginIn) // login details

router.get(
  "/",
  Authentication.ensureAuthenticated,
  Authentication.isManager,
  getEmployees
) // Get all employees

router.get(
  "/:email",
  Authentication.ensureAuthenticated,
  getEmployeeByEmployeeEmailId
) // Get employee using email

router.patch(
  "/:email",
  Authentication.ensureAuthenticated,
  Authentication.isManager,
  updateEmployee
) // Update a specific employee using email

router.delete(
  "/:email",
  Authentication.ensureAuthenticated,
  Authentication.isManager,
  deleteEmployee
) // Delete a specific employee

router.patch(
  "/notification/:email",
  Authentication.ensureAuthenticated,
  updateIsRead
) //Mark all isRead true

export default router
