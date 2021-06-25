import mongoose, { model, Model } from 'mongoose'

interface IUser {
  favorite_exercise: string
  country: string
  usrName: string
  name: string
  age: number
}

interface IUserModel extends Model<IUser> {
  greeting(): string
}

const userSchema = new mongoose.Schema<IUser>({
  favorite_exercise: String,
  country: String,
  usrName: { type: String, required: true },
  name: { type: String, required: true },
  age: Number,
})

userSchema.methods.greeting = function (this: IUser) {
  return `Hello, I'm ${this.name}, I live in ${this.country}, and like to do ${this.favorite_exercise}`
}

export const User = model<IUser, IUserModel>('User', userSchema)
