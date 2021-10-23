import "./Navbar.scss"
import logo from "../../assets/images/logo.png"
import { NavbarLinks, NavbarLink } from "../../utils/navbarLinks"
import { RouteComponentProps, withRouter } from "react-router"
import { Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import AuthContext from "../../store/auth-context"
import { axios } from "../../utils/axios"
import { PaletteType } from "@material-ui/core"
import Brightness2Icon from "@material-ui/icons/Brightness2"
import WbSunnyIcon from "@material-ui/icons/WbSunny"
import MenuIcon from "@material-ui/icons/Menu"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import Sidebar from "../sidebar/Sidebar"
import Notifications from "../notifications/Notifications"
import Tooltip from "@material-ui/core/Tooltip"

interface Props extends RouteComponentProps {
  theme: PaletteType
  setTheme: (theme: PaletteType) => void
}

const Navbar: React.FC<Props> = props => {
  const { theme, setTheme, location } = props
  const { user, setUser } = useContext(AuthContext)

  const handleLogOut = async () => {
    const currentUser = {
      ...user,
      isLoggedIn: false
    }
    setUser(currentUser)
    window.localStorage.setItem("user", JSON.stringify(currentUser))
    try {
      await axios.get(`/${user.role}/logout`)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const navbarDiv = document.getElementsByClassName(
      "navbar"
    )[0] as HTMLDivElement

    if (navbarDiv) {
      if (location.pathname === "/") navbarDiv.style.boxShadow = "none"
      else
        navbarDiv.style.boxShadow = "0 0.0625rem 0.375rem 0 rgba(0, 0, 0, 0.1)"
    }

    const listener = () => {
      const scrolled = document.scrollingElement?.scrollTop

      if (navbarDiv && location.pathname === "/") {
        if (scrolled && scrolled >= 30)
          navbarDiv.style.boxShadow =
            "0 0.0625rem 0.375rem 0 rgba(0, 0, 0, 0.1)"
        else if (scrolled) navbarDiv.style.boxShadow = "none"
      }
    }
    document.addEventListener("scroll", listener)

    return () => {
      document.removeEventListener("scroll", listener)
    }
  }, [location.pathname])

  let navbarLinks: NavbarLink[] = []
  if (location.pathname === "/") navbarLinks = []
  else if (location.pathname.startsWith("/manager"))
    navbarLinks = NavbarLinks.manager
  else if (location.pathname.startsWith("/employee"))
    navbarLinks = NavbarLinks.employee
  else navbarLinks = NavbarLinks.home

  const [open, setOpen] = useState(false)

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return
    }
    setOpen(open)
  }

  const renderNotificationButton = () => {
    if (
      location.pathname.startsWith("/manager") ||
      location.pathname.startsWith("/employee")
    )
      return (
        <li className="notifications">
          <Notifications />
        </li>
      )
  }

  const renderLoginRegisterButtons = () =>
    location.pathname === "/" ? (
      <>
        <li>
          <Link className="log" to="/login">
            Login
          </Link>
        </li>
        <li>
          <Link className="register" to="/register">
            Register
          </Link>
        </li>
      </>
    ) : location.pathname === "/login" ? (
      <li>
        <Link className="log" to="/register">
          Register
        </Link>
      </li>
    ) : location.pathname === "/register" ? (
      <li>
        <Link className="log" to="/login">
          Login
        </Link>
      </li>
    ) : (
      <li>
        <Link onClick={handleLogOut} className="log" to="/">
          Logout
        </Link>
      </li>
    )

  return (
    <div className="navbar">
      <div className="navbar-placing">
        <Link to="/">
          <div className="logo-container">
            <img className="logo" src={logo} alt="logo" />
          </div>
          <h1>Opvizor</h1>
        </Link>
        <nav className="navbar-nav">
          <ul>
            {navbarLinks.map((link, i) =>
              link.path === location.pathname ? (
                <li key={i}>
                  <Link to={link.path}>
                    <p className="activeLink">{link.name.toUpperCase()}</p>
                  </Link>
                </li>
              ) : (
                <li key={i}>
                  <Link to={link.path}>{link.name.toUpperCase()}</Link>
                </li>
              )
            )}
            {renderNotificationButton()}
            {renderLoginRegisterButtons()}
            <li>
              <Tooltip title="Toggle Theme">
                {theme === "light" ? (
                  <button className="button" onClick={() => setTheme("dark")}>
                    <Brightness2Icon />
                  </button>
                ) : (
                  <button className="button" onClick={() => setTheme("light")}>
                    <WbSunnyIcon />
                  </button>
                )}
              </Tooltip>
            </li>
          </ul>
        </nav>
        <button className="menu" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </button>
        <SwipeableDrawer
          anchor="right"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          <Sidebar
            toggleDrawer={toggleDrawer}
            theme={theme}
            setTheme={setTheme}
            handleLogOut={handleLogOut}
          />
        </SwipeableDrawer>
      </div>
    </div>
  )
}

export default withRouter(Navbar)
