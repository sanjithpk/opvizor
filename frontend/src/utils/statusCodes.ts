export const statusCodes: StatusCode = {
  done: {
    code: "Recently Done",
    color: "#64a338" // green
  },
  inProgress: {
    code: "In Progress",
    color: "#3865a3" // blue
  },
  dueDatePassed: {
    code: "Due Date Passed",
    color: "#e03b24" // red
  },
  todo: {
    code: "Todo",
    color: "#ffcc00" // yellow
  }
}

interface StatusCode {
  [key: string]: {
    code: string
    color: string
  }
}
