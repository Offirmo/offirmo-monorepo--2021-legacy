// not a real unit test
// this is a typescript test
import tiny_singleton from '.'

interface Person {
	name: string,
	ask_name: () => string,
}

function create_person(name: string, logger: Console = console): Person {
	return {
		name,
		ask_name() {
			return name
		}
	}
}

const get_person = tiny_singleton(() => create_person('Luke', console))

console.assert(get_person().ask_name() === 'Luke')
console.assert(get_person().ask_name() === 'Luke')

// this line should not compile
//get_person().foo
