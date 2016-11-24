
export default (resolve, {locals}, x, ...params) => {
  if (locals.type !== 'Function') return x

  return resolve(x(...params), ...params)
}
