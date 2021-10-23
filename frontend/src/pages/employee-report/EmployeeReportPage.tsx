import styles from "./EmployeeReportPage.module.scss"
import { PaletteType, Paper, withTheme } from "@material-ui/core"
import { ThemedComponentProps } from "@material-ui/core/styles/withTheme"
import OperationStatusChart from "../../components/charts/operation-status.chart"
import { statusCodes } from "../../utils/statusCodes"
import { axios } from "../../utils/axios"
import { useCallback, useState, useEffect, useContext } from "react"
import Loader from "../../components/loader/Loader"
import { Operation } from "../../models/operation.model"
import AuthContext from "../../store/auth-context"
import TagWiseOperationCountChart from "../../components/charts/tag-wise-operation-count.chart"
import { colors } from "../../utils/theme"

const EmployeeReportPage: React.FC<ThemedComponentProps> = ({ theme }) => {
  const type = theme?.palette.type as PaletteType
  const makeTransparent = (color: string): string => {
    // coerce values so ti is between 0 and 1.
    var opacity = 0.6
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255)
    return color + _opacity.toString(16).toUpperCase()
  }
  const { user } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true)
  const [operationList, setOperationList] = useState<Operation[]>([])

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get("/operation")
      setOperationList(
        (data.data as Operation[]).filter(
          operation => operation.assignee.email === user.email
        )
      )
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
  }, [fetchData])

  useEffect(() => {
    operationStatusOverview()
    tagsOperationCountReport()
    // eslint-disable-next-line
  }, [operationList])

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
    operationList.forEach(operation => {
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
          borderWidth: 1
        }
      ]
    })
  }

  const [tagsOperationCountData, setTagsOperationCountData] = useState<Object>()
  const tagsOperationCountReport = () => {
    const data: number[] = []
    const label: string[] = []
    operationList.forEach(operation => {
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
  )
}

export default withTheme(EmployeeReportPage)
