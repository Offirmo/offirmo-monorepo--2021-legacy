```jsx
import { AppStateContext } from '../../../../context'
function InfoBoxC2() {
	return (
		<AppStateContext.Consumer>
			{app_state => {
				...
			}}
		</AppStateContext.Consumer>
	)
}

import { UStateListenerAndProvider } from '../../../../context'

class Connected extends Component {
	render_view = ({ u_state }) => {
		return <View u_state={u_state} />
	}

	render() {
		return (
			<UStateListenerAndProvider render={this.render_view} />
		)
	}
}
```


## tags
top tags https://itch.io/tags

adventure
singleplayer
rpg
fantasy
touch-friendly
boring
casual
classes
clicker
parody
minimalist

exploration


mmorpg
non-linear
open-source
open-world
pvp
real-time
satire
swords
text-based
upgrades

not yet:
crafting
dragons
skeletons
slime
fishing
food
magic
pirates
secrets
procedural

to investigate:
fairy-tale
one-button
touhou



http://craig-russell.co.uk/2016/01/29/service-worker-messaging.html

TODO https://developers.google.com/web/updates/2018/10/intl-relativetimeformat
TODO https://segment.com/product/connections/
TODO https://frontarm.com/articles/react-context-performance/

transitions https://css-tricks.com/animate-images-and-videos-with-curtains-js/

https://pusher.com/features
https://pushjs.org/docs/permissions



		"fetchival": "^0.3",
		"universal-analytics": "^0.4",


		<link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png?v=yyapgPk479">
		<link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png?v=yyapgPk479">
		<link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png?v=yyapgPk479">
		<link rel="manifest" href="favicons/site.webmanifest?v=yyapgPk479">
		<link rel="mask-icon" href="favicons/safari-pinned-tab.svg?v=yyapgPk479" color="#543d46">
		<link rel="shortcut icon" href="favicons/favicon.ico?v=yyapgPk479">
		<meta name="msapplication-TileColor" content="#543d46">
		<meta name="msapplication-config" content="favicons/browserconfig.xml?v=yyapgPk479">
		<meta name="theme-color" content="#543d46">
