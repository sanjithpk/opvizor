import styles from "./ManagerReportPage.module.scss"
import { PaletteType, Paper, withTheme } from "@material-ui/core"
import { ThemedComponentProps } from "@material-ui/core/styles/withTheme"
import { useCallback, useState, useEffect } from "react"
import { Operation } from "../../models/operation.model"
import { Employee } from "../../models/employee.model"
import { axios } from "../../utils/axios"
import { colors } from "../../utils/theme"
import OperationStatusChart from "../../components/charts/operation-status.chart"
import EmployeeOperationCountChart from "../../components/charts/employee-operation-count.chart"
import TagWiseOperationCountChart from "../../components/charts/tag-wise-operation-count.chart"
import Loader from "../../components/loader/Loader"
import { statusCodes } from "../../utils/statusCodes"

const ManagerReportPage: React.FC<ThemedComponentProps> = ({ theme }) => {
  const type = theme?.palette.type as PaletteType
  const makeTransparent = (color: string): string => {
    // coerce values so ti is between 0 and 1.
    var opacity = 0.6
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255)
    return color + _opacity.toString(16).toUpperCase()
  }

  const [isLoading, setIsLoading] = useState(true)
  const [allEmployeeList, setAllEmployeeList] = useState<Employee[]>([])
  const [allOperationList, setAllOperationList] = useState<Operation[]>([])
  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get("/employee")
      setAllEmployeeList(data.data as Employee[])
      try {
        const { data } = await axios.get("/operation")
        setAllOperationList(data.data as Operation[])
        setIsLoading(false)
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }, [])
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
  }, [fetchData])
  useEffect(() => {
    operationStatusOverview()
    employeeOperationCountReport()
    tagsOperationCountReport()
    // eslint-disable-next-line
  }, [allOperationList])

  const [operationStatusData, setOperationStatusData] = useState<Object>()
  const operationStatusOverview = () => {
    const label: string[] = [
      "Todo",
      "Recently Completed",
      "In Progress",
      "Due Date Passed"
    ]
    const colorArray: string[] = [
      statusCodes.todo.color,
      statusCodes.done.color,
      statusCodes.inProgress.color,
      statusCodes.dueDatePassed.color
    ]
    const data: number[] = [0, 0, 0, 0]
    allOperationList.forEach(operation => {
      if (operation.inProgress) data[2]++
      else if (operation.isCompletedOnce) data[1]++
      else if (operation.isFailed) data[3]++
      else data[0]++
    })
    setOperationStatusData({
      labels: label,
      datasets: [
        {
          data: data,
          backgroundColor: colorArray,
          borderColor: colorArray,
          borderWidth: 2
        }
      ]
    })
  }

  const [employeeOperationCountData, setEmployeeOperationCountData] =
    useState<Object>()
  const employeeOperationCountReport = () => {
    const data: number[] = []
    const label: string[] = []
    allEmployeeList.forEach(employee => {
      label.push(employee.name)
      data.push(0)
    })
    allOperationList.forEach(operation => {
      var assigneeIndex: number = label.indexOf(operation.assignee.name)
      if (assigneeIndex === -1) {
        label.push(operation.assignee.name)
        data.push(1)
      } else {
        data[assigneeIndex] += 1
      }
    })
    setEmployeeOperationCountData({
      labels: label,
      datasets: [
        {
          data: data,
          fill: true,
          borderColor: colors.primary[type],
          backgroundColor: makeTransparent(colors.primary[type]),
          tension: 0,
          borderWidth: 2
        }
      ]
    })
  }

  const [tagsOperationCountData, setTagsOperationCountData] = useState<Object>()
  const tagsOperationCountReport = () => {
    const data: number[] = []
    const label: string[] = []
    allOperationList.forEach(operation => {
      var tagIndex: number = label.indexOf(operation.tags.toLowerCase())
      if (tagIndex === -1) {
        label.push(operation.tags.toLowerCase())
        data.push(1)
      } else {
        data[tagIndex] += 1
      }
    })
    const colorArray = [
      colors.red,
      colors.green,
      colors.yellow,
      colors.purple,
      colors.teal,
      colors.orange,
      colors.blue
    ]
    setTagsOperationCountData({
      labels: label,
      datasets: [
        {
          data: data,
          fill: true,
          borderColor: colorArray,
          backgroundColor: colorArray.map(color => makeTransparent(color)),
          tension: 0,
          borderWidth: 2
        }
      ]
    })
  }

  return isLoading ? (
    <Loader />
  ) : (
    <div className={styles.main}>
      <div className={styles.horizontalLayout}>
        <Paper className={styles.card}>
          <h2>Operation Status Overview</h2>
          <OperationStatusChart data={operationStatusData} theme={type} />
        </Paper>
        <Paper className={styles.card}>
          <h2>Tag Wise Operation Count</h2>
          <TagWiseOperationCountChart
            data={tagsOperationCountData}
            theme={type}
          />
        </Paper>
      </div>
      <Paper className={styles.card}>
        <h2>Employee Operation Count</h2>
        <EmployeeOperationCountChart
          data={employeeOperationCountData}
          theme={type}
        />
      </Paper>
    </div>
  )
}

export default withTheme(ManagerReportPage)
