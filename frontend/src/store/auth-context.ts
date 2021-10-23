import { createContext } from "react"

export interface User {
  isLoggedIn: boolean
  email: string
  role: string
  token: string
}

interface Props {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
}

const AuthContext = createContext<Props>({
  user: {
    isLoggedIn: false,
    email: "",
    role: "",
    token: ""
  },
  setUser: () => {}
})

export default AuthContext
