import styles from "./OperationCard.module.scss"
import EventIcon from "@material-ui/icons/Event"
import ScheduleIcon from "@material-ui/icons/Schedule"
import { statusCodes } from "../../utils/statusCodes"
import { Link } from "react-router-dom"
import { useContext } from "react"
import AuthContext from "../../store/auth-context"
import { Assignee } from "../../models/operation.model"

interface Props {
  id: string
  title: string
  assignee: Assignee
  status: string
  time: string
  date: string
  progress: number
}

const OperationCard: React.FC<Props> = props => {
  const { id, title, assignee, status, date, time, progress } = props
  const { code, color } = statusCodes[status]
  const { user } = useContext(AuthContext)

  return (
    <div className={styles.card} style={{ borderLeft: `10px solid ${color}` }}>
      <Link to={`/${user.role}/operation/${id}`}>
        <h1>{title}</h1>
      </Link>
      <div className={styles.progress}>
        <span style={{ width: `${progress}%` }}></span>
      </div>
      <div className={styles.info}>
        <div className={styles.status}>
          <h2>Status</h2>
          <h3>{code}</h3>
        </div>
        <div className={styles.assignee}>
          <h2>Assignee</h2>
          <h3>{assignee.name}</h3>
        </div>
      </div>
      <div className={styles.calendar}>
        <div className={styles.time}>
          <ScheduleIcon />
          <span>{time}</span>
        </div>
        <div className={styles.date}>
          <EventIcon />
          <span>{date}</span>
        </div>
      </div>
    </div>
  )
}

export default OperationCard
