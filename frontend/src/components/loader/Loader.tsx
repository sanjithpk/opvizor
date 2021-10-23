import styles from "./Loader.module.scss"
import HashLoader from "react-spinners/HashLoader"

const Loader: React.FC = () => {
  return (
    <div className={styles.container}>
      <HashLoader color="#209cee" />
    </div>
  )
}

export default Loader
