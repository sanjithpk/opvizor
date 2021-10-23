import styles from "./HomeBasic.module.scss"
import basic1 from "../../../assets/images/automation.svg"
import basic2 from "../../../assets/images/dashboard.svg"

const HomeBasic: React.FC = () => {
  return (
    <section className={styles.basic}>
      <div className={styles.basic1}>
        <div className={styles.basicDescription}>
          <h2>
            One Platform.
            <br /> Unlimited Automation.
          </h2>
          <p>
            Our operations management solution lets you create an operation just
            once. Create operations one by one or just import multiple
            operations at once, its seamless.
          </p>
        </div>
        <div className={styles.basicIllustration}>
          <img src={basic1} alt="illustration" />
        </div>
      </div>
      <div className={styles.basic2}>
        <div className={styles.basicDescription}>
          <h2>
            Your all-in-one dashboard <br />
            on cloud.
          </h2>
          <p>
            <span>✓</span>Track all of your operations in one place.
          </p>
          <p>
            <span>✓</span>Timely notifications to your employees.
          </p>
          <p>
            <span>✓</span>Useful reports and analytics to help understand your
            operations better
          </p>
        </div>
        <div className={styles.basicIllustration}>
          <img src={basic2} alt="illustration" />
        </div>
      </div>
    </section>
  )
}

export default HomeBasic
