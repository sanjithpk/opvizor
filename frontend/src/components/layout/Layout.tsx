import styles from "./Layout.module.scss"
import Footer from "../footer/Footer"
import Navbar from "../navbar/Navbar"
import { ThemeProvider } from "@material-ui/styles"
import Theme from "../../utils/theme"
import { useEffect, useState } from "react"
import { PaletteType } from "@material-ui/core"

const Layout: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<PaletteType>("light")

  const setUserTheme = (theme: PaletteType) => {
    setTheme(theme)
    window.localStorage.setItem("theme", theme)
  }

  useEffect(() => {
    const theme = window.localStorage.getItem("theme")
    if (theme) {
      const userTheme = theme as PaletteType
      setTheme(userTheme)
    } else {
      window.localStorage.setItem("theme", "light")
    }
  }, [theme])

  return (
    <div className={`${theme} ${styles.main}`}>
      <ThemeProvider theme={Theme(theme)}>
        <Navbar theme={theme} setTheme={setUserTheme} />
        <div className={styles.children}>{children}</div>
        <Footer />
      </ThemeProvider>
    </div>
  )
}

export default Layout
