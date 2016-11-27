import { type, mapRecursive } from '../utils'

const getObjectFromKeyPath = (data, keyPath) =>
  keyPath.split('.').reduce((prev, curr) => prev[curr], data)

// Maintain a reference to the root object.
// Look up styles by key from the root object.
const f = (root, x) => {
  if (type(x) !== 'Array') return x

  return x.map((item) => {
    if (type(item) !== 'String') return item

    return getObjectFromKeyPath(root, item)
  })
}

export default x => mapRecursive(x, f.bind(null, x))
