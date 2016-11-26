import Prefixer from 'inline-style-prefixer'

import { type } from '../utils'

const prefixer = new Prefixer()
const prefix = style => prefixer.prefix(style)

export default x => (
  type(x) === 'Object' ? prefix(x) : x
)
