import mongoose, { Model, Schema } from 'mongoose'

export interface IUser {
  favorite_exercise?: string
  country?: string
  usrName: string
  name: {
    first: string
    last: string
  }
  age?: number
}

const userSchema = new mongoose.Schema<IUser>({
  favorite_exercise: { type: String },
  country: { type: String },
  usrName: { type: String, required: true },
  name: { type: Schema.Types.Mixed, required: true },
  age: { type: Number },
})

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema)
