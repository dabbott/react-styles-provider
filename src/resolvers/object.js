
export default (resolve, {locals}, x, ...params) => {
  if (locals.type !== 'Object') return x

  return Object.keys(x).reduce((acc, key) => {
    acc[key] = resolve(x[key], ...params)

    return acc
  }, {})
}
