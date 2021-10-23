import styles from "./EmployeeCrudPage.module.scss"
import Button from "@material-ui/core/Button"
import React, { useState, useEffect, useCallback } from "react"
import EmployeeListItem from "../../components/employee-list-item/EmployeeListItem"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"
import { Employee } from "../../models/employee.model"
import { axios } from "../../utils/axios"
import Loader from "../../components/loader/Loader"
import { useForm } from "react-hook-form"
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined"
import InputAdornment from "@material-ui/core/InputAdornment"
import SearchIcon from "@material-ui/icons/Search"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert, { Color, AlertProps } from "@material-ui/lab/Alert"
import { AxiosError } from "axios"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"

interface RegisterEmployeeFormInputs {
  name: string
  email: string
  password: string
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const EmployeeCrudPage: React.FC = () => {
  // load all employee list (START)
  const [isLoading, setIsLoading] = useState(true)
  const [allEmployeeList, setAllEmployeeList] = useState<Employee[]>([])
  const [employeeList, setEmployeeList] = useState<Employee[]>([])
  const fetchAllEmploye = useCallback(async () => {
    try {
      const { data } = await axios.get("/employee")
      setAllEmployeeList(data.data as Employee[])
      setEmployeeList(data.data as Employee[])
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    fetchAllEmploye()
  }, [fetchAllEmploye])
  // load all employee list (END)

  // Add new employee (START)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterEmployeeFormInputs>()
  const [addEmpDialogOpen, setAddEmpDialogOpen] = useState(false)

  const registerEmployeeHandler = async (
    registerFormInput: RegisterEmployeeFormInputs
  ) => {
    const employeeRegisterBody = {
      name: registerFormInput.name,
      email: registerFormInput.email,
      password: registerFormInput.password,
      role: "employee"
    }
    try {
      await axios.post("employee/register", employeeRegisterBody)
      setAddEmpDialogOpen(false)
      showSnackbar("Employee added", "success")
      fetchAllEmploye()
    } catch (error) {
      const err = error as AxiosError
      showSnackbar(err.response?.data.message, "error")
      console.log(error)
    }
  }
  // Add new employee (END)

  // Add CSV (START)
  const uploadCSVHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    const file = event.target.files[0]
    const fileReader = new FileReader()
    fileReader.readAsText(file, "UTF-8")
    fileReader.onload = data => {
      var newEmployeeList: object[] = []
      let row = data.target?.result?.toString().trim().split("\n")
      if (data.target?.result?.toString().includes("\r"))
        row = data.target?.result?.toString().trim().split("\r\n")
      row?.forEach((data, index) => {
        if (index !== 0) {
          const [name, email, password] = data.split(",")
          newEmployeeList.push({ name, email, password, role: "employee" })
        }
      })
      registerEmployeesViaCSV(newEmployeeList)
    }
  }
  const registerEmployeesViaCSV = async (body: object[]) => {
    console.log(body)
    try {
      await axios.post("employee/register", body)
      fetchAllEmploye()
    } catch (error) {
      console.log(error)
    }
  }
  const addCSVButtonClickHandler = () => {
    document.getElementById("uploadCSV")?.click()
  }
  // Add CSV (END)

  const downloadCSVHandler = () => {
    var csvData = "Name,Email\n"
    employeeList.forEach(
      employee => (csvData += employee.name + "," + employee.email + "\n")
    )
    var hiddenElement = document.createElement("a")
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csvData)
    hiddenElement.target = "_blank"
    hiddenElement.download = "EmployeeList.csv"
    hiddenElement.click()
  }

  // Search Filter (START)
  const [search, setSearch] = useState("")
  const searchChangeController = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value.trim())
    setEmployeeList(
      allEmployeeList.filter(employee =>
        employee.name
          .toLowerCase()
          .includes(event.target.value.trim().toLowerCase())
      )
    )
  }
  // Search Filter (END)

  // CSV info (START)
  const [csvInfoDialogOpen, setCsvInfoDialogOpen] = useState(false)
  const downloadTemplateCSVHandler = () => {
    const CSV_HEADER = "Name,Email,Password\n"
    var hiddenElement = document.createElement("a")
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(CSV_HEADER)
    hiddenElement.target = "_blank"
    hiddenElement.download = "EmployeeTemplate.csv"
    hiddenElement.click()
    setCsvInfoDialogOpen(false)
  }
  // CSV info (END)

  const theme = window.localStorage.getItem("theme") as string

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
    setEmailSortEnabled(false)
    setEmployeeList(
      employeeList.sort((a, b) => {
        var aName = a.name.toLowerCase()
        var bName = b.name.toLowerCase()
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
  const [emailSortEnabled, setEmailSortEnabled] = useState(false)
  const [emailAscendingSort, setEmailAscendingSort] = useState(true)
  const emailSort = () => {
    setEmailSortEnabled(true)
    setNameSortEnabled(false)
    setEmployeeList(
      employeeList.sort((a, b) => {
        var aEmail = a.email.toLowerCase()
        var bEmail = b.email.toLowerCase()
        if (emailAscendingSort) {
          if (aEmail < bEmail) return -1
          if (aEmail > bEmail) return 1
        } else {
          if (aEmail > bEmail) return -1
          if (aEmail < bEmail) return 1
        }
        return 0
      })
    )
    setEmailAscendingSort(!emailAscendingSort)
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
          onChange={searchChangeController}
          className={styles.search}
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
          <button onClick={() => setAddEmpDialogOpen(true)}>
            Add Employee
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
                The csv file should contain 3 columns Name, Email, Password with
                a header
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCsvInfoDialogOpen(false)}>
                Cancel
              </Button>
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
        {/* Add new employee dialog (START) */}
        <Dialog open={addEmpDialogOpen} className={theme}>
          <DialogTitle>Add New Employee</DialogTitle>
          <form onSubmit={handleSubmit(registerEmployeeHandler)}>
            <DialogContent className={styles.dialogContent}>
              <TextField
                {...register("name", { required: "* mandatory" })}
                autoFocus
                className={styles.textInput}
                id="name"
                name="name"
                label="Name"
                type="text"
                variant="outlined"
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
              <TextField
                {...register("email", { required: "* mandatory" })}
                className={styles.textInput}
                id="email"
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
              <TextField
                {...register("password", { required: "* mandatory" })}
                className={styles.textInput}
                id="password"
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddEmpDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Add</Button>
            </DialogActions>
          </form>
        </Dialog>
        {/* Add new employee dialog (END) */}
      </div>
      <div className={styles.tableContainer}>
        <table>
          <thead className={styles.tableHead}>
            <tr>
              <th>Id</th>
              <th onClick={nameSort} className={styles.sortableHeader}>
                <div>
                  Name
                  {nameSortEnabled ? (
                    nameAscendingSort ? (
                      <ArrowDropDownIcon />
                    ) : (
                      <ArrowDropUpIcon />
                    )
                  ) : null}
                </div>
              </th>
              <th onClick={emailSort} className={styles.sortableHeader}>
                <div>
                  Email
                  {emailSortEnabled ? (
                    emailAscendingSort ? (
                      <ArrowDropDownIcon />
                    ) : (
                      <ArrowDropUpIcon />
                    )
                  ) : null}
                </div>
              </th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {employeeList.map((employee, idx) => (
              <EmployeeListItem
                key={idx}
                id={idx}
                value={employee}
                onChange={fetchAllEmploye}
                showSnackbar={showSnackbar}
              ></EmployeeListItem>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeeCrudPage
