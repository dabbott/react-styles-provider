
const getType = (x) => ({}).toString.call(x).slice(8, -1)

export default (resolve, {locals}, x, ...params) => {
  locals.type = getType(x)

  return x
}
