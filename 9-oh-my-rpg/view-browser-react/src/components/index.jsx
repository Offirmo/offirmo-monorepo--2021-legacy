import React, { Component } from 'react'

import BurgerMenuWrapper from './burger-menu-wrapper'
import OMR from './omr'
import OhMyRPGUIContextProvider from './state-context'

import './index.css'
import ErrorBoundary from '@offirmo/react-error-boundary'

export class OhMyRpgUI extends Component {
	// TODO listen to errors and suggest a refresh?

	render() {
		return (
			<OhMyRPGUIContextProvider>
				<BurgerMenuWrapper
					logo={this.props.logo}
					burgerPanelContent={this.props.burgerPanelContent}
					mainContent={<OMR {...this.props} />}
				/>
			</OhMyRPGUIContextProvider>
		)
	}
}

export default OhMyRpgUI



{"schema_version":6,"revision":88,"uuid":"uu14KZJb9EvCVVA8E4xUGrRz","creation_date":"20180625_22h42","avatar":{"schema_version":2,"revision":51,"name":"Perte","klass":"novice","attributes":{"level":3,"health":9,"mana":13,"strength":7,"agility":6,"charisma":5,"wisdom":11,"luck":4}},"inventory":{"schema_version":1,"revision":0,"unslotted_capacity":20,"slotted":{"weapon":{"element_type":"item","uuid":"uu1FOR_cIjFdOlwzbRUtnIgz","slot":"weapon","quality":"uncommon","base_hid":"knife","qualifier1_hid":"steel","qualifier2_hid":"cruel_tyrant","base_strength":18,"enhancement_level":0},"armor":{"base_hid":"mantle","qualifier1_hid":"practical","qualifier2_hid":"warfield_king","element_type":"item","uuid":"uu1TI0Jo1wVKmpilUU5N28r3","slot":"armor","quality":"rare","base_strength":18,"enhancement_level":0}},"unslotted":[{"slot":"weapon","base_hid":"axe","qualifier1_hid":"brass","qualifier2_hid":"pirate","element_type":"item","uuid":"uu1Ifmd8Tb0eHm_UumvPo_ZW","quality":"uncommon","base_strength":11,"enhancement_level":0}]},"wallet":{"schema_version":1,"revision":0,"coin_count":2648,"token_count":5},"prng":{"schema_version":2,"revision":0,"seed":-1163955302,"use_count":488,"recently_encountered_by_id":{"adventure_archetype--good":["ate_zombie","sentients_killing","fight_won_any","fight_won_coins","class_master_second_attr","village_farmwork","found_white_mushroom","fight_lost_shortcoming","found_vermilion_potion","fate_sword","wise_wisewood_tree","bad_village","meet_old_wizard","fight_won_loot","vampire_castle","treasure_in_pots","found_yellow_mushroom","stare_cup","always_keep_potions","class_master_primary_attr_1"],"adventure_archetype--bad":[]}},"energy":{"schema_version":1,"revision":74,"max_energy":7,"base_energy_refilling_rate_per_day":7,"last_date":"ts1_20180923_22h29:57.056","last_available_energy_float":8},"last_adventure":{"uuid":"uu1UKOZVJ9eZ2bpVlEMEzWuf","hid":"bad_6","good":false,"gains":{"level":0,"health":0,"mana":0,"strength":0,"agility":0,"charisma":0,"wisdom":0,"luck":0,"coin":0,"token":0,"armor":null,"weapon":null,"armor_improvement":false,"weapon_improvement":false}},"click_count":74,"good_click_count":71,"meaningful_interaction_count":88}
