import { Request, Response, NextFunction } from "express"
import { UserDocument } from "../models/user"

const Authentication = {
  ensureAuthenticated: (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.status(401).json({ message: "unauthorized access" })
  },

  isManager: (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument
    if (user.role == "manager") {
      return next()
    }
    res.status(401).json({ message: "unauthorized access" })
  },

  isEmployee: (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument
    if (user.role == "employee") {
      return next()
    }
    res.status(40).json({ message: "unauthorized access" })
  }
}

export default Authentication
