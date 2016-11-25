
const type = (x) => ({}).toString.call(x).slice(8, -1)

const res = (x, ...params) => {
  switch (type(x)) {

    case 'Function':
      return res(x(...params), ...params)

    case 'Object':
      return Object.keys(x).reduce((acc, key) => {
        acc[key] = res(x[key], ...params)

        return acc
      }, {})

    case 'Array':
      return x.map(obj => res(obj, ...params))

    default:
      return x
  }
}

export default (config, x, ...params) => {

  let {resolvers = [], transformers = []} = config

  const globals = {}

  const resolve = (x, ...params) => {
    const context = {globals, locals: {}}

    const resolved = resolvers.reduce((result, plugin, i, list) => {
      return plugin(resolve, context, result, ...params)
    }, x)

    // console.log('resolved', resolved)

    const transformed = transformers.reduce((result, plugin, i, list) => {
      return plugin(context, result, ...params)
    }, resolved)

    // console.log('transformers', transformed)

    return transformed
  }

  // console.log('results', resolve(x, ...params))

  return resolve(x, ...params)
}
