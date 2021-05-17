import './index.css'

interface Props {
	who: stringXXX
}

export function HelloWorld({who = 'World'}: Props) {
	return (
		<div>
			Hello, {who}!
		</div>
	)
}

////////////////////////////////////
export type HelloWorldProps = Props
export default HelloWorld
