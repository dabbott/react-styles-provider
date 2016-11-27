import { type, mapRecursive } from '../utils'

const f = x => (
  type(x) === 'Array'
    ? x.reduce((result, obj) => ({...result, ...obj}), {})
    : x
)

export default x => mapRecursive(x, f)
