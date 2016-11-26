export default (original, keys = []) =>
  Object.keys(original).reduce((created, key) => {
    if (keys.indexOf(key) === -1) {
      created[key] = original[key]
    }

    return created
  }, {})
