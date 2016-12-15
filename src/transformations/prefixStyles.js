import Prefixer from 'inline-style-prefixer'

const prefixer = new Prefixer()
const prefix = style => prefixer.prefix(style)

export default x => prefix(x)
