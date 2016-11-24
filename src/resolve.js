
const type = (x) => ({}).toString.call(x).slice(8, -1)

const resolve = (x, ...params) => {
  switch (type(x)) {

    case 'Function':
      return resolve(x(...params))

    case 'Object':
      return Object.keys(x).reduce((acc, key) => {
        acc[key] = resolve(x[key], ...params)

        return acc
      }, {})

    default:
      return x
  }
}

export default resolve
