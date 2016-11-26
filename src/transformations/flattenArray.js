import { type } from '../utils'

export default x => (
  type(x) === 'Array'
    ? x.reduce((result, obj) => ({...result, ...obj}), {})
    : x
)
