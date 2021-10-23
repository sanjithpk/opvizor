import express from "express"
import passport from "passport"
import Manager from "../models/user"

import {
  register,
  isLogout,
  updateIsRead,
  getNotification
} from "../controllers/manager-controllers"

import Authentication from "../config/auth"

const router = express.Router()

router.get("/success", (_req, res) => {
  res.status(200).json({ message: "Success" })
})

router.get("/failure", (_req, res) => {
  res.status(401).json({ message: "Failure" })
})

router.post("/register", register)

router.post("/login", async (req, res, next) => {
  const { email, tokenId, role } = req.body

  if (role == "manager") {
    const updatedManager = await Manager.findOneAndUpdate(
      { email: email },
      {
        $set: {
          tokenId: tokenId
        }
      }
    )
    if (updatedManager) {
      updatedManager.save()
    }
    passport.authenticate("local", {
      successRedirect: "/manager/success",
      failureRedirect: "/manager/failure"
    })(req, res, next)
  } else res.status(401).json({ message: "Unauthorized Access" })
})

router.get(
  "/notification/:email",
  Authentication.ensureAuthenticated,
  Authentication.isManager,
  getNotification
)

router.patch(
  "/notification/:email",
  Authentication.ensureAuthenticated,
  Authentication.isManager,
  updateIsRead
)

router.get(
  "/logout",
  Authentication.ensureAuthenticated,
  Authentication.isManager,
  isLogout
)

export default router
