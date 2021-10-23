import styles from "./Intro.module.scss"
import { Link } from "react-router-dom"
import IntroTeamwork from "../../../assets/images/header-teamwork.svg"

const HomeIntro: React.FC = () => {
  return (
    <section className={styles.intro}>
      <div className={styles.introDesc}>
        <h1>Operation Management System for Startups</h1>
        <h2>Take the first step towards your digital transformation</h2>
        <p>
          For Indian Startups, Opvizor is a minimal effort operation management
          system that enables you to keep track, analyze and manage all of your
          operations effortlessly.
        </p>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
      <div className={styles.introIllustration}>
        <img src={IntroTeamwork} alt="teamwork" />
      </div>
    </section>
  )
}

export default HomeIntro
