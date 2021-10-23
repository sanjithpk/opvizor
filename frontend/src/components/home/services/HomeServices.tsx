import styles from "./HomeServices.module.scss"
import rocket from "../../../assets/icons/rocket.svg"
import testimony from "../../../assets/icons/testimony.svg"
import promotion from "../../../assets/icons/promotion.svg"
import coins from "../../../assets/icons/coins.svg"
import support from "../../../assets/icons/support.svg"
import laptop from "../../../assets/icons/laptop.svg"

const HomeServices: React.FC = () => {
  return (
    <section className={styles.services}>
      <h2>Why Choose Opvizor</h2>
      <div className={styles.servicesContainer}>
        <div className={styles.serviceContainer}>
          <div className={styles.service}>
            <img src={rocket} alt="service" />
            <h3>Very Fast</h3>
            <p>Blazingly fast website will make your operability seamless.</p>
          </div>
        </div>
        <div className={styles.serviceContainer}>
          <div className={styles.service}>
            <img src={testimony} alt="service" />
            <h3>Happy Customers</h3>
            <p>All the tasks completed on time means happy customers.</p>
          </div>
        </div>
        <div className={styles.serviceContainer}>
          <div className={styles.service}>
            <img src={promotion} alt="service" />
            <h3>Rich Notifications</h3>
            <p>Useful push notifications sent to you and your employees.</p>
          </div>
        </div>
        <div className={styles.serviceContainer}>
          <div className={styles.service}>
            <img src={coins} alt="service" />
            <h3>Save Money</h3>
            <p>
              Saving time and effort means focussing on other important things.
            </p>
          </div>
        </div>
        <div className={styles.serviceContainer}>
          <div className={styles.service}>
            <img src={support} alt="service" />
            <h3>24/7 Support</h3>
            <p>
              Our dedicated team will provide you with all the support you need.
            </p>
          </div>
        </div>
        <div className={styles.serviceContainer}>
          <div className={styles.service}>
            <img src={laptop} alt="service" />
            <h3>Full Features</h3>
            <p>All the tracking features you need in one place.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeServices
