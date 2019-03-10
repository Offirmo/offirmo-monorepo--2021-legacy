
const ENTRY_POINT = '_dc'


export function attach(debugCommands: { [name: string]: () => void }) {
	console.log('DEBUG attaching...');

	const experiments = (function spyAccessors(x) {
		const handler = {
			get(target: any, propKey: string) {
				console.log('DEBUG access', { debugCommands, target, propKey /*, receiver*/ });
				if (propKey in debugCommands)
					debugCommands[propKey]()
				else
					console.log(propKey)

				return 'done.';
			},
		};
		return new Proxy(x, handler);
	})({});

	Object.defineProperty(window, ENTRY_POINT, {
		enumerable: false, // hidden by discretion
		value: experiments,
	});
}
