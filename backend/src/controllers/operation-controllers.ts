import Operation from "../models/operation" //importing operation schema
import { Request, Response, NextFunction } from "express"
import Employee from "../models/user" //importing user schema
import { random, floor } from "mathjs"

//added for the firebase part
import * as admin from "firebase-admin"
const serviceAccount = require("../../firebase.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

//Created operation and store data

export const createOperation = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (req.body.length) {
    for (var i = 0; i < req.body.length; i++) {
      const {
        operationName,
        lastExpectedToBeDone,
        startTime,
        frequency,
        assignee,
        inProgress,
        isCompletedOnce,
        isFailed,
        tags,
        subOperations
      } = req.body[i]

      const createdOperation = new Operation({
        operationName: operationName,
        lastExpectedToBeDone: lastExpectedToBeDone,
        startTime: startTime,
        frequency: frequency,
        assignee: assignee,
        inProgress: inProgress,
        isCompletedOnce: isCompletedOnce,
        isFailed: isFailed,
        tags: tags,
        subOperations: subOperations
      })
      createdOperation.save()

      //Added the notification in the database
      var notifications = {
        message: "Operation is created",
        timeStamp: startTime,
        isRead: false,
        operationId: createdOperation._id
      }
      const addedNotification = await Employee.findOneAndUpdate(
        { email: assignee.email },
        { $push: { notification: notifications } }
      )
      if (addedNotification) {
        addedNotification.save()
      }

      // Performing Push notification
      var token: any[] = new Array(1)
      const employeeDetails = await Employee.findOne({ email: assignee.email })

      token[0] = employeeDetails?.tokenId

      var message = {
        webpush: {
          notification: {
            title: "", // Your message title
            body: "Operation is alloted to you", // Your message body
            icon: "https://i.ibb.co/HXhzDdj/Tz7QGOP.png" // Your App icon, up to 512x512px, any color
          }
        },
        token: token[0]
      }
      
      message.webpush.notification.title = operationName;

      await admin
        .messaging()
        .send(message)
        .then(_response => {
          // Response is a message ID string.
          res.status(200).json({ message: "Successfully sent notifications!" })
          console.log("Successfully sent message")
        })
        .catch(error => {
          console.log("Error sending message:", error.errorInfo.message)
        })
    }
  } else {
    const {
      operationName,
      lastExpectedToBeDone,
      startTime,
      frequency,
      assignee,
      inProgress,
      isCompletedOnce,
      isFailed,
      tags,
      subOperations
    } = req.body

    const createdOperation = new Operation({
      operationName: operationName,
      lastExpectedToBeDone: lastExpectedToBeDone,
      startTime: startTime,
      frequency: frequency,
      assignee: assignee,
      inProgress: inProgress,
      isCompletedOnce: isCompletedOnce,
      isFailed: isFailed,
      tags: tags,
      subOperations: subOperations
    })

    createdOperation.save()

    //Added the notification in the database
    var notifications = {
      message: "Operation is created",
      timeStamp: startTime,
      isRead: false,
      operationId: createdOperation._id
    }
    const addedNotification = await Employee.findOneAndUpdate(
      { email: assignee.email },
      { $push: { notification: notifications } }
    )
    if (addedNotification) {
      addedNotification.save()
    }

    // Performing Push notification
    var token: any[] = new Array(1)
    const employeeDetails = await Employee.findOne({ email: assignee.email })

    token[0] = employeeDetails?.tokenId

    var message = {
      webpush: {
        notification: {
          title: "", // Your message title
          body: "Operation is alloted to you", // Your message body
          icon: "https://i.ibb.co/HXhzDdj/Tz7QGOP.png" // Your App icon, up to 512x512px, any color
        }
      },
      token: token[0]
    }
    
    message.webpush.notification.title = operationName;

    await admin
      .messaging()
      .send(message)
      .then(_response => {
        // Response is a message ID string.
        res.status(200).json({ message: "Successfully sent notifications!" })
        console.log("Successfully sent message")
      })
      .catch(error => {
        console.log("Error sending message:", error.errorInfo.message)
      })
  }
}

//fetch all the operations
export const getOperation = (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  Operation.find()
    .then((result: any) => {
      res.status(200).json({ data: result })
    })
    .catch((err: any) => {
      console.log(err)
    })
}

//fetch operation by Id
export const getOperationById = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const operationId = req.params.id
  Operation.findById(operationId)
    .then((result: any) => {
      res.status(200).json({ data: result })
    })
    .catch((err: any) => {
      console.log(err)
    })
}

// update operation

