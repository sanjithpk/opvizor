import styles from "./HomePricing.module.scss"

const HomePricing: React.FC = () => {
  return (
    <section className={styles.pricing}>
      <div className={styles.pricingContainer}>
        <h2>Flexible Pricing</h2>
        <p>
          We've prepared pricing plans for all budgets so you can get started
          right away.
        </p>
        <p>They're great for small companies and large organizations</p>
        <div className={styles.pricingCardContainer}>
          <div className={styles.pricingCard}>
            <div className={styles.pricingInfo1}>
              <h4>Free Forever</h4>
              <p>
                Start with the forever free to take a first steps towards
                digitation to streamline your startup operations
              </p>
            </div>
            <div className={styles.pricingFeatures}>
              <p>
                <span>✓</span>Push Notification
              </p>
              <p>
                <span>✓</span>Unlimited Bandwith
              </p>
              <p>
                <span>✓</span>Realtime Database
              </p>
              <p>
                <span>✓</span>User And Admin Rights Control
              </p>
              <p>
                <span>✓</span> Collected Data Management
              </p>
            </div>
          </div>
          <div className={styles.pricingCard}>
            <div className={styles.pricingInfo2}>
              <h4>Advanced Plan</h4>
              <p>
                Switch to premium version to move to advanced business workflows
                which will help you to work less
              </p>
            </div>
            <div className={styles.pricingFeatures}>
              <p>
                <span>✓</span>Everything included in Free Forever Plan
              </p>
              <p>
                <span>✓</span>More Planning And Evaluation
              </p>
              <p>
                <span>✓</span>Monthly Backup
              </p>
              <p>
                <span>✓</span>24/7 Support
              </p>
              <p>
                <span>✓</span>Upgrade at your wish, Once you are actually ready
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomePricing
