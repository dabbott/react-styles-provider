import Prefixer from 'inline-style-prefixer'

const prefixer = new Prefixer()
const prefix = (style) => prefixer.prefix(style)

export default ({locals}, x, ...params) => {
  if (locals.type !== 'Object') return x

  return prefix(x)
}
