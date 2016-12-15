import { type, mapRecursive } from '../utils'

const f = (x, params) => {
  while (type(x) === 'Function') {
    x = x(...params)
  }

  return x
}

export default (x, ...params) => mapRecursive(x, params, f)
