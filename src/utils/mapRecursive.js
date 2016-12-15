import type from './type'

const mapRecursive = (x, params, f, depth) => {
  x = f(x, params, depth)

  switch (type(x)) {

    case 'Object':
      return Object.keys(x).reduce((acc, key) => {
        acc[key] = mapRecursive(x[key], params, f, depth)

        return acc
      }, {})

    case 'Array':
      return x.map(y => mapRecursive(y, params, f, depth))

    default:
      return x
  }
}

export default (x, params, f) =>
  (type(params) === 'Array'
    ? mapRecursive(x, params, f, 0)
    : mapRecursive(x, [], params, 0))
