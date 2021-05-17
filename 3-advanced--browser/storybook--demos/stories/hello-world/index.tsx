import './index.css'

interface Props {
	who: string
}

export function HelloWorld({who = 'World'}: Props) {
	if (window?.oᐧextra?.flagꓽdebug_render) console.log('🔄 HelloWorld')

	return (
		<div>
			Hello, {who}!
		</div>
	)
}

////////////////////////////////////
export type HelloWorldProps = Props
export default HelloWorld
