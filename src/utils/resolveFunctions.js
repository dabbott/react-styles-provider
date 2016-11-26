import type from './type'

const resolve = (x, ...params) => {
  switch (type(x)) {

    case 'Function':
      return resolve(x(...params), ...params)

    case 'Object':
      return Object.keys(x).reduce((acc, key) => {
        acc[key] = resolve(x[key], ...params)

        return acc
      }, {})

    case 'Array':
      return x.map(y => resolve(y, ...params))

    default:
      return x
  }
}

export default resolve
