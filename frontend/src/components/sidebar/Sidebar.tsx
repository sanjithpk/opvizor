import styles from "./Sidebar.module.scss"
import { RouteComponentProps, withRouter } from "react-router"
import { Link } from "react-router-dom"
import { NavbarLink, NavbarLinks } from "../../utils/navbarLinks"
import CloseIcon from "@material-ui/icons/Close"
import { PaletteType } from "@material-ui/core"
import Brightness2Icon from "@material-ui/icons/Brightness2"
import WbSunnyIcon from "@material-ui/icons/WbSunny"

interface Props extends RouteComponentProps {
  theme: PaletteType
  setTheme: (theme: PaletteType) => void

  handleLogOut: () => Promise<void>
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void
}

const Sidebar: React.FC<Props> = props => {
  const { handleLogOut, theme, setTheme, toggleDrawer, location } = props

  let navbarLinks: NavbarLink[] = []
  if (location.pathname === "/") navbarLinks = []
  else if (location.pathname.startsWith("/manager"))
    navbarLinks = NavbarLinks.manager
  else if (location.pathname.startsWith("/employee"))
    navbarLinks = NavbarLinks.employee
  else navbarLinks = NavbarLinks.home

  return (
    <div className={theme}>
      <nav className={styles.sidebar}>
        <ul>
          <div className={styles.menu}>
            <h2>Menu</h2>
            <button onClick={toggleDrawer(false)}>
              <CloseIcon />
            </button>
          </div>
          {navbarLinks.map((link, i) =>
            link.path === location.pathname ? (
              <li key={i} onClick={toggleDrawer(false)}>
                <Link to={link.path}>
                  <p className={styles.activeLink}>{link.name.toUpperCase()}</p>
                </Link>
              </li>
            ) : (
              <li key={i} onClick={toggleDrawer(false)}>
                <Link to={link.path}>{link.name.toUpperCase()}</Link>
              </li>
            )
          )}
          {location.pathname === "/" ? (
            <>
              <li onClick={toggleDrawer(false)}>
                <Link className="log" to="/login">
                  Login
                </Link>
              </li>
              <li onClick={toggleDrawer(false)}>
                <Link className="register" to="/register">
                  Register
                </Link>
              </li>
            </>
          ) : location.pathname === "/login" ? (
            <li onClick={toggleDrawer(false)}>
              <Link className="log" to="/register">
                Register
              </Link>
            </li>
          ) : location.pathname === "/register" ? (
            <li onClick={toggleDrawer(false)}>
              <Link className="log" to="/login">
                Login
              </Link>
            </li>
          ) : (
            <li onClick={toggleDrawer(false)}>
              <Link onClick={handleLogOut} className="log" to="/">
                Logout
              </Link>
            </li>
          )}
          <li className={styles.theme}>
            {theme === "light" ? (
              <button onClick={() => setTheme("dark")}>
                <Brightness2Icon />
              </button>
            ) : (
              <button onClick={() => setTheme("light")}>
                <WbSunnyIcon />
              </button>
            )}
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default withRouter(Sidebar)
