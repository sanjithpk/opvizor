import styles from "./OperationView.module.scss"
import { useEffect, useState } from "react"
import { axios } from "../../utils/axios"
import { Operation } from "../../models/operation.model"
import { RouteComponentProps, useHistory } from "react-router"
import Loader from "../loader/Loader"
import CloseIcon from "@material-ui/icons/Close"
import CalendarTodayIcon from "@material-ui/icons/CalendarToday"
import ScheduleIcon from "@material-ui/icons/Schedule"
import LoopIcon from "@material-ui/icons/Loop"
import PersonIcon from "@material-ui/icons/Person"
import EmailIcon from "@material-ui/icons/Email"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import { getFrequency } from "../../utils/frequency"
import { getTime, getDate } from "../../utils/date"
import Paper from "@material-ui/core/Paper"

interface MatchParams {
  role: string
  operationId: string
}

const OperationView: React.FC<RouteComponentProps<MatchParams>> = props => {
  const [name, setName] = useState("")
  const [tags, setTags] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [frequency, setFrequency] = useState("")
  const [subOperation, setSubOperation] = useState<string[]>([])
  const [assigneeName, setAssigneeName] = useState("")
  const [assigneeEmail, setAssigneeEmail] = useState("")

  const operationId = props.match.params.operationId
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(true)

  const setOperationData = (operation: Operation) => {
    setName(operation.operationName)
    setTags("#"+operation.tags)
    var date = new Date(operation.startTime)
    setStartDate(getDate(date))
    setStartTime(getTime(date))
    setFrequency(getFrequency(operation.frequency))
    var subOpArray: string[] = []
    operation.subOperations.forEach(subOp => subOpArray.push(subOp.name))
    setSubOperation(subOpArray)
    setAssigneeName(operation.assignee.name)
    setAssigneeEmail(operation.assignee.email)
  }

  const fetchOperation = async () => {
    try {
      const { data } = await axios.get(`/operation/${operationId}`)
      setOperationData(data.data as Operation)
      setIsLoading(false)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    fetchOperation()
    // eslint-disable-next-line
  }, [])

  const deleteOperationHandler = async () => {
    setIsLoading(true)
    try {
      await axios.delete("/operation/" + operationId)
      setIsLoading(false)
      history.goBack()
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  return isLoading ? (
    <Loader />
  ) : (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{name}</h1>
        <div>
          {props.match.params.role === "manager" ? (
            <button
              className={styles.edit}
              onClick={() =>
                (window.location.href =
                  "/manager/operations/edit/" + operationId)
              }
            >
              <EditIcon />
            </button>
          ) : null}
          {props.match.params.role === "manager" ? (
            <button className={styles.delete} onClick={deleteOperationHandler}>
              <DeleteIcon />
            </button>
          ) : null}
          <button className={styles.close} onClick={() => history.goBack()}>
            <CloseIcon />
          </button>
        </div>
      </div>
      <Paper className={styles.body}>
        <div className={`${styles.dual}`}>
          <div>
            <h3>Tags</h3>
          </div>
          <div className={styles.centerWithIcon}>{tags}</div>
        </div>
        <div className={`${styles.marginTop}`}>
          <h3>Start Date & Time</h3>
        </div>
        <div className={`${styles.dual} ${styles.marginTopSmall}`}>
          <div className={styles.centerWithIcon}>
            <CalendarTodayIcon className={styles.icon} /> {startDate}
          </div>
          <div className={styles.centerWithIcon}>
            <ScheduleIcon className={styles.icon} /> {startTime}
          </div>
        </div>
        <div className={`${styles.dual} ${styles.marginTop}`}>
          <div>
            <h3>Frequency</h3>
          </div>
          <div className={styles.centerWithIcon}>
            <LoopIcon className={styles.icon} />
            {frequency}
          </div>
        </div>
        {subOperation.length === 0 ? null : (
          <div>
            <div className={`${styles.marginTop}`}>
              <h3>Sub Operations</h3>
            </div>
            <div
              className={`${styles.subOpContainer} ${styles.marginTopSmall}`}
            >
              {subOperation.map((subOp, idx) => (
                <div key={idx} className={styles.subOperation}>
                  {subOp}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`${styles.marginTop}`}>
          <h3>Assignee Details</h3>
        </div>
        <div className={`${styles.dual} ${styles.marginTopSmall}`}>
          <div className={styles.centerWithIcon}>
            <PersonIcon className={styles.icon} />
            {assigneeName}
          </div>
          <div className={styles.centerWithIcon}>
            <EmailIcon className={styles.icon} />
            {assigneeEmail}
          </div>
        </div>
      </Paper>
    </div>
  )
}

export default OperationView
