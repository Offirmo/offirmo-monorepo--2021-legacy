import {
	APIGatewayEvent,
	Context,
	Response,
	NetlifyHandler,
} from './sub/types'


function filter_out_secrets(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
	return Object.entries(env)
		.map(([k, v]) => {
			const isSecret = k.toLowerCase().includes('secret')
				|| k.toLowerCase().includes('token')
			return [ k, isSecret ? '🙈' : v ]
		})
		.reduce((acc: any, [k, v]: any) => {
			acc[k] = v
			return acc
		}, {} as any)
}

const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	context: Context,
): Promise<Response> => {
	const all_the_things = JSON.stringify({
		context,
		event,
		// https://devdocs.io/node/process
		process: {
			argv: process.argv,
			execArgv: process.execArgv,
			execPath: process.execPath,
			arch: process.arch,
			platform: process.platform,
			release: process.release,
			config: process.config,
			'cwd()': process.cwd(),
			title: process.title,
			version: process.version,
			versions: process.versions,
			env: filter_out_secrets(process.env),
		},
	}, null, 2)

	console.log(all_the_things)

	return {
		statusCode: 200,
		body: all_the_things,
	}
}

export { handler }
