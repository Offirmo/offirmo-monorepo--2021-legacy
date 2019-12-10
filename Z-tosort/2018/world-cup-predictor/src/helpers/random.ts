
function getRandomIntInclusive(min: number, max: number) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function pickRandom<T>(...choices: T[]): T {
	const min = 0
	const max = choices.length - 1
	return choices[getRandomIntInclusive(min, max)]
}


export {
	getRandomIntInclusive,
	pickRandom,
}
