import "./OperationStepper.scss"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import Stepper from "@material-ui/core/Stepper"
import Step from "@material-ui/core/Step"
import StepLabel from "@material-ui/core/StepLabel"
import StepContent from "@material-ui/core/StepContent"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import { useContext, useEffect, useState } from "react"
import { RouteComponentProps } from "react-router"
import AuthContext from "../../store/auth-context"
import { axios } from "../../utils/axios"
import { Operation } from "../../models/operation.model"
import Loader from "../loader/Loader"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      color: "white"
    },
    actionsContainer: {
      marginBottom: theme.spacing(2)
    },
    resetContainer: {
      padding: theme.spacing(3)
    }
  })
)

interface MatchParams {
  role: string
  operationId: string
}

const OperationStepper: React.FC<RouteComponentProps<MatchParams>> = props => {
  const { history } = props
  const operationId = props.match.params.operationId
  const { user } = useContext(AuthContext)
  const content = `Try out different ad text to see what brings in the most customers,
  and learn how to enhance your ads using features like ad extensions.
  If you run into any problems with your ads, find out how to tell if
  they're running and how to resolve approval issues.`

  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const [steps, setSteps] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [operation, setOperation] = useState<Operation | null>(null)

  const handleFinish = async () => {
    try {
      axios.patch(`/operation/finish/${operationId}`)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDone = async () => {
    setOperation(operation => {
      if (operation) {
        let subOperations = operation.subOperations
        subOperations[activeStep].isComplete = true
        try {
          axios.patch(`/operation/${operationId}`, {
            subOperations
          })
        } catch (err) {
          console.log(err)
        }
        return {
          ...operation,
          subOperations: subOperations
        }
      }
      return null
    })
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    if (steps.length - 1 === activeStep) {
      handleFinish()
      history.replace(`/${user.role}`)
    }
  }

  useEffect(() => {
    const fetchOperation = async () => {
      try {
        const { data } = await axios.get(`/operation/${operationId}`)
        const operation = data.data as Operation
        setOperation(operation)
        setIsLoading(false)
        operation.subOperations.forEach(subOperation => {
          setSteps(steps => [subOperation.name, ...steps])
          if (subOperation.isComplete) {
            setActiveStep(prevStep => prevStep + 1)
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
    fetchOperation()
  }, [operationId])

  if (isLoading) return <Loader />

  return (
    <section className="operation-stepper">
      <h1>{operation?.operationName}</h1>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{content}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDone}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Done"}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </section>
  )
}

export default OperationStepper
