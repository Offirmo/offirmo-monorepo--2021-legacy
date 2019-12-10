function createCatcher({decorators = [], onError, debugId = '?'} = {}) {

	return (err) => {
		//console.info(`[catchFactory from ${debugId}]`)

		err = decorators.reduce((err, decorator) => {
			try {
				err = decorator(err)
				if (!err.message)
					throw new Error()
			}
			catch (e) {
				console.error(`catchFactory exec from ${debugId}: bad decorator!`, err, e)
			}
			return err
		}, err)

		if (onError)
			return onError(err)
		throw err // or rethrow since still unhandled
	}
}

export {
	createCatcher,
}
