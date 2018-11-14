const stylizeString = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')

const PKG_JSON = require('../package.json')

console.log(boxify(`
import { RichText } from '${stylizeString.bold(PKG_JSON.name)}'

const doc = RichText.inline_fragment()
   .pushText('Hello ')
   .pushStrong('world!')
   .done()

console.log('to text:' + RichText.to_text(doc))
`.trim()))

