import styles from "./OperationForm.module.scss"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import React, { useEffect, useState } from "react"
import MenuItem from "@material-ui/core/MenuItem"
import ChipAdder from "../chip-adder/ChipAdder"
import { axios } from "../../utils/axios"
import { Employee } from "../../models/employee.model"
import { Operation, SubOperations } from "../../models/operation.model"
import { RouteComponentProps, useHistory } from "react-router"
import Loader from "../loader/Loader"
import { FREQUENCY_LIST, getFrequency } from "../../utils/frequency"
import { toGMTDate, toISTDate } from "../../utils/date"
import Paper from "@material-ui/core/Paper"
import { useForm } from "react-hook-form"

interface MatchParams {
  operationId: string
}

interface OperationFormInputs {
  name: string
  tags: string
  assignee: string
}

const OperationCreate: React.FC<RouteComponentProps<MatchParams>> = props => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<OperationFormInputs>()
  const [isEdit, setIsEdit] = useState(false)
  const currrentDateTime = new Date(Date.now() + 3600000 * 5.5)
    .toISOString()
    .substring(0, 16)
  const [name, setName] = useState("")
  const [tags, setTags] = useState("")
  const [startDateTime, setStartDateTime] = useState(currrentDateTime)
  const [value, setOpValue] = useState<number>(1)
  const [frequency, setFrequency] = useState<number>(
    FREQUENCY_LIST[0].frequency
  )
  const [subOperation, setSubOperation] = useState<string[]>([])
  const [assignee, setAssignee] = useState<string>("")

  const nameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value)
  const tagsChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTags(event.target.value.trim().toLowerCase())
  const startDateTimeChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setStartDateTime(event.target.value)
  const valueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setOpValue(+event.target.value)
  const frequencyChangeHandler = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => setFrequency(event.target.value as number)
  const subOperationChangeHandler = (subOperationArray: string[]) => {
    setSubOperation(subOperationArray)
  }
  const assigneeChangeHandler = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => setAssignee(event.target.value as string)

  const operationId = props.match.params.operationId
  const history = useHistory()
  if (operationId === undefined) {
  }
  const [isLoading, setIsLoading] = useState(true)
  const [employeeList, setEmployeeList] = useState<Employee[]>([])
  const [editOperationData, setEditOperationData] = useState<Operation>()
  const calculateFrequencyValue = (inSeconds: number) => {
    var [value, frequency] = getFrequency(inSeconds).split(" ")
    setOpValue(parseInt(value))
    for (var i = 0; i < FREQUENCY_LIST.length; i++) {
      if (frequency === FREQUENCY_LIST[i].value)
        setFrequency(FREQUENCY_LIST[i].frequency)
    }
  }
  const setOperationData = (operation: Operation) => {
    setName(operation.operationName)
    setValue("name", operation.operationName)
    const startTime = toGMTDate(operation.startTime)
      .toISOString()
      .substring(0, 16)
    setStartDateTime(startTime)
    calculateFrequencyValue(operation.frequency)
    var subOperations: string[] = []
    operation.subOperations.forEach(subOp => subOperations.push(subOp.name))
    setSubOperation(subOperations)
    setAssignee(operation.assignee.email)
    setValue("assignee", operation.assignee.email)
    setTags(operation.tags)
    setValue("tags", operation.tags)
  }
  const fetchAllEmploye = async () => {
    try {
      const { data } = await axios.get("/employee")
      setEmployeeList(data.data as Employee[])
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }
  const fetchOperation = async () => {
    try {
      const { data } = await axios.get(`/operation/${operationId}`)
      setEditOperationData(data.data as Operation)
      setOperationData(data.data as Operation)
      fetchAllEmploye()
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    const operationId = props.match.params.operationId
    if (operationId === undefined) {
      setIsEdit(false)
      fetchAllEmploye()
    } else {
      setIsEdit(true)
      fetchOperation()
    }
    // eslint-disable-next-line
  }, [])

  const getAssigneeNameFromEmail = (email: string): string => {
    for (var i = 0; i < employeeList.length; i++) {
      if (employeeList[i].email === email) {
        return employeeList[i].name
      }
    }
    return "test"
  }

  const submitOperationHandler = () => {
    setIsLoading(true)
    const subOperations: SubOperations[] = []
    if (subOperation.length !== 0) {
      subOperation.forEach(subOperation => {
        subOperations.push({ name: subOperation, isComplete: false })
      })
    }
    var assigneeName = getAssigneeNameFromEmail(assignee)
    const isoStringDate = startDateTime + ":00.000Z"
    const date: Date = toISTDate(new Date(isoStringDate).getTime())
    if (isEdit) {
      const operationBody: Operation = {
        _id: editOperationData?._id ?? "",
        inProgress: editOperationData?.inProgress ?? false,
        isCompletedOnce: editOperationData?.isCompletedOnce ?? false,
        tags: tags,
        isFailed: editOperationData?.isFailed ?? false,
        operationName: name,
        lastExpectedToBeDone: date.getTime(),
        startTime: date.getTime(),
        frequency: value * frequency,
        assignee: {
          name: assigneeName,
          email: assignee
        },
        subOperations: subOperations,
        progressPercentage: editOperationData?.progressPercentage ?? 0,
        end: editOperationData?.end ?? 0,
        times: editOperationData?.times ?? []
      }
      updateOperation(operationBody)
    } else {
      const operationBody: Operation = {
        _id: "",
        inProgress: false,
        isCompletedOnce: false,
        tags: tags,
        isFailed: false,
        operationName: name,
        lastExpectedToBeDone: date.getTime(),
        startTime: date.getTime(),
        frequency: value * frequency,
        assignee: {
          name: assigneeName,
          email: assignee
        },
        subOperations: subOperations,
        progressPercentage: 0,
        end: 0,
        times: []
      }
      submitNewOperation(operationBody)
    }
  }
  const updateOperation = async (operationBody: Operation) => {
    try {
      await axios.put(`/operation/${operationId}`, operationBody)
      setIsLoading(false)
      history.goBack()
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }
  const submitNewOperation = async (operationBody: Operation) => {
    try {
      await axios.post("/operation", operationBody)
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
      <div>
        <h1>{isEdit ? "Edit" : "Create New"} Operation</h1>
      </div>
      <Paper>
        <form
          className={styles.body}
          onSubmit={handleSubmit(submitOperationHandler)}
        >
          <TextField
            {...register("name", { required: "* mandatory" })}
            label="Name"
            name="name"
            type="text"
            value={name}
            onChange={nameChangeHandler}
            variant="outlined"
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
          <TextField
            {...register("tags", { required: "* mandatory" })}
            className={styles.marginTop}
            label="Tag"
            name="tags"
            type="text"
            value={tags}
            onChange={tagsChangeHandler}
            variant="outlined"
            error={Boolean(errors.tags)}
            helperText={errors.tags?.message}
          />
          <TextField
            label="Start Time"
            type="datetime-local"
            variant="outlined"
            className={styles.marginTop}
            value={startDateTime}
            onChange={startDateTimeChangeHandler}
          />
          <div className={styles.dual}>
            <TextField
              value={value}
              onChange={valueChangeHandler}
              label="Value"
              type="number"
              variant="outlined"
              InputProps={{ inputProps: { min: 1 } }}
            />
            <TextField
              select
              label="Frequency"
              value={frequency}
              onChange={frequencyChangeHandler}
              variant="outlined"
            >
              {FREQUENCY_LIST.map((frequency, idx) => (
                <MenuItem key={idx} value={frequency.frequency}>
                  {frequency.value}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <ChipAdder
            data={subOperation}
            onUpdate={subOperationChangeHandler}
          ></ChipAdder>
          <TextField
            {...register("assignee", { required: "* mandatory" })}
            className={styles.marginTop}
            select
            label="Assignee"
            name="assignee"
            value={assignee}
            onChange={assigneeChangeHandler}
            variant="outlined"
            error={Boolean(errors.assignee)}
            helperText={errors.assignee?.message}
          >
            {employeeList.map((employee, idx) => (
              <MenuItem key={idx} value={employee.email}>
                {employee.name}
              </MenuItem>
            ))}
          </TextField>
          <div className={styles.dual}>
            <Button
              className={styles.buttonCancel}
              onClick={() => history.goBack()}
            >
              Cancel
            </Button>
            <Button type="submit" className={styles.buttonAdd}>
              {isEdit ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  )
}

export default OperationCreate
