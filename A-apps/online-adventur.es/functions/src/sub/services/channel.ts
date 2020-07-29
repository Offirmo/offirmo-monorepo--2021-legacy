import { Enum } from 'typescript-string-enums'
import { ReleaseChannel } from '@offirmo-private/functions-interface'

export const CHANNEL: ReleaseChannel = (() => {
	if (Enum.isType(ReleaseChannel, process.env.CHANNEL))
		return process.env.CHANNEL as ReleaseChannel

	if (process.env.AWS_SECRET_ACCESS_KEY)
		return ReleaseChannel.prod

	return process.env.NODE_ENV === 'development'
		? ReleaseChannel.dev
		: ReleaseChannel.prod
})()
