import { Link } from "react-router-dom"
import styles from "./NotFoundPage.module.scss"
import NotFoundIllustration from "../../assets/images/not-found.svg"

const NotFoundPage: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* <h1>404</h1> */}
        <img src={NotFoundIllustration} alt="404" />
        <p>The page you were looking for was not found.</p>
        <Link to="/">Go back to home page</Link>
      </div>
    </section>
  )
}

export default NotFoundPage
