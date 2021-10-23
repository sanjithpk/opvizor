import Manager from "../models/user"
import bcrypt from "bcryptjs"
import { Request, Response, NextFunction } from "express"

export const register = (req: Request, res: Response, _next: NextFunction) => {
  const { email, password, role, tokenId } = req.body

  //checking user exist or not
  Manager.findOne({ email: email }).then(manager => {
    if (manager) res.status(400).json({ message: "Manager already exist" })
    else {
      const createdManager = new Manager({
        email: email,
        password: password,
        role: role,
        tokenId: tokenId
      })

      //Hash password
      bcrypt.genSalt(10, (_err, salt) =>
        bcrypt.hash(createdManager.password, salt, (_err, hash) => {
          //set password to hashed password
          createdManager.password = hash
          createdManager
            .save()
            .then((manager: any) => {
              req.login(manager, function (err) {
                if (err) {
                  console.log(err)
                }
                res.status(201).json({ message: "Success" })
              })
            })
            .catch(err => console.log(err))
        })
      )
    }
  })
}

export const isLogout = (req: Request, res: Response) => {
  req.logout()
  return res.status(200).json({ message: "Success" })
}

export const getNotification = (req: Request, res: Response) => {
  const emailId = req.params.email

  Manager.find({ email: emailId }, "-password")
    .then(result => {
      res.status(200).json({ data: result })
    })
    .catch(err => {
      console.log(err)
    })
}

export const updateIsRead = async (req: Request, res: Response) => {
  const emailId = req.params.email

  var updateIsRead = await Manager.find({ email: emailId })

  for (var i = 0; i < updateIsRead[0].get("notification").length; i++) {
    updateIsRead[0].get("notification")[i].isRead = true
  }

  var notification = updateIsRead[0].get("notification")

  const updatedNotification = await Manager.findOneAndUpdate(
    { email: emailId },
    { $set: { notification: notification } }
  )
  if (updatedNotification) {
    updatedNotification.save()
    res.status(200).json({ message: "Success" })
  } else {
    res.status(200).json({ message: "Manager Not found" })
  }
}