export const updateOperation = async (req: Request, res: Response) => {
  const {
    operationName,
    lastExpectedToBeDone,
    startTime,
    frequency,
    assignee,
    inProgress,
    isCompletedOnce,
    isFailed,
    tags,
    subOperations
  } = req.body
  const id = req.params.id

  var notification = {
    message: "Operation is Updated",
    timeStamp: startTime,
    isRead: false,
    operationId: id
  }

  Operation.updateOne(
    { _id: id },
    {
      $set: {
        operationName: operationName,
        lastExpectedToBeDone: lastExpectedToBeDone,
        startTime: startTime,
        frequency: frequency,
        assignee: assignee,
        inProgress: inProgress,
        isCompletedOnce: isCompletedOnce,
        isFailed: isFailed,
        tags: tags,
        subOperations: subOperations
      }
    }
  )
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err)
    })

  //Added the notification in the database
  const updatedNotification = await Employee.findOneAndUpdate(
    { email: assignee.email },
    { $push: { notification: notification } }
  )
  if (updatedNotification) {
    updatedNotification.save()
  }

  // Performing Push notification
  var token: any[] = new Array(1)
  const employeeDetails = await Employee.findOne({ email: assignee.email })
  token[0] = employeeDetails?.tokenId

  var message = {
    webpush: {
      notification: {
        title: "", // Your message title
        body: "Operation is alloted to you", // Your message body
        icon: "https://i.ibb.co/HXhzDdj/Tz7QGOP.png" // Your App icon, up to 512x512px, any color
      }
    },
    token: token[0]
  }
  
  message.webpush.notification.title = operationName;

  await admin
    .messaging()
    .send(message)
    .then(_response => {
      // Response is a message ID string.
      res.status(200).json({ message: "Successfully sent notifications!" })
      console.log("Successfully sent message")
    })
    .catch(error => {
      console.log("Error sending message:", error.errorInfo.message)
    })
}

export const deleteOperation = async (req: Request, res: Response) => {
  const id = req.params.id
  const operation = await Operation.findByIdAndDelete(id)
  if (operation) res.status(200).json({ message: "Success" })
  else res.status(400).json({ message: "Operation Not Found" })
}

//update the sub operation array
export const updateSubOperation = async (req: Request, res: Response) => {
  const { subOperations } = req.body
  const id = req.params.id

  const updatedSubOperation = await Operation.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        subOperations: subOperations,
        inProgress: true
      }
    }
  )
  if (updatedSubOperation) {
    updatedSubOperation.save()
    res.status(200).json({ message: "Success" })
  } else {
    res.status(200).json({ message: "Employee Not found" })
  }
}

// Finish the whole operation
export const finishOperation = (req: Request, res: Response) => {
  const id = req.params.id

  Operation.findById(id)
    .then((result: any) => {
      const startTime = result.startTime
      const frequency = result.frequency
      const subOperations = result.subOperations
      const times = result.times
      const lastExpectedToBeDone = result.lastExpectedToBeDone

      const newTimes = times
      const newStartTime = startTime + frequency
      const newlastExpectedToBeDone = lastExpectedToBeDone + frequency
      newTimes.push({
        startTime: startTime,
        end: newStartTime,
        lastExpectedToBeDone: newStartTime,
        progressPercentage: 100
      })
      const newSubOperations = subOperations
      for (var i = 0; i < newSubOperations.length; i++) {
        newSubOperations[i].isComplete = false
      }

      Operation.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            startTime: newStartTime,
            subOperations: newSubOperations,
            lastExpectedToBeDone: newlastExpectedToBeDone,
            isCompletedOnce: true,
            isFailed: false,
            inProgress: false,
            times: newTimes
          }
        }
      )
        .then(_result => {
          res.status(200).json({ message: "Success" })
        })
        .catch(err => {
          console.log("error", err)
        })
    })
    .catch((err: any) => {
      console.log(err)
    })
}

export const updateTimes = (req: Request, res: Response) => {
  const id = req.params.id
  Operation.findById(id)
    .then((result: any) => {
      const times = result.times
      const startTime = result.startTime
      const frequency = result.frequency
      const newTimes = times
      newTimes.push({
        startTime: startTime + 2 * frequency,
        end: startTime + 3 * frequency,
        lastExpectedToBeDone: startTime + 3 * frequency,
        progressPercentage: 100
      })
      newTimes.push({
        startTime: startTime + 4 * frequency,
        end: startTime + 5 * frequency + 3600,
        lastExpectedToBeDone: startTime + 5 * frequency,
        progressPercentage: random() * 100
      })
      newTimes.push({
        startTime: startTime + 6 * frequency,
        end: startTime + 7 * frequency + 3600,
        lastExpectedToBeDone: startTime + 7 * frequency,
        progressPercentage: floor(random() * 100)
      })
      newTimes.push({
        startTime: startTime + 8 * frequency,
        end: startTime + 9 * frequency + 3600,
        lastExpectedToBeDone: startTime + 9 * frequency,
        progressPercentage: floor(random() * 100)
      })
      newTimes.push({
        startTime: startTime + 10 * frequency,
        end: startTime + 11 * frequency,
        lastExpectedToBeDone: startTime + 11 * frequency,
        progressPercentage: 100
      })
      const newStartTime = startTime + 11 * frequency
      Operation.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            startTime: newStartTime,
            times: newTimes
          }
        }
      )
        .then(_result => {
          res.status(200).json({ message: "Success" })
        })
        .catch(err => {
          console.log("error", err)
        })
    })
    .catch(err => {
      console.log("error", err)
    })
}
