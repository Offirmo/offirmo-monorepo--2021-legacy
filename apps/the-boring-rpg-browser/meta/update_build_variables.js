console.log('🧙️  Hello from update_build_variables.js!')

const path = require('path')
const write_json_file = require("write-json-file")

const { get_human_readable_UTC_timestamp_minutes } = require('@offirmo/timestamps')

/*********************/

const PACKAGE_JSON_PATH = path.join('..', 'package.json')
const { version: VERSION } = require(PACKAGE_JSON_PATH)
const PACKAGE_DIR = path.basename(path.resolve(__dirname, '..'))
const BUILD_DATE = get_human_readable_UTC_timestamp_minutes()

console.log('🧙️  Extracted variables:', {VERSION, PACKAGE_DIR, BUILD_DATE})

// the path we'll serve under in prod
//const BASE_PATH = '/the-boring-rpg'


write_json_file(path.resolve(__dirname, '../src/services/build.json'), {
	VERSION,
	BUILD_DATE,
})

/*
			// confirmed: manually declaring NODE_ENV is needed!
			'NODE_ENV': JSON.stringify(NODE_ENV),
			// WI = Webpack Injected
			WI_BASE_PATH: JSON.stringify(BASE_PATH), // inject it for react-router basename auto-detection
			WI_ENV: JSON.stringify(NODE_ENV),
			WI_VERSION: JSON.stringify(VERSION),
			WI_BUILD_DATE: JSON.stringify(BUILD_DATE),

		*/



/******* DEV *******/

// SPECIAL, COMPLICATED technique:
// If we are in a monorepo and want to serve this sub-package on different URLs:
// - PROD: https://www.online-adventur.es/apps/the-boring-rpg/
// - STAGING: https://offirmo.netlify.com/apps/dist/the-boring-rpg/
// - DEV/STAGING: http://localhost:8000/apps/the-boring-rp/dist/
// - DEV: whatever, currently http://localhost:8080/the-boring-rpg
// For React router to work with this, it needs to be given a "basename".
// To make that works in dev, we simulate a sub-path in dev as well,
// by using a combo of `publicPath` and `contentBase`:
// content from webpack served from here:
//const PUBLIC_PATH = BASE_PATH // replicate prod setting
// content NOT from webpack served from here:
// XXX try to NOT SERVE ANYTHING through this,
//     there are webpack plugins to solve that!
// XXX path relative to webpack dev server CWD!
//const CONTENT_BASE = '../dist' // so that /our-package-name/index.html/favicon.xyz works



