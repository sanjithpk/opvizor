import styles from "./OperationCrudPage.module.scss"
import React, { useState, useEffect, useCallback } from "react"
import OperationListItem from "../../components/operation-list-item/OperationListItem"
import TextField from "@material-ui/core/TextField"
import { Operation, SubOperations } from "../../models/operation.model"
import { Employee } from "../../models/employee.model"
import { axios } from "../../utils/axios"
import { RouteComponentProps } from "react-router"
import InputAdornment from "@material-ui/core/InputAdornment"
import SearchIcon from "@material-ui/icons/Search"
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import { FREQUENCY_LIST } from "../../utils/frequency"
import { withTheme } from "@material-ui/core/styles"
import { ThemedComponentProps } from "@material-ui/core/styles/withTheme"
import Loader from "../../components/loader/Loader"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert, { Color, AlertProps } from "@material-ui/lab/Alert"
import { getTime } from "../../utils/date"
import { getFrequency } from "../../utils/frequency"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"

interface Props extends RouteComponentProps, ThemedComponentProps {}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const OperationCrudPage: React.FC<Props> = ({ history, theme }) => {
  const [isLoading, setIsLoading] = useState(true)
  // load all operation list (START)
  const [allOperationList, setAllOperationList] = useState<Operation[]>([])
  const [operationList, setOperationList] = useState<Operation[]>([])
  const fetchAllOperations = useCallback(async () => {
    try {
      const { data } = await axios.get("/operation")
      setIsLoading(false)
      setAllOperationList(data.data as Operation[])
      setOperationList(data.data as Operation[])
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }, [])
  useEffect(() => {
    fetchAllOperations()
    // eslint-disable-next-line
  }, [fetchAllOperations])
  // load all operation list (END)

  // Add CSV (START)
  const [csvInfoDialogOpen, setCsvInfoDialogOpen] = useState(false)
  const downloadTemplateCSVHandler = () => {
    const CSV_HEADER =
      "Name,Tags,Start Time (YYYY-MM-DDTHH:MM),Value,Frequency (H-Hourly, D-Daily),Assignee,Sub Operation\n"
    var hiddenElement = document.createElement("a")
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(CSV_HEADER)
    hiddenElement.target = "_blank"
    hiddenElement.download = "OperationTemplate.csv"
    hiddenElement.click()
    setCsvInfoDialogOpen(false)
  }
  const getFrequencyInSeconds = (value: string, frequency: string): number => {
    var i
    for (i = 0; i < FREQUENCY_LIST.length; i++) {
      if (frequency === FREQUENCY_LIST[i].value.charAt(0))
        return FREQUENCY_LIST[i].frequency * parseInt(value)
    }
    return parseInt(value)
  }
  const [employeeList, setEmployeeList] = useState<Employee[]>([])
  const fetchAllEmploye = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get("/employee")
      setIsLoading(false)
      setEmployeeList(data.data as Employee[])
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }
  const getAssigneeNameFromEmail = (email: string): string => {
    for (var i = 0; i < employeeList.length; i++) {
      if (employeeList[i].email === email) {
        return employeeList[i].name
      }
    }
    return "test"
  }
  const uploadCSVHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    fetchAllEmploye()
    if (!event.target.files) return
    const file = event.target.files[0]
    const fileReader = new FileReader()
    fileReader.readAsText(file, "UTF-8")
    fileReader.onload = data => {
      var newOperationList: Operation[] = []
      let row = data.target?.result?.toString().trim().split("\n")
      if (data.target?.result?.toString().includes("\r"))
        row = data.target?.result?.toString().trim().split("\r\n")
      row?.forEach((data, index) => {
        if (index !== 0) {
          const [
            name,
            tags,
            startTime,
            value,
            frequency,
            assignee,
            ...subOperations
          ] = data.split(",")
          const isoStringDate = startTime + ":00.000Z"
          const date: Date = new Date(
            new Date(isoStringDate).getTime() - 3600000 * 5.5
          )
          const subOperation: SubOperations[] = []
          subOperations.forEach(subOP => {
            subOperation.push({ name: subOP, isComplete: false })
          })

          const operationData: Operation = {
            _id: "",
            operationName: name,
            tags: tags,
            startTime: date.getTime(),
            frequency: getFrequencyInSeconds(value, frequency),
            subOperations: subOperation,
            assignee: {
              name: getAssigneeNameFromEmail(assignee),
              email: assignee
            },
            inProgress: false,
            isCompletedOnce: false,
            isFailed: false,
            lastExpectedToBeDone: 0,
            progressPercentage: 0,
            end: 0,
            times: []
          }
          newOperationList.push(operationData)
        }
      })
      registerOperationsViaCSV(newOperationList)
    }
  }
  const registerOperationsViaCSV = async (body: Operation[]) => {
    setIsLoading(true)
    try {
      await axios.post("/operation", body)
      fetchAllOperations()
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }
  const addCSVButtonClickHandler = () => {
    document.getElementById("uploadCSV")?.click()
  }
  // Add CSV (END)

  const downloadCSVHandler = () => {
    var csvData =
      "Name,Tag,Start Time,Frequency,Assignee Name,Assignee Email,Sub Operations\n"
    operationList.forEach(operation => {
      csvData +=
        operation.operationName +
        "," +
        operation.tags +
        "," +
        new Date(operation.startTime) +
        "," +
        getFrequency(operation.frequency) +
        "," +
        operation.assignee.name +
        "," +
        operation.assignee.email
      if (operation.subOperations.length !== 0) {
        operation.subOperations.forEach(subOp => (csvData += "," + subOp.name))
      }
      csvData += "\n"
    })
    var hiddenElement = document.createElement("a")
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csvData)
    hiddenElement.target = "_blank"
    hiddenElement.download = "OperationList.csv"
    hiddenElement.click()
  }

  // Search Filter (START)
  const [search, setSearch] = useState("")
  const searchChangeController = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value.trim())
    setOperationList(
      allOperationList.filter(operation =>
        operation.operationName
          .toLowerCase()
          .includes(event.target.value.trim().toLowerCase())
      )
    )
  }
  // Search Filter (END)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<Color>("error")
  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbarOpen(false)
  }
  const showSnackbar = (message: string, severity: Color) => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const [nameSortEnabled, setNameSortEnabled] = useState(false)
  const [nameAscendingSort, setNameAscendingSort] = useState(true)
  const nameSort = () => {
    setNameSortEnabled(true)
    setStartTimeSortEnabled(false)
    setFrequencySortEnabled(false)
    setAssigneeSortEnabled(false)
    setOperationList(
      operationList.sort((a, b) => {
        var aName = a.operationName.toLowerCase()
        var bName = b.operationName.toLowerCase()
        if (nameAscendingSort) {
          if (aName < bName) return -1
          if (aName > bName) return 1
        } else {
          if (aName > bName) return -1
          if (aName < bName) return 1
        }
        return 0
      })
    )
    setNameAscendingSort(!nameAscendingSort)
  }

  const [startTimeSortEnabled, setStartTimeSortEnabled] = useState(false)
  const [startTimeAscendingSort, setStartTimeAscendingSort] = useState(true)
  const startTimeSort = () => {
    setNameSortEnabled(false)
    setStartTimeSortEnabled(true)
    setFrequencySortEnabled(false)
    setAssigneeSortEnabled(false)
    setOperationList(
      operationList.sort((a, b) => {
        var aStartTime = getTime(new Date(a.startTime))
        var bStartTime = getTime(new Date(b.startTime))
        if (startTimeAscendingSort)
          return (
            new Date("1970/01/01 " + aStartTime).getTime() -
            new Date("1970/01/01 " + bStartTime).getTime()
          )
        else
          return (
            new Date("1970/01/01 " + bStartTime).getTime() -
            new Date("1970/01/01 " + aStartTime).getTime()
          )
      })
    )
    setStartTimeAscendingSort(!startTimeAscendingSort)
  }

  const [frequencySortEnabled, setFrequencySortEnabled] = useState(false)
  const [frequencyAscendingSort, setFrequencyAscendingSort] = useState(true)
  const frequencySort = () => {
    setNameSortEnabled(false)
    setStartTimeSortEnabled(false)
    setFrequencySortEnabled(true)
    setAssigneeSortEnabled(false)
    setOperationList(
      operationList.sort((a, b) => {
        var aFreq = a.frequency
        var bFreq = b.frequency
        return frequencyAscendingSort ? aFreq - bFreq : bFreq - aFreq
      })
    )
    setFrequencyAscendingSort(!frequencyAscendingSort)
  }

  const [assigneeSortEnabled, setAssigneeSortEnabled] = useState(false)
  const [assigneeAscendingSort, setAssigneeAscendingSort] = useState(true)
  const assigneeSort = () => {
    setNameSortEnabled(false)
    setStartTimeSortEnabled(false)
    setFrequencySortEnabled(false)
    setAssigneeSortEnabled(true)
    setOperationList(
      operationList.sort((a, b) => {
        var aAssignee = a.assignee.name.toLowerCase()
        var bAssignee = b.assignee.name.toLowerCase()
        if (assigneeAscendingSort) {
          if (aAssignee < bAssignee) return -1
          if (aAssignee > bAssignee) return 1
        } else {
          if (aAssignee > bAssignee) return -1
          if (aAssignee < bAssignee) return 1
        }
        return 0
      })
    )
    setAssigneeAscendingSort(!assigneeAscendingSort)
  }

  if (isLoading) return <Loader />

  return (
    <div className={styles.container}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className={styles.header}>
        <TextField
          type="text"
          variant="outlined"
          size="small"
          value={search}
          className={styles.search}
          onChange={searchChangeController}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <div className={styles.actionsContainer}>
          <button onClick={downloadCSVHandler}>Download CSV</button>
          <button onClick={() => history.push("operations/create")}>
            Add Operation
          </button>
          <button onClick={addCSVButtonClickHandler}>Add CSV</button>
          <button
            className={styles.csvInfo}
            onClick={() => setCsvInfoDialogOpen(true)}
          >
            <InfoOutlinedIcon />
          </button>
          <Dialog open={csvInfoDialogOpen}>
            <DialogTitle>CSV Info</DialogTitle>
            <DialogContent className={styles.dialogContent}>
              <DialogContentText>
                The csv file should contain following columns Name, Tags, Start
                Time (format - YYYY-MM-DDTHH:MM), Value, Frequency (H-Hourly;
                D-Daily), Assignee, Sub Operation with a header
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCsvInfoDialogOpen(false)}>Close</Button>
              <Button onClick={downloadTemplateCSVHandler}>
                Download Template
              </Button>
            </DialogActions>
          </Dialog>
          <input
            id="uploadCSV"
            accept=".csv"
            multiple={false}
            onChange={uploadCSVHandler}
            style={{ display: "none" }}
            type="file"
          />
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table>
          <thead className={styles.tableHead}>
            <tr className="row">
              <th onClick={nameSort} className={styles.sortableHeader}>
                <div>
                  NAME
                  {nameSortEnabled ? (
                    nameAscendingSort ? (
                      <ArrowDropDownIcon />
                    ) : (
                      <ArrowDropUpIcon />
                    )
                  ) : null}
                </div>
              </th>
              <th onClick={startTimeSort} className={styles.sortableHeader}>
                <div>
                  START TIME
                  {startTimeSortEnabled ? (
                    startTimeAscendingSort ? (
                      <ArrowDropDownIcon />
                    ) : (
                      <ArrowDropUpIcon />
                    )
                  ) : null}
                </div>
              </th>
              <th onClick={frequencySort} className={styles.sortableHeader}>
                <div>
                  FREQUENCY
                  {frequencySortEnabled ? (
                    frequencyAscendingSort ? (
                      <ArrowDropDownIcon />
                    ) : (
                      <ArrowDropUpIcon />
                    )
                  ) : null}
                </div>
              </th>
              <th onClick={assigneeSort} className={styles.sortableHeader}>
                <div>
                  ASSIGNEE
                  {assigneeSortEnabled ? (
                    assigneeAscendingSort ? (
                      <ArrowDropDownIcon />
                    ) : (
                      <ArrowDropUpIcon />
                    )
                  ) : null}
                </div>
              </th>
              <th>VIEW</th>
              <th>EDIT</th>
              <th>DELETE</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {operationList.map((operation, idx) => (
              <OperationListItem
                theme={theme?.palette.type}
                key={idx}
                value={operation}
                onChange={fetchAllOperations}
                showSnackbar={showSnackbar}
              ></OperationListItem>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default withTheme(OperationCrudPage)
