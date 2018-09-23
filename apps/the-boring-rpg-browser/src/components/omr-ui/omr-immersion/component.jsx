import React from 'react'

import ExplorePanel from '../../panels/explore'
import CharacterPanel from '../../panels/character'
import InventoryPanel from '../../panels/inventory'
//import EnergyIndicator from '../../../../energy-indicator'

import './index.css'

const MODE_TO_PANEL = {
	'explore': <ExplorePanel />,
	'character': <CharacterPanel />,
	'inventory': <InventoryPanel />,
}

export default function MainArea({mode, background, is_chat_open}) {
	const bg_class = `tbrpg⋄bg-image⁚${background}`
	return (
		<div className="omr⋄content-area main-area">

			<div key="background" className="omr⋄full-size-fixed-layer omr⋄bg-image⁚tiled-marble_black">
				<div key="background-picture"
					className={`omr⋄full-size-background-layer omr⋄bg⁚cover ${bg_class}`} />
			</div>

			<div key="content-area" className="o⋄pos⁚rel o⋄top-container o⋄centered-article">
				{MODE_TO_PANEL[mode] || <ExplorePanel />}
			</div>

			{/*<EnergyIndicator />*/}
		</div>
	)
}
{"schema_version":6,"revision":152,"uuid":"uu1e392LZMtxXIO3poY3TNlq","creation_date":"20180625_07h04","avatar":{"schema_version":2,"revision":66,"name":"Perte","klass":"hunter","attributes":{"level":6,"health":9,"mana":11,"strength":12,"agility":8,"charisma":10,"wisdom":9,"luck":6}},"inventory":{"schema_version":1,"revision":0,"unslotted_capacity":20,"slotted":{"weapon":{"element_type":"item","uuid":"uu18OOSuOe5K5HmqlHWlzg8X","slot":"weapon","quality":"uncommon","base_hid":"longsword","qualifier1_hid":"composite","qualifier2_hid":"destructor","base_strength":16,"enhancement_level":1},"armor":{"base_hid":"gloves","qualifier1_hid":"consecrated","qualifier2_hid":"warrior","element_type":"item","uuid":"uu1xg_lzUm88_JEgGgkRQoTI","slot":"armor","quality":"rare","base_strength":14,"enhancement_level":0}},"unslotted":[{"base_hid":"shoulders","qualifier1_hid":"scale","qualifier2_hid":"defender","element_type":"item","uuid":"uu14hed5jLdeU9s2yDuEpQkV","slot":"armor","quality":"uncommon","base_strength":13,"enhancement_level":0}]},"wallet":{"schema_version":1,"revision":0,"coin_count":2380,"token_count":6},"prng":{"schema_version":2,"revision":0,"seed":1950255707,"use_count":646,"recently_encountered_by_id":{"adventure_archetype--good":["fight_lost_any","gehennom","famous_stone_sapphire","fight_won_loot","so_many_potions","colossal_cave","found_black_mushroom","found_white_mushroom","famous_stone_emerald","found_swirling_potion","erika","meet_old_wizard","chicken_slayer","fight_won_any","always_keep_potions","capital_royal_road","huge_tower","older","ate_bacon","sentients_killing"],"adventure_archetype--bad":[]}},"energy":{"schema_version":1,"revision":133,"max_energy":7,"base_energy_refilling_rate_per_day":7,"last_date":"ts1_20180923_06h23:28.212","last_available_energy_float":6.511423},"last_adventure":{"uuid":"uu1lK3XcAUBeX~58ZUXKVUlk","hid":"sentients_killing","good":true,"gains":{"level":0,"health":0,"mana":0,"strength":0,"agility":1,"charisma":0,"wisdom":0,"luck":0,"coin":128,"token":0,"armor":null,"weapon":null,"armor_improvement":false,"weapon_improvement":false}},"click_count":133,"good_click_count":88,"meaningful_interaction_count":152}
