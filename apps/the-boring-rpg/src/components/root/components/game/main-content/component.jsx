import React from 'react';
import { once } from 'lodash'

import ExplorePanel from '../../../../panels/explore'
import CharacterPanel from '../../../../panels/character'
import InventoryPanel from '../../../../panels/inventory'
//import GroupChatPanel from '../../../../panels/group-chat'

import './index.css'


function add_tlkio_script() {
	console.info('adding tlk.io')
	// https://stackoverflow.com/a/26478358/587407
	const elem = document.createElement('script')
	elem.type = 'text/javascript'
	elem.async = true
	elem.src = `${document.location.protocol || 'https:'}//tlk.io/embed.js`
	const scripts = document.getElementsByTagName('script')[0].parentNode
	scripts.appendChild(elem)
}
const add_tlkio_script_once = once(add_tlkio_script)

function GroupChatPanel({channel_name = 'the-boring-rpg-reloaded', user_name = 'anonymous'} = {}) {
	setTimeout(() => {
		add_tlkio_script_once()
	}, 2000)
	return (
		<div className="tbrpg-group-chat">
			<div id="tlkio"
				  data-theme="theme--night"
				  data-channel={channel_name}
				  data-nickname={user_name} />
		</div>
	)
}
// 			<GroupChatPanel />

const MODE_TO_PANEL = {
	'explore': <ExplorePanel />,
	'character': <CharacterPanel />,
	'inventory': <InventoryPanel />,
}

export default function UniverseAnchor({mode, is_chat_open}) {
	return (
		<div key="background-picture"
			  className="omr⋄plane⁚immersion omr⋄full-size-fixed-layer omr⋄bg⁚cover tbrpg⋄bg-image⁚fields_of_gold">


			<div key="content-area" className="omr⋄content-area">
				{MODE_TO_PANEL[mode] || <ExplorePanel />}
			</div>

		</div>
	)
}
