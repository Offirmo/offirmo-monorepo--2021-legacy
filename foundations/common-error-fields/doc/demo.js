
const { ERROR_FIELDS } = require('..')

console.log('Known error fields:')
Array.from(ERROR_FIELDS.values()).forEach(field => console.log(`- ${field}`))
