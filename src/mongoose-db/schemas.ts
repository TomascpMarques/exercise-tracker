import mongoose, { Model, Document } from 'mongoose'

export interface IUser extends Document {
  favorite_exercise: string
  country: string
  usrName: string
  name: string
  age: number
}

const userSchema = new mongoose.Schema<IUser>({
  favorite_exercise: { type: String },
  country: { type: String },
  usrName: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number },
})

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema)
