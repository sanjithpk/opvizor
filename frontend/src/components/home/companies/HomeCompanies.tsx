import styles from "./HomeCompanies.module.scss"
import hashedin from "../../../assets/images/hashedin.png"
import deloitte from "../../../assets/images/deloitte.png"

const HomeCompanies: React.FC = () => {
  return (
    <section className={styles.companies}>
      <h2>Trusted By</h2>
      <div className={styles.companyContainer}>
        <img className={styles.hashedin} src={hashedin} alt="logo" />
        <img className={styles.deloitte} src={deloitte} alt="logo" />
      </div>
    </section>
  )
}

export default HomeCompanies
