import styles from "./RegisterPage.module.scss"
import { useContext, useState } from "react"
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
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert"
import { AxiosError } from "axios"

interface FormInputs {
  email: string
  password: string
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const RegisterPage: React.FC<RouteComponentProps> = ({ history }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>()
  const { user, setUser } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => event.preventDefault()

  const onSubmit = async (formInput: FormInputs) => {
    const registerDetails = {
      ...formInput,
      role: "manager",
      tokenId: user.token
    }

    try {
      const { data } = await axios.post("/manager/register", registerDetails)
      console.log(data)
      if (data.message === "Success") {
        const currentUser = {
          ...user,
          email: formInput.email,
          isLoggedIn: true,
          role: "manager"
        }
        setUser(currentUser)
        window.localStorage.setItem("user", JSON.stringify(currentUser))
        history.replace("/manager")
      }
    } catch (error) {
      const err = error as AxiosError
      setSnackbarMessage(err.response?.data.message)
      setSnackbarOpen(true)
    }
  }

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbarOpen(false)
  }
  return (
    <div className={styles.container}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Card className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Avatar alt="logo" src={logo} />
          </div>
          <h1>Register to Opvizor</h1>
        </div>
        <CardContent className={styles.content}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("email", { required: "* mandatory" })}
              className={styles.textInput}
              id="email"
              name="email"
              type="email"
              label="Email"
              variant="outlined"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <TextField
              {...register("password", { required: "* mandatory" })}
              className={styles.textInput}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
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
            <button
              className={`${styles.submit} ${styles.button}`}
              type="submit"
            >
              Register
            </button>
          </form>
        </CardContent>
        <div className={styles.footer}>
          <Link to="/login">Already a user? Login</Link>
        </div>
      </Card>
    </div>
  )
}

export default withRouter(RegisterPage)
