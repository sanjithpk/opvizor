import express from "express"
const router = express.Router()

import {
  createOperation,
  getOperation,
  getOperationById,
  updateOperation,
  deleteOperation,
  updateSubOperation,
  finishOperation,
  updateTimes
} from "../controllers/operation-controllers"

import Authentication from "../config/auth"

//create operation
router.post(
  "/",
  Authentication.ensureAuthenticated,
  Authentication.isManager,
  createOperation
)

//get all operations
router.get("/", Authentication.ensureAuthenticated, getOperation)

//get operation by id
router.get("/:id", Authentication.ensureAuthenticated, getOperationById)

//update an operation
router.put(
  "/:id",
  Authentication.ensureAuthenticated,
  Authentication.isManager,
  updateOperation
)

//delete an operation
router.delete(
  "/:id",
  Authentication.ensureAuthenticated,
  Authentication.isManager,
  deleteOperation
)

//update suboperation in stepper
router.patch("/:id", Authentication.ensureAuthenticated, updateSubOperation)

//finish operation in stepper
router.patch("/finish/:id", Authentication.ensureAuthenticated, finishOperation)

router.patch("/update/:id", Authentication.ensureAuthenticated, updateTimes)

export default router
