import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import "./ManagerDashboardPage.scss"
import { useCallback, useContext, useEffect, useState } from "react"
import TabPanel from "../../components/tab-panel/TabPanel"
import OperationCard from "../../components/operation-card/OperationCard"
import { axios } from "../../utils/axios"
import { Operation } from "../../models/operation.model"
import Loader from "../../components/loader/Loader"
import AuthContext from "../../store/auth-context"
import { getDate, getTime } from "../../utils/date"

const ManagerDashboardPage: React.FC = () => {
  const a11yProps = (index: number) => ({
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`
  })

  const [isLoading, setIsLoading] = useState(true)
  const [value, setValue] = useState(0)
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

  const { user, setUser } = useContext(AuthContext)

  const fetchOperations = useCallback(async () => {
    try {
      const { data } = await axios.get("/operation")
      const operations = data.data as Operation[]
      setIsLoading(false)

      let inProgressOperations: Operation[] = []
      let completedOperations: Operation[] = []
      let dueDatePassedOperations: Operation[] = []
      let todoOperations: Operation[] = []

      operations.forEach(operation => {
        if (operation.inProgress) inProgressOperations.push(operation)
        else if (operation.isCompletedOnce) completedOperations.push(operation)
        else if (operation.isFailed) dueDatePassedOperations.push(operation)
        else todoOperations.push(operation)
      })
      setInProgressOperations(inProgressOperations)
      setCompletedOperations(completedOperations)
      setDueDatePassedOperations(dueDatePassedOperations)
      setTodoOperations(todoOperations)

      setOperations(operations)
    } catch (error) {
      setUser({
        ...user,
        isLoggedIn: false,
        email: "",
        role: ""
      })
    }
  }, [user, setUser])

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
    <main className="manager-dashboard">
      <AppBar position="static" className="tab-appbar">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="operation tabs"
        >
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

export default ManagerDashboardPage
