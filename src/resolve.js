
import arrayResolver from './resolvers/array'
import typeResolver from './resolvers/type'
import objectResolver from './resolvers/object'
import functionResolver from './resolvers/function'

import flattenArray from './transformers/flattenArray'
import prefix from './transformers/prefix'

export default (config, x, ...params) => {

  let {resolvers = [], transformers = []} = config

  resolvers = [typeResolver, objectResolver, functionResolver, arrayResolver, ...resolvers]
  transformers = [flattenArray, prefix, ...transformers]

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
