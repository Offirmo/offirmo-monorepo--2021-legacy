const stylizeString = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')
const columnify = require('@offirmo/cli-toolbox/string/columnify')

const PKG_JSON = require('../package.json')

console.log(boxify(`
import { create as create_chat } from '${stylizeString.bold(PKG_JSON.name)}'

const chat = create_chat({
    DEBUG,
    gen_next_step,
    ui,
    inter_msg_delay_ms = 0,
    after_input_delay_ms = 0,
    prettify_json = null,
  })

chat.start()
  .then(() => console.log('bye'))
  .catch(console.error)
`.trim()))

console.log(boxify(`
function* gen_next_step() {
  
  yield {
    msg_main: 'Waking up...',
    type: 'progress', // or a promise:
    progress_promise: ...,
    duration_ms: 2000,
    callback: success => console.log(\`[callback called: \${success}]\`),
    msgg_acknowledge: success => success ? 'Awoken!' : 'Slumbering forever.',
  }

  yield {
    msg_main: 'Hello',
    type: 'simple_message',
  }

  yield {
      type: 'ask_for_string',
      msg_main: 'What's your name?',
      msgg_as_user: value => \`My name is "\${value}".\`,
      msgg_acknowledge: name => \`Thanks for the answer, \${name}!\`,
      callback: value => { state.name = value }
    },
  
  yield {
    msg_main: 'What do you want to do?',
    callback: value => state.mode = value,
    choices: [
      {
        msg_cta: 'Play',
        value: 'play',
        msgg_as_user: () => 'Let’s play!',
      },
      {
        msg_cta: 'Manage Inventory',
        value: 'inventory',
        msgg_as_user: () => 'Let’s sort out my stuff.',
      },
      {
        msg_cta: 'Manage Character',
        value: 'character',
        msgg_as_user: () => 'Let’s see how I’m doing!',
      },
    ]
  }
}
`.trim()))
