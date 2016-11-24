
export default ({locals}, x, ...params) => {
  if (locals.type !== 'Array') return x

  return x.reduce((acc, obj) => ({...acc, ...obj}), {})
}
