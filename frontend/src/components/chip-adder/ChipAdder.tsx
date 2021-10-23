import styles from "./ChipAdder.module.scss"
import React, { useState } from "react"
import Chip from "@material-ui/core/Chip"
import IconButton from "@material-ui/core/IconButton"
import AddIcon from "@material-ui/icons/Add"
import TextField from "@material-ui/core/TextField"

interface Props {
  data: string[]
  onUpdate: Function
}

const ChipAdder: React.FC<Props> = props => {
  interface ChipDataType {
    id: number
    value: string
  }

  const stringArrayToChipData = (dataArray: string[]): ChipDataType[] => {
    var result: ChipDataType[] = []
    dataArray.forEach(data => {
      result.push({ id: result.length, value: data })
    })
    return result
  }

  const chipDataArrayToStringArray = (
    chipDataArray: ChipDataType[]
  ): string[] => {
    var result: string[] = []
    chipDataArray.map(chipData => result.push(chipData.value))
    return result
  }

  const [newChipData, setNewChipData] = useState("")
  const [chipDataArray, setChipDataArray] = useState<ChipDataType[]>(
    stringArrayToChipData(props.data)
  )

  const newChipInputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setNewChipData(event.target.value)

  const addChipHandler = () => {
    if (newChipData.trim().length === 0) return
    var chipDataNewId: ChipDataType[] = [...chipDataArray]
    chipDataNewId.push({ id: chipDataArray.length, value: newChipData })
    setChipDataArray(chipDataNewId)
    props.onUpdate(chipDataArrayToStringArray(chipDataNewId))
    setNewChipData("")
  }

  const removeChipHandler = (chipIdToDelete: number) => () => {
    var chipDataNewId: ChipDataType[] = []
    chipDataArray.forEach(chipData => {
      if (chipData.id !== chipIdToDelete)
        chipDataNewId.push({ id: chipDataNewId.length, value: chipData.value })
    })
    setChipDataArray(chipDataNewId)
    props.onUpdate(chipDataArrayToStringArray(chipDataNewId))
  }

  const enterPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      addChipHandler()
    }
  }

  return (
    <div className={styles.chipAdderComponent}>
      <div>
        {chipDataArray.map((chipData, idx) => (
          <Chip
            key={idx}
            label={chipData.value}
            onDelete={removeChipHandler(chipData.id)}
            variant="outlined"
            className={styles.chip}
          />
        ))}
      </div>
      <div className={styles.inputContainer}>
        <TextField
          label="Sub Operation"
          className={styles.input}
          type="text"
          variant="outlined"
          onKeyPress={enterPressHandler}
          value={newChipData}
          onChange={newChipInputChangeHandler}
        />
        <IconButton
          className={styles.inputButton}
          color="primary"
          component="span"
          onClick={addChipHandler}
        >
          <AddIcon />
        </IconButton>
      </div>
    </div>
  )
}

export default ChipAdder
