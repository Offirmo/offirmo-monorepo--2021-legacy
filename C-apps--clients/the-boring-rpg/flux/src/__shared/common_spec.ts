const { TextEncoder } = require('util')
const { setTextEncoder } = require('@offirmo-private/murmurhash')
setTextEncoder(TextEncoder)
