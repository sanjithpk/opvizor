import passportLocal from "passport-local"
const LocalStrategy = passportLocal.Strategy
import bcrypt from "bcryptjs"
import User, { UserDocument } from "../models/user"
import passport from "passport"
// Load User model

passport.serializeUser((user: any, done: any) => {
  done(null, user.id)
})

passport.deserializeUser((id: string, done: any) => {
  User.findById(id, function (err: Error, user: UserDocument) {
    done(err, user)
  })
})

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    (email: string, password: string, done) => {
      // Match user
      console.log(email)
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
