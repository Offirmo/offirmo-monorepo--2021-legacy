import './index.css'

export interface Props {
	who: string
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
