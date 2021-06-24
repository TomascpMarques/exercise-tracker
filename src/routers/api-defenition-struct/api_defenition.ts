// This interface contains the values described
// in the api_met.json for each specific API
interface ApiDefenition {
   description: string // API's description, what it does, etc.
   entrypoint: string // The URL's path for conssuming the API
   version: string // API version, fromat "vX"
   url: string // The full url for the api i.e. [/api]/v1/people
}

export default ApiDefenition
