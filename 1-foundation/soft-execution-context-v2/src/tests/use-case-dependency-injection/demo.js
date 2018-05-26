
/*
const s1 = Object.create(null)
s1.module = '?'
s1.operation = '?'
const s2 = Object.create(s1)
s2.module = 'foo'
const s3 = Object.create(s2)
s3.operation = 'bar'

console.log({s1, s2, s3})
console.log({module: s3.module, operation: s3.operation})
*/

import { hello } from './lib.js'

hello('Offirmo')
