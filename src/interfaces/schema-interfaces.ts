export interface IFindByNameURLQuery {
  first?: string
  last?: string
}

export interface IFindByCountryURLQuery {
  country: string
}

export interface IRegisterUserReferenceIUser {
  favorite_exercise?: string
  country?: string
  usrName: string
  name: {
    first: string
    last: string
  }
  age?: number
}
