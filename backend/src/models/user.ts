import mongoose from "mongoose"

export interface Notification extends Document {
  message: string
  timeStamp: Number
  isRead: Boolean
  id: string
}
export interface UserDocument extends mongoose.Document {
  name: string
  email: string
  password: string
  role: string
  tokenId: string
}
export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "manager" },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  tokenId: { type: String },
  notification: [
    {
      message: { type: String },
      timeStamp: { type: Number },
      isRead: { type: Boolean, default: false },
      operationId: { type: String }
    }
  ]
})

export default mongoose.model<UserDocument>("user", UserSchema)
