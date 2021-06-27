export interface IFindByNameURLQuery {
  first?: string
  last?: string
}

export interface IFindByCountryURLQuery {
  country?: string
  order?: {
    field: string
    directions?: 'asc' | 'des'
  }
}
