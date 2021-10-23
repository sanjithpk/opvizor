import mongoose from "mongoose"

export interface SubOperation extends Document {
  name: string
  isComplete: Boolean
}
export interface Assignee extends Document {
  name: string
  email: string
}
export interface Times extends Document {
  startTime: Number
  end: Number
  lastExpectedToBeDone: Number
  progressPercentage: Number
}

export interface OperationDocument extends mongoose.Document {
  operationName: string
  lastExpetedToBeDone: Number
  startTime: Number
  frequency: Number
  assignee: Assignee
  inProgress: Boolean
  isCompletedOnce: Boolean
  isFailed: Boolean
  tags: string
  subOperations: SubOperation[]
  times: Times[]
}
//Date datatype for startTime, lastExpetedToBeDone, expectedEndTime, end

const OperationSchema = new mongoose.Schema({
  operationName: { type: String, required: true },
  lastExpectedToBeDone: { type: Number, required: true, default: Date.now },
  startTime: { type: Number, required: true, default: Date.now },
  frequency: { type: Number, required: true },
  assignee: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  inProgress: { type: Boolean, required: true, default: false },
  isCompletedOnce: { type: Boolean, required: true, default: false },
  isFailed: { type: Boolean, required: true, default: false },
  tags: { type: String, required: true },
  subOperations: [
    {
      name: { type: String },
      isComplete: { type: Boolean, default: false }
    }
  ],
  times: [
    {
      startTime: { type: Number, required: true, default: Date.now },
      end: { type: Number, required: true, default: Date.now },
      lastExpectedToBeDone: { type: Number, required: true, default: Date.now },
      progressPercentage: { type: Number, required: true, default: 0 }
    }
  ]
})

export default mongoose.model<OperationDocument>("operation", OperationSchema)
