// https://nodejs.org/api/readline.html
const readline = require('readline')

let rli = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

function ask_question(question) {
	return new Promise((resolve, reject) => {
		rli.clearLine(process.stdout, 0)
		rli.question(question + '\n', answer => {
			console.log(`[You entered: "${answer}"]`)
			//rl.close()
			resolve(answer)
		})
	})
}


module.exports = {
	ask_question,
}
