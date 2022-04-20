import { Enum } from 'typescript-string-enums'
import { ReleaseChannel } from '@online-adventur.es/api-interface'

/////////////////////////////////////////////////

export const CHANNEL: ReleaseChannel = (() => {
	/*console.log('CHANNEL detection', {
		'process.env.CHANNEL': process.env.CHANNEL,
		'process.env.AWS_SECRET_ACCESS_KEY': process.env.AWS_SECRET_ACCESS_KEY,
		'process.env.NODE_ENV': process.env.NODE_ENV,
	})*/
	if (Enum.isType(ReleaseChannel, process.env.CHANNEL))
		return process.env.CHANNEL as ReleaseChannel

	if (process.env.AWS_SECRET_ACCESS_KEY)
		return ReleaseChannel.prod

	return process.env.NODE_ENV === 'development'
		? ReleaseChannel.dev
		: ReleaseChannel.prod
})()
