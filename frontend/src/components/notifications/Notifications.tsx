import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react"
import styles from "./Notifications.module.scss"
import NotificationsIcon from "@material-ui/icons/Notifications"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import Badge from "@material-ui/core/Badge"
import Popper from "@material-ui/core/Popper"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import Paper from "@material-ui/core/Paper"
import Grow from "@material-ui/core/Grow"
import Divider from "@material-ui/core/Divider"
import { axios } from "../../utils/axios"
import AuthContext from "../../store/auth-context"
import { Notification, NotificationsObject } from "../../models/employee.model"
import { Link } from "react-router-dom"
import { getDateFromTimeStamp } from "../../utils/date"
import AssignmentIcon from "@material-ui/icons/Assignment"
import { messaging } from "../../services/firebase"

const Notifications: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const anchorRef = useRef(null)
  const { user } = useContext(AuthContext)
  const [notifications, setNotifications] = useState<Notification[]>()

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
    setTooltipOpen(false)
  }

  const fetchEmployee = useCallback(async () => {
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
  }, [user.email])

  useEffect(() => {
    fetchEmployee()
    messaging.onMessage(payload => {
      // do somthing
    })
  }, [fetchEmployee])

  return (
    <>
      <Tooltip
        title="Toggle Notifications Panel"
        open={tooltipOpen}
        onOpen={() => {
          setTooltipOpen(!open)
        }}
        onClose={() => {
          setTooltipOpen(false)
        }}
        enterDelay={300}
      >
        <IconButton
          color="primary"
          style={{ padding: "0.3rem" }}
          ref={anchorRef}
          onClick={handleToggle}
        >
          <Badge
            color="secondary"
            badgeContent={
              notifications
                ? notifications.reduce(
                    (count, message) => (!message.isRead ? count + 1 : count),
                    0
                  )
                : 0
            }
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popper
        id="notifications-popup"
        anchorEl={anchorRef.current}
        open={open}
        placement="bottom-end"
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <ClickAwayListener
            onClickAway={() => {
              setOpen(false)
            }}
          >
            <Grow in={open} {...TransitionProps}>
              <Paper className={styles.paper}>
                <ul>
                  <div className={styles.heading}>
                    <h4>Notifications</h4>
                  </div>
                  <Divider />
                  {notifications?.length ? (
                    notifications
                      .filter(notification => !notification.isRead)
                      .map((notification, index) => (
                        <React.Fragment key={index}>
                          <li>
                            <button
                              className={styles.button}
                              onClick={() => setOpen(false)}
                            >
                              <Link
                                to={`/${user.role}/operation/detail/${notification.operationId}`}
                              >
                                <div className={styles.assignmentIcon}>
                                  <AssignmentIcon />
                                </div>
                                <div className={styles.assignmentDesc}>
                                  <h5>A new operation was assigned to you</h5>
                                  <p>
                                    {getDateFromTimeStamp(
                                      notification.timeStamp
                                    )}
                                  </p>
                                </div>
                              </Link>
                            </button>
                          </li>
                          {index < notifications.length - 1 ? (
                            <Divider />
                          ) : null}
                          {index === notifications.length - 1 ? (
                            <>
                              <Divider />
                              <Link
                                onClick={() => setOpen(false)}
                                className={styles.bottom}
                                to={`/${user.role}/notifications`}
                              >
                                <h6>Show All Notifications</h6>
                              </Link>
                            </>
                          ) : null}
                        </React.Fragment>
                      ))
                  ) : (
                    <li className={styles.noNew}>No New Notifications</li>
                  )}
                </ul>
              </Paper>
            </Grow>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  )
}

export default Notifications
