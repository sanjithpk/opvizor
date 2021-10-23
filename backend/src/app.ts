import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import cors from "cors"
import nodemailer from "nodemailer"
const app = express()
import passport from "passport"
import session from "express-session"
import operationRoutes from "./routes/operation-routes"
import employeeRoutes from "./routes/employee-routes"
import managerRoutes from "./routes/manager-routes"
import passportLocal from "passport-local"
const LocalStrategy = passportLocal.Strategy
import bcrypt from "bcryptjs"
import cron from "node-cron"
import Operation from "./models/operation"
import previewEmail from 'preview-email'
import User, { UserDocument } from "./models/user"
import * as handlebars from 'handlebars'
import * as fs from 'fs'
import * as path from 'path'

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "https://opvizorfrontend-dot-hu18-groupa-angular.et.r.appspot.com",
      "https://lucid-pasteur-e8439a.netlify.app"
    ]
  })
)

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    (email: string, password: string, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: "Email is not registered" })
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: "Password incorrect" })
          }
        })
      })
    }
  )
)

passport.serializeUser((user: any, done: any) => {
  done(null, user.id)
})

passport.deserializeUser((id: string, done: any) => {
  User.findById(id, function (err: Error, user: UserDocument) {
    done(err, user)
  })
})

//Applying scheduler

cron.schedule("* 1 * * * ", () => {
  //console.log('running a task every hour'+new Date());
  Operation.find()
    .then((result: any) => {
      for (var i = 0; i < result.length; i++) {
        const curr = Date.now()
        if (
          result[i].inProgress == true &&
          curr - result[i].startTime > result[i].frequency
        ) {
          const { startTime, frequency, times } = result[i]
          const operationId = result[i]._id
          const StartTime = startTime + frequency
          const Times = times
          const InProgress = false
          var progress = 0
          var total = result[i].subOperations.length
          for (let j = 0; j < result[i].subOperations.length; j++) {
            if (result[i].subOperations[j].isComplete == true) {
              progress = progress + 1
            }
          }
          const newSubOperations = result[i].subOperations
          for (var j = 0; j < newSubOperations.length; j++) {
            newSubOperations[j].isComplete = false
          }

          progress = (progress / total) * 100

          Times.push({
            startTime: startTime,
            end: Date.now(),
            lastExpectedToBeDone: StartTime,
            progressPercentage: progress
          })
          Operation.updateOne(
            { _id: operationId },
            {
              $set: {
                startTime: StartTime,
                inProgress: InProgress,
                times: Times,
                subOperations: newSubOperations
              }
            }
          )
            .then(_result => {})
            .catch(err => {
              console.log(err)
            })
        }
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
})

//database connection
mongoose
  .connect(
    "mongodb+srv://Arnima:arnima123@cluster0.ea6oo.mongodb.net/Opvisor?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err))

// Express body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
)

app.use(cookieParser("secret"))

app.use(passport.initialize())
app.use(passport.session())

app.use("/employee", employeeRoutes) // => /employee
app.use("/manager", managerRoutes) // => /manager
app.use("/operation", operationRoutes)

app.get("/", (_req, res) => {
  res.send("Its working")
})

function sendEmail() {
  const filePath = path.join(__dirname, '../index.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const replacements = {
    username: "Umut YEREBAKMAZ"
  };
  const htmlToSend = template(replacements);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "opvizornotification@gmail.com",
      pass: "Opvizor123"
    },
    tls: {
      ciphers: "SSLv3"
    }
    
  });

  transporter.verify((error: any) => {
    if (error) {
      console.log(error)
    } else {
      console.log("Server is ready to take our messages!")
    }
  })

  const mailOptions = {
    from: "opvizornotification@gmail.com",
    to: "manager@manager.com",
    subject: "Monthly Report",
    html: htmlToSend
  };

  previewEmail(mailOptions).then(console.log).catch(console.error);
  
   transporter.sendMail(mailOptions);
}

sendEmail()

const PORT = 8080
//connecting to server
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
})
