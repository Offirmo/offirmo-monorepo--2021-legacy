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




https://www.schlockmercenary.com/2016-07-24

http://craig-russell.co.uk/2016/01/29/service-worker-messaging.html

TODO https://developers.google.com/web/updates/2018/10/intl-relativetimeformat
TODO https://segment.com/product/connections/
TODO https://frontarm.com/articles/react-context-performance/

transitions https://css-tricks.com/animate-images-and-videos-with-curtains-js/

https://pusher.com/features
https://pushjs.org/docs/permissions

TODO ui npm
- https://github.com/RonenNess/RPGUI
- https://github.com/Tuxemon/Tuxemon
- http://www.mapeditor.org/

items
https://opengameart.org/content/flare-item-variation-60x60-only

effects https://yoksel.github.io/svg-gradient-map/#/
text effect http://www.brutalistframework.com/bfx#curved

fonts
 https://pixelbuddha.net/freebie/jelani-display-font
 https://www.graphicdesignfreebies.com/home/2018/4/2/eisley-claise-handwriting-font
 https://www.behance.net/gallery/72491031/WANDERLUST-FREE-FONT
 
TODO bg switching effects https://tympanus.net/codrops/2018/04/10/webgl-distortion-hover-effects/

		"fetchival": "^0.3",
		"semver": "^6",
		"style-loader": "^0.23",
		"tslib": "^1",
		"universal-analytics": "^0.4",