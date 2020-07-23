const { merge_browserslist_queries } = require('./_common')

const DESKTOP = require('./browsers--desktop')
const MOBILE = require('./browsers--mobile')

module.exports = merge_browserslist_queries(DESKTOP, MOBILE)
