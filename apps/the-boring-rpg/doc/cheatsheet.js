const stylizeString = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')

// https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/
// https://medium.freecodecamp.org/css-naming-conventions-that-will-save-you-hours-of-debugging-35cea737d849
console.log(boxify(`
${stylizeString.bold('BEM')}
.block {}
.block__element {}
.block--modifier {}

.person {}
.person__hand {}
.person--female {}
.person--female__hand {}
.person__hand--left {}
`.trim()))
