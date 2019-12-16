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
