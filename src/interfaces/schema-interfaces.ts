// Describes the expected fields in a custom query for a user
// all fields are optional
export interface IUserUrlQuerys {
  favoriteExercise?: string
  country?: string
  usrName?: string
  name?: {
    first?: string
    last?: string
  }
  age?: string
}
