const path = require('path')
const fs = require('fs')

const meow = require('meow')

const { LIB } = require('./consts')

console.log(`🧙️  Hello from ${LIB}!`)

/////////////////////

const cli = meow('create/update a target file from a template, with customizable parts',
	{
		flags: {
			template: {
				type: 'string',
			},
			destination: {
				type: 'string',
			},
			verbose: {
				type: 'boolean'
			}
		},
	}
)

console.log('🐈  meow', {
	cwd: process.cwd(),
	'cli.flags': cli.flags,
})

try {
	assert(cli.flags.template, 'a path to a template must be provided')
	assert(cli.flags.destination, 'a path to a destination must be provided')

	const template_path = path.resolve(process.cwd(), cli.flags.template)
	const destination_path = path.resolve(process.cwd(), cli.flags.destination)

	const template = fs.readFileSync(template_path, 'utf8');
	const existing_target = (() => {
		try {
			return fs.readFileSync(destination_path, 'utf8');
		} catch (err) {
			if (!err.message.startsWith('ENOENT')) {
				throw err
			}
		}
	})()

	const res = apply({
		template,
		existing_target,
	})

	fs.writeFileSync(destination_path, res)
} catch (err) {
	console.error(err)
	cli.showHelp()
}
