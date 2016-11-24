
export default (resolve, {locals}, x, ...params) => {
  if (locals.type !== 'Array') return x

  return x.map(obj => resolve(obj, ...params))
}
