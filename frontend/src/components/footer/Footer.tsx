import styles from "./Footer.module.scss"
import logo from "../../assets/images/logo.png"
import { Link } from "react-router-dom"
import FacebookIcon from "@material-ui/icons/Facebook"
import TwitterIcon from "@material-ui/icons/Twitter"
import LinkedInIcon from "@material-ui/icons/LinkedIn"

const Footer: React.FC = () => {
  return (
    <footer>
      <div className={styles.bottom}>
        <Link to="/">
          <img className="logo" src={logo} alt="logo" />
          <h2>Opvizor</h2>
        </Link>
        <p>© 2021 Opvizor Inc. All Rights Reserved.</p>
        <div className={styles.social}>
          <FacebookIcon />
          <TwitterIcon />
          <LinkedInIcon />
        </div>
      </div>
    </footer>
  )
}

export default Footer
