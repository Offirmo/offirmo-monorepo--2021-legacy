

type FamilyName = string
type GivenName = string

interface FullName {
	family: FamilyName
	given: GivenName

}


export function get_name(): FullName {
	return {
		family: 'todo',
		given: 'todo',
	}
}
