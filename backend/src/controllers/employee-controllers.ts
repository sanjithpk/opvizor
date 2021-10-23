import Employee from "../models/user"
import passport from "passport"
import Operation from "../models/operation"
import bcrypt from "bcryptjs"
import { Request, Response, NextFunction } from "express"

export const createEmployee = (req: Request, res: Response) => {
  //console.log(req.body)
  //console.log("length",req.body.length)
  if (req.body.length) {
    for (var i = 0; i < req.body.length; i++) {
      const { name, email, password, role, tokenId } = req.body[i]

      //checking user exist or not
      Employee.findOne({ email: email }).then(employee => {
        if (employee) res.status(400).json({ message: "Email already exist" })
        else {
          const createdEmployee = new Employee({
            name: name,
            email: email,
            password: password,
            role: role,
            tokenId: tokenId
          })

          //Hash password
          bcrypt.genSalt(10, (_err, salt) =>
            bcrypt.hash(createdEmployee.password, salt, (_err, hash) => {
              //set password to hashed password
              createdEmployee.password = hash
              createdEmployee
                .save()
                .then(_employee => {
                  res
                    .status(201)
                    .json({ message: "Success", employee: createdEmployee })
                })
                .catch(err => console.log(err))
            })
          )
        }
      })
    }
  } else {
    const { name, email, password, role, tokenId } = req.body

    //checking user exist or not
    Employee.findOne({ email: email }).then(employee => {
      if (employee) res.status(400).json({ message: "Email already exist" })
      else {
        const createdEmployee = new Employee({
          name: name,
          email: email,
          password: password,
          role: role,
          tokenId: tokenId
        })

        //Hash password
        bcrypt.genSalt(10, (_err, salt) =>
          bcrypt.hash(createdEmployee.password, salt, (_err, hash) => {
            //set password to hashed password
            createdEmployee.password = hash
            createdEmployee
              .save()
              .then(_employee => {
                res
                  .status(201)
                  .json({ message: "Success", employee: createdEmployee })
              })
              .catch(err => console.log(err))
          })
        )
      }
    })
  }
}

//Added the update token in login
export const loginIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, tokenId, role } = req.body

  if (role == "employee") {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { email: email },
      {
        $set: {
          tokenId: tokenId
        }
      }
    )
    if (updatedEmployee) {
      updatedEmployee.save()
    }
    passport.authenticate("local", {
      successRedirect: "/employee/success",
      failureRedirect: "/employee/failure"
    })(req, res, next)
  } else res.status(401).json({ message: "Unauthorized Access" })
}

export const getEmployees = (_req: Request, res: Response) => {
  Employee.find({ role: "employee" }, "-password")
    .then(result => {
      res.status(200).json({ data: result })
    })
    .catch(err => {
      console.log("error", err)
    })
}

export const getEmployeeByEmployeeEmailId = (req: Request, res: Response) => {
  const emailId = req.params.email
  Employee.findOne({ email: emailId }, "-password")
    .then(result => {
      res.status(200).json({ data: result })
    })
    .catch(err => {
      console.log(err)
    })
}

// update employee

export const updateEmployee = async (req: Request, res: Response) => {
  const { name } = req.body
  const emailId = req.params.email

  const updatedEmployee = await Employee.findOneAndUpdate(
    { email: emailId },
    { name: name }
  )
  if (updatedEmployee) {
    Operation.updateMany({"assignee.email": emailId}, {$set:{
      "assignee.name":name

    }}).then(_result =>{
      
  }).catch(err => {
      console.log(err);
  });

    updatedEmployee.save()
    res.status(200).json({ message: "Success" })
  } else {
    res.status(200).json({ message: "Employee Not found" })
  }
}

//delete employee
export const deleteEmployee = async (req: Request, res: Response) => {
  const emailId = req.params.email
  var check=0;
  Operation.find().then(result =>{
    for(var i=0;i<result.length;i++)
    {
      if(result[i].assignee.email === emailId)
      {
        check=1;
        break;
      } 
    }
    if(check == 0)
    {
      Employee.findOneAndDelete({ email: emailId })
      res.status(200).json({ message: 'Success' });

    }
    else
    {
      res.status(200).json({ message: 'Operation are alloted to this employee. Assign them to someone else or delete them.' });
    }
  }).catch(err => {
  console.log(err);
  });

}

export const isLogout = (req: Request, res: Response) => {
  req.logout()
  return res.status(200).json({ message: "Success" })
}

export const updateIsRead = async (req: Request, res: Response) => {
  const emailId = req.params.email

  var updateIsRead = await Employee.find({ email: emailId })

  for (var i = 0; i < updateIsRead[0].get("notification").length; i++) {
    updateIsRead[0].get("notification")[i].isRead = true
  }

  var notification = updateIsRead[0].get("notification")

  const updatedNotification = await Employee.findOneAndUpdate(
    { email: emailId },
    { $set: { notification: notification } }
  )
  if (updatedNotification) {
    updatedNotification.save()
    res.status(200).json({ message: "Success" })
  } else {
    res.status(200).json({ message: "Employee Not found" })
  }
}
