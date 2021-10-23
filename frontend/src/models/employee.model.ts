export interface Employee {
  name: string
  email: string
}

export interface NotificationsObject {
  notification: Notification[]
}

export interface Notification {
  isRead: boolean
  message: string
  timeStamp: number
  operationId: string
}
