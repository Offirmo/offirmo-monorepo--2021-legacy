
const PATCHED_METHODS = [ 'error', 'warn', 'group', 'groupCollapsed', 'groupEnd' ]

let is_installed = false
export default function install({ level = 'warn', original_console = console }: { level?: 'warn' | 'error', original_console?: Console } = {}): void {
	if (is_installed) return

	const ORIGINAL_METHODS: { [k: string]: (...p: any[]) => void } = {}
	PATCHED_METHODS.forEach(k => {
		ORIGINAL_METHODS[k] = (original_console as any)[k]
	})

	let groupDepth = 0;

	function better_group(...p: any[]): void {
		ORIGINAL_METHODS.group(...p)
		groupDepth++
		//console.log('after group', {groupDepth})
	}
	function better_groupCollapsed(...p: any[]): void {
		ORIGINAL_METHODS.groupCollapsed(...p)
		groupDepth++
		//console.log('after groupCollapsed', {groupDepth})
	}
	function better_groupEnd(...p: any[]): void {
		ORIGINAL_METHODS.groupEnd(...p)
		groupDepth = Math.max(0, groupDepth - 1)
		//console.log('after groupEnd', {groupDepth})
	}

	function better_error(...p: any[]): void {
		//console.log('error', {groupDepth})
		while(groupDepth > 0) {
			better_groupEnd()
		}
		ORIGINAL_METHODS.error(...p)
	}
	function better_warn(...p: any[]): void {
		//console.log('warn', {groupDepth})
		while(groupDepth > 0) {
			better_groupEnd()
		}
		ORIGINAL_METHODS.warn(...p)
	}

	console.group = better_group
	console.groupCollapsed = better_groupCollapsed
	console.groupEnd = better_groupEnd
	console.error = better_error
	if (level === 'warn') console.warn = better_warn
}

export { install as improve_console_groups }
