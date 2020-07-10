'use strict'

/*
function be_naughty_sync({x}) {
    // 🤕 throw synchronously
    if (!x) {
        // 🤕 throw generic error, unclear
        // 🤕 and not even throwing a proper error!
        throw 'Bad arg!'
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(42), 100)
    })
}*/

function foo_sync({x}) {
	if (!x) {
		// 🤕 throw generic error, unclear
		throw new Error('Bad arg!')
	}

	return 42
}

async function foo_async() {
	return new Promise((resolve, reject) => {
		setTimeout(() => reject(new Error('failed to do X in time')), 100) // unclear error message
	})
}

export {
	foo_sync,
	foo_async,
}
