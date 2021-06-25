import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  favorite_exercise: String,
  country: String,
  usrName: String,
  name: String,
  age: Number,
})

export const User = mongoose.model('User', userSchema)
