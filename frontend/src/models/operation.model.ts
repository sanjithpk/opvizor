export interface Operation {
  startTime: number
  progressPercentage: number
  operationName: string
  lastExpectedToBeDone: number
  isFailed: boolean
  isCompletedOnce: boolean
  inProgress: boolean
  frequency: number
  end: number
  assignee: Assignee
  subOperations: SubOperations[]
  tags: string
  times: []
  _id: string
}

export interface SubOperations {
  isComplete: boolean
  name: string
}

export interface Assignee {
  name: string
  email: string
}
