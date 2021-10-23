import styles from "./EmployeeListItem.module.scss"
import IconButton from "@material-ui/core/IconButton"
import EditIcon from "@material-ui/icons/Edit"
import DoneIcon from "@material-ui/icons/Done"
import ClearIcon from "@material-ui/icons/Clear"
import DeleteIcon from "@material-ui/icons/Delete"
import { useState } from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import { Employee } from "../../models/employee.model"
import { axios } from "../../utils/axios"
import { AxiosError } from "axios"

interface Props {
  value: Employee
  onChange: Function
  id: number
  showSnackbar: Function
}

const EmployeeListItem: React.FC<Props> = props => {
  const { id } = props
  // Delete employee (START)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const deleteButtonClickHandler = () => setDeleteDialogOpen(true)
  const deleteDialogCancelHandler = () => setDeleteDialogOpen(false)
  const deleteEmployeeHandler = async () => {
    try {
      const { data } = await axios.delete("/employee/" + props.value.email)
      setDeleteDialogOpen(false)
      if (data.message.includes("Operation are alloted to this employe")) {
        props.showSnackbar(data.message, "error")
      } else {
        props.showSnackbar("Employee deleted", "success")
        props.onChange()
      }
    } catch (error) {
      const err = error as AxiosError
      setDeleteDialogOpen(false)
      props.showSnackbar(err.response?.data.message, "error")
    }
  }
  // Delete employee (END)

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [name, setName] = useState(props.value.name)
  const nameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value)
  const editButtonClickHandler = () => {
    setName(props.value.name)
    setIsEditing(true)
  }
  const updateEmployeeHandler = async () => {
    const updateEmployeeBody = { name }
    try {
      await axios.patch("/employee/" + props.value.email, updateEmployeeBody)
      setIsEditing(false)
      props.showSnackbar("Employee updated", "success")
      props.onChange()
    } catch (error) {
      const err = error as AxiosError
      setIsEditing(false)
      console.log(error)
      props.showSnackbar(err.response?.data.message, "error")
    }
  }

  return (
    <tr className={styles.tr}>
      <td>{id + 1}</td>
      <td>
        {isEditing ? (
          <TextField
            type="text"
            value={name}
            onChange={nameChangeHandler}
            variant="outlined"
            size="small"
          />
        ) : (
          props.value.name
        )}
      </td>
      <td>{props.value.email}</td>
      <td>
        {isEditing ? (
          <div>
            <IconButton
              component="span"
              size="small"
              onClick={updateEmployeeHandler}
            >
              <DoneIcon className={styles.doneButton} />
            </IconButton>
            <IconButton
              component="span"
              size="small"
              onClick={() => setIsEditing(false)}
            >
              <ClearIcon className={styles.clearButton} />
            </IconButton>
          </div>
        ) : (
          <IconButton
            component="span"
            onClick={editButtonClickHandler}
            size="small"
          >
            <EditIcon />
          </IconButton>
        )}
      </td>
      <td>
        <IconButton
          component="span"
          onClick={deleteButtonClickHandler}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </td>
      {/* Delete employee (START) */}
      <Dialog open={deleteDialogOpen}>
        <DialogTitle>Confirm Delete?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete employee - {props.value.name} ({props.value.email})
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteDialogCancelHandler} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteEmployeeHandler} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete employee (END) */}
    </tr>
  )
}

export default EmployeeListItem
