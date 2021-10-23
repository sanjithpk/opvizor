import Paper from "@material-ui/core/Paper"
import { useContext, useEffect, useState } from "react"
import { Notification, NotificationsObject } from "../../models/employee.model"
import AuthContext from "../../store/auth-context"
import { axios } from "../../utils/axios"
import { getDateFromTimeStamp } from "../../utils/date"
import styles from "./NotificationsPage.module.scss"

const NotificationsPage: React.FC = () => {
  const { user } = useContext(AuthContext)
  const [notifications, setNotifications] = useState<Notification[]>()

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (user.email) {
          const { data } = await axios.get(`/employee/${user.email}`)
          const notificationsObject = data.data as NotificationsObject
          if (notificationsObject)
            setNotifications(notificationsObject.notification)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchNotifications()
  }, [user.email])

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Notifications</h1>
      <Paper className={styles.paper}>
        {notifications
          ? notifications.map((notification, index) => (
              <div className={styles.notification} key={index}>
                <p>{index + 1}</p>
                <h2 className={styles.message}>
                  You have been assigned to a new task
                </h2>
                <p className={styles.date}>
                  {getDateFromTimeStamp(notification.timeStamp)}
                </p>
              </div>
            ))
          : null}
      </Paper>
    </main>
  )
}

export default NotificationsPage
