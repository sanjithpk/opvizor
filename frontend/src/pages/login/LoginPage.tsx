import styles from "./LoginPage.module.scss"
import { useContext, useEffect, useState } from "react"
import logo from "../../assets/images/logo.png"
import Card from "@material-ui/core/Card"
import Avatar from "@material-ui/core/Avatar"
import CardContent from "@material-ui/core/CardContent"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
import { Link, RouteComponentProps, withRouter } from "react-router-dom"
import { axios } from "../../utils/axios"
import AuthContext from "../../store/auth-context"
import { useForm } from "react-hook-form"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"

interface FormInputs {
  email: string
  password: string
}

const LoginPage: React.FC<RouteComponentProps> = ({ history }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>()

  const [role, setRole] = useState("manager")
  const { user, setUser } = useContext(AuthContext)
  const [loginError, setLoginError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  const roleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    let manager = document.getElementById("manager") as HTMLButtonElement
    let employee = document.getElementById("employee") as HTMLButtonElement
    const userRole = (e.target as HTMLButtonElement).innerText
    setRole(userRole.toLowerCase())
    if (userRole === "MANAGER") {
      manager.classList.add(styles.active)
      employee.classList.remove(styles.active)
    } else {
      employee.classList.add(styles.active)
      manager.classList.remove(styles.active)
    }
  }
  const onSubmit = async (formInput: FormInputs) => {
    const loginDetails = {
      ...formInput,
      role,
      tokenId: user.token
    }
    try {
      const { data } = await axios.post(`/${role}/login`, loginDetails)
      if (data.message === "Success") {
        const currentUser = {
          ...user,
          email: formInput.email,
          isLoggedIn: true,
          role
        }
        setUser(currentUser)
        window.localStorage.setItem("user", JSON.stringify(currentUser))
        history.replace(`/${role}`)
      }
    } catch (error) {
      setErrorMessage(error.message)
      setLoginError(true)
    }
  }

  useEffect(() => {
    if (user.isLoggedIn) {
      history.replace(`/${user.role}`)
    }
  }, [history, user])

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Avatar alt="logo" src={logo} />
          </div>
          <h1>Login to Opvizor</h1>
        </div>
        <CardContent className={styles.content}>
          {loginError ? (
            <div className={styles.alert}>
              <p>{errorMessage}</p>
            </div>
          ) : null}
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("email", { required: "* required" })}
              className={styles.textInput}
              id="email"
              name="email"
              type="email"
              label="Email *"
              variant="outlined"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <TextField
              {...register("password", { required: "* required" })}
              className={styles.textInput}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password *"
              variant="outlined"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <div className={styles.role}>
              <button
                id="manager"
                className={`${styles.button} ${styles.active}`}
                onClick={roleChange}
              >
                Manager
              </button>
              <button
                id="employee"
                className={styles.button}
                onClick={roleChange}
              >
                Employee
              </button>
            </div>
            <button
              className={`${styles.submit} ${styles.button}`}
              type="submit"
            >
              Login
            </button>
          </form>
        </CardContent>
        <div className={styles.footer}>
          <Link to="/register">Not a user? Register</Link>
        </div>
      </Card>
    </div>
  )
}

export default withRouter(LoginPage)
