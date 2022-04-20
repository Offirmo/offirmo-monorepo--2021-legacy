/////////////////////
import { Enum } from 'typescript-string-enums'

///////


/////////////////////

type ActionCallback = () => Promise<void>

interface KeySequence {
	// https://nodejs.org/api/readline.html#readline_rl_write_data_key
	ctrl: boolean // indicate the Ctrl key has been pressed as part of the key sequence.
	meta: boolean // indicate the Meta key has been pressed as part of the key sequence.
	shift: boolean // indicate the Shift key has been pressed as part of the key sequence.
	name: string
}

interface Action {
	rank?: number
	call_to_action: string
	command?: {
		text_full?: string
		text_short?: string
		key_sequence?: KeySequence
	}
	callback: ActionCallback
}

interface Mode<State> {
	recap_message: string
}

/////////////////////

export {
	KeySequence,
	ActionCallback,
	Action,
	Mode,
}

/////////////////////
