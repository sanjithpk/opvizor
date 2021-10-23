import styles from "./OperationListItem.module.scss"
import IconButton from "@material-ui/core/IconButton"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"
import { useState } from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import { Operation } from "../../models/operation.model"
import Tooltip from "@material-ui/core/Tooltip"
import { axios } from "../../utils/axios"
import { useHistory } from "react-router"
import { getTime } from "../../utils/date"
import { getFrequency } from "../../utils/frequency"
import { tagColors } from "../../utils/theme"
import { PaletteType } from "@material-ui/core"
import { AxiosError } from "axios"

interface Props {
  value: Operation
  onChange: Function
  theme: PaletteType | undefined
  showSnackbar: Function
}

const OperationListItem: React.FC<Props> = props => {
  const history = useHistory()
  const { theme } = props

  // delete operation dialog (START)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const deleteOperationHandler = async () => {
    try {
      await axios.delete("/operation/" + props.value._id)
      setDeleteDialogOpen(false)
      props.showSnackbar("Operation deleted", "success")
      props.onChange()
    } catch (error) {
      const err = error as AxiosError
      setDeleteDialogOpen(false)
      props.showSnackbar(err.response?.data.message, "error")
    }
  }
  // delete operation dialog (END)

  const handleFrequencyStyle = (frequency: number) => {
    if (theme) {
      let color = tagColors.default[theme].color
      let backgroundColor = tagColors.default[theme].backgroundColor
      let border = tagColors.default[theme].border
      const freqValue = getFrequency(frequency)
      if (freqValue.includes("HOUR")) {
        color = tagColors.red[theme].color
        backgroundColor = tagColors.red[theme].backgroundColor
        border = tagColors.red[theme].border
      } else if (freqValue.includes("DAY")) {
        color = tagColors.green[theme].color
        backgroundColor = tagColors.green[theme].backgroundColor
        border = tagColors.green[theme].border
      }
      return { color, backgroundColor, border }
    }
    return {}
  }

  return (
    <tr>
      <td>{props.value.operationName}</td>
      <td>{getTime(new Date(props.value.startTime))}</td>
      <td className={styles.frequency}>
        <p style={handleFrequencyStyle(props.value.frequency)}>
          {getFrequency(props.value.frequency)}
        </p>
      </td>
      <td>
        <Tooltip title={props.value.assignee.email} interactive>
          <p>{props.value.assignee.name}</p>
        </Tooltip>
      </td>
      <td className={styles.subOperation}>
        <IconButton
          component="span"
          onClick={() => history.push("operation/detail/" + props.value._id)}
          size="small"
        >
          <OpenInNewIcon />
        </IconButton>
      </td>
      <td>
        <IconButton
          component="span"
          onClick={() => history.push("operations/edit/" + props.value._id)}
          size="small"
        >
          <EditIcon />
        </IconButton>
      </td>
      <td>
        <IconButton
          component="span"
          onClick={() => setDeleteDialogOpen(true)}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </td>
      {/* DELETE OPERATION DIALOG (START) */}
      <Dialog open={deleteDialogOpen}>
        <DialogTitle>Confirm Delete?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete operation - {props.value.operationName}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteOperationHandler} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* DELETE OPERATION DIALOG (END) */}
    </tr>
  )
}

export default OperationListItem
