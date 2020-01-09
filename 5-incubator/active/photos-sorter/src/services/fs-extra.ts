let fs: any

// TODO improve this ugly thing
//console.log(__filename)
try {
	fs = require('../../../../../../cli-toolbox/fs/extra')
}
catch {
	fs = require('../../../../../../../cli-toolbox/fs/extra')
}

export default fs
