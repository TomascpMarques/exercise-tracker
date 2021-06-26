// Interface describes a user, its used in mongoose schemas
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
