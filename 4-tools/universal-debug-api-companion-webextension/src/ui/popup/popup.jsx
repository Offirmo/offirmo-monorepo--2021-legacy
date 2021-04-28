import ReactDOM from 'react-dom'
import ErrorBoundary from '@offirmo-private/react-error-boundary'

import Root from './components/root'
import './popup.css'

////////////////////////////////////

const LIB = '🧩 UWDT/popup'

console.log(`[${LIB}.${+Date.now()}] Hello!`)

////////////////////////////////////

ReactDOM.render(
	<ErrorBoundary name={LIB}>
		<Root />
	</ErrorBoundary>,
	document.getElementById('root'),
)

////////////////////////////////////
