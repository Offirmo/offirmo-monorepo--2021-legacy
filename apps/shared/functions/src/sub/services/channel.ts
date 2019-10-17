
export const CHANNEL: string = process.env.CHANNEL || (() => {
		if (process.env.AWS_SECRET_ACCESS_KEY)
			return 'prod'

		return process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
	})()
