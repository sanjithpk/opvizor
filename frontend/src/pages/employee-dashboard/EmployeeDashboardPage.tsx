import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import "./EmployeeDashboardPage.scss"
import { useCallback, useContext, useEffect, useState } from "react"
import TabPanel from "../../components/tab-panel/TabPanel"
import OperationCard from "../../components/operation-card/OperationCard"
import { axios } from "../../utils/axios"
import { Operation } from "../../models/operation.model"
import AuthContext from "../../store/auth-context"
import Loader from "../../components/loader/Loader"

const EmployeeDashboardPage: React.FC = () => {
  const a11yProps = (index: number) => ({
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`
  })

  const [value, setValue] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [operations, setOperations] = useState<Operation[]>([])
  const [todoOperations, setTodoOperations] = useState<Operation[]>([])
  const [inProgressOperations, setInProgressOperations] = useState<Operation[]>(
    []
  )
  const [completedOperations, setCompletedOperations] = useState<Operation[]>(
    []
  )
  const [dueDatePassedOperations, setDueDatePassedOperations] = useState<
    Operation[]
  >([])
  const { user } = useContext(AuthContext)

  const fetchOperations = useCallback(async () => {
    try {
      const { data } = await axios.get("/operation")
      const operations = data.data as Operation[]
      setIsLoading(false)

      let inProgressOperations: Operation[] = []
      let completedOperations: Operation[] = []
      let dueDatePassedOperations: Operation[] = []
      let todoOperations: Operation[] = []

      const employeeOperations = operations.filter(
        operation => operation.assignee.email === user.email
      )

      employeeOperations.forEach(operation => {
        if (operation.inProgress) inProgressOperations.push(operation)
        else if (operation.isCompletedOnce) completedOperations.push(operation)
        else if (operation.isFailed) dueDatePassedOperations.push(operation)
        else todoOperations.push(operation)
      })

      setInProgressOperations(inProgressOperations)
      setCompletedOperations(completedOperations)
      setDueDatePassedOperations(dueDatePassedOperations)
      setTodoOperations(todoOperations)

      setOperations(employeeOperations)
    } catch (error) {
      console.log(error)
    }
  }, [user.email])

  const addZero = (number: number) => {
    return number < 10 ? "0" + number : number
  }

  const getTime = (date: Date) => {
    date = new Date(date)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    if (hours > 12) return `${addZero(hours - 12)}:${addZero(minutes)} PM`
    return `${addZero(hours)}:${addZero(minutes)} AM`
  }

  const getDate = (date: Date) => {
    return new Date(date).toDateString().substring(4)
  }

  const getStatus = (operation: Operation) => {
    if (operation.inProgress) return "inProgress"
    if (operation.isCompletedOnce) return "done"
    if (operation.isFailed) return "dueDatePassed"
    return "todo"
  }

  const getProgress = (operation: Operation) => {
    let progress = 0
    operation.subOperations.forEach(subOperation => {
      if (subOperation.isComplete) progress++
    })
    return (progress / operation.subOperations.length) * 100
  }

  useEffect(() => {
    fetchOperations()
  }, [fetchOperations])

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  if (isLoading) return <Loader />

  return (
    <main className="employee-dashboard">
      <AppBar position="static" className="tab-appbar">
        <Tabs value={value} onChange={handleChange} aria-label="operation tabs">
          <Tab label="All Operations" {...a11yProps(0)} />
          <Tab label="Todo" {...a11yProps(1)} />
          <Tab label="Recently Completed" {...a11yProps(2)} />
          <Tab label="In Progress" {...a11yProps(3)} />
          <Tab label="Due Date Passed" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {operations.map((operation, idx) => (
          <OperationCard
            key={idx}
            id={operation._id}
            title={operation.operationName}
            assignee={operation.assignee}
            status={getStatus(operation)}
            progress={getProgress(operation)}
            time={getTime(new Date(operation.lastExpectedToBeDone))}
            date={getDate(new Date(operation.lastExpectedToBeDone))}
          />
        ))}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {todoOperations.map((operation, idx) => (
          <OperationCard
            key={idx}
            id={operation._id}
            title={operation.operationName}
            assignee={operation.assignee}
            status={getStatus(operation)}
            progress={getProgress(operation)}
            time={getTime(new Date(operation.lastExpectedToBeDone))}
            date={getDate(new Date(operation.lastExpectedToBeDone))}
          />
        ))}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {completedOperations.map((operation, idx) => (
          <OperationCard
            key={idx}
            id={operation._id}
            title={operation.operationName}
            assignee={operation.assignee}
            status={getStatus(operation)}
            progress={getProgress(operation)}
            time={getTime(new Date(operation.lastExpectedToBeDone))}
            date={getDate(new Date(operation.lastExpectedToBeDone))}
          />
        ))}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {inProgressOperations.map((operation, idx) => (
          <OperationCard
            key={idx}
            id={operation._id}
            title={operation.operationName}
            assignee={operation.assignee}
            status={getStatus(operation)}
            progress={getProgress(operation)}
            time={getTime(new Date(operation.lastExpectedToBeDone))}
            date={getDate(new Date(operation.lastExpectedToBeDone))}
          />
        ))}
      </TabPanel>
      <TabPanel value={value} index={4}>
        {dueDatePassedOperations.map((operation, idx) => (
          <OperationCard
            key={idx}
            id={operation._id}
            title={operation.operationName}
            assignee={operation.assignee}
            status={getStatus(operation)}
            progress={getProgress(operation)}
            time={getTime(new Date(operation.lastExpectedToBeDone))}
            date={getDate(new Date(operation.lastExpectedToBeDone))}
          />
        ))}
      </TabPanel>
    </main>
  )
}

export default EmployeeDashboardPage
