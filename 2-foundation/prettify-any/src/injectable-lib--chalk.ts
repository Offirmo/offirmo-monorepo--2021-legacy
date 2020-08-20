// to make this lib isomorphic, we allow dependency injections

////////////////////////////////////////////////////////////////////////////////////

let chalk: any = null

export function inject_lib__chalk(chalk_lib: any) {
	chalk = chalk_lib
}

export function get_lib__chalk(): any {
	return chalk
}
