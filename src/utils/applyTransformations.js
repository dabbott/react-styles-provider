export default (list = [], x, ...params) =>
  list.reduce((result, f) => f(result, ...params), x)
