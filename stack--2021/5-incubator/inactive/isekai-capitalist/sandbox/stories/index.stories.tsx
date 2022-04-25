import { useState, useReducer } from 'react'
import { Story, Meta } from '@storybook/react'

import { Enum } from 'typescript-string-enums'
import { to_react } from '@offirmo-private/rich-text-format-to-react'

import WithIphoneNotches from '@offirmo-private/storybook--utils/src/wrapper--with-iphone-notches'

import WithOffirmoCssSetup from '@offirmo-private/ui--browser--css/.storybook/wrapper--with-offirmo-css-setup'
import WithBodyFullWidth from '@offirmo-private/ui--browser--css/.storybook/wrapper--with-body-full-width'

//import { default_viewport__mobile } from '../../../../0-meta/storybook-viewports'

import { LIB } from '../src/consts'
import init_SEC from '../src/services/sec'
import '@oh-my-rpg/ui--browser--css/src/style.css'
import './index.css'

init_SEC()

////////////////////////////////////////////////////////////////////////////////////

export default {
	title: LIB,
	//component: Component,
	argTypes: {
		//backgroundColor: { control: 'color' },
	},
	decorators: [
		(Story) => (<WithOffirmoCssSetup dark_theme_id='dark--colorhunt212'>{Story()}</WithOffirmoCssSetup>),
	],
} as Meta

////////////////////////////////////////////////////////////////////////////////////

export function Default() {
	return (
		<main>
			Hello, world!
		</main>
	)
}

////////////////////////////////////////////////////////////////////////////////////
import {
	DOC_DEMO_BASE_TYPES,
	DOC_DEMO_ADVANCED_TYPES,
	DOC_DEMO_HINTS,
	DOC_DEMO_RPG_01,
	DOC_DEMO_RPG_02,
	DOC_DEMO_RPG_03,
	DOC_DEMO_INVENTORY,
} from '../../../../3-advanced--multi/rich-text-format/doc/examples'

export function RichText() {
	return (
		<main>
			{to_react(DOC_DEMO_BASE_TYPES,     undefined, { key: 'BASE_TYPES'})}
			{to_react(DOC_DEMO_ADVANCED_TYPES, undefined, { key: 'ADVANCED_TYPES'})}
			{to_react(DOC_DEMO_INVENTORY,      undefined, { key: 'INVENTORY'})}
		</main>
	)
}


////////////////////////////////////////////////////////////////////////////////////
import { SSRRank, render as render_ssr_rank } from '../src/type--SSR-rank'

export function TypeꓽGuildRank() {
	return (
		<main>
			{
				Enum.keys(SSRRank).map(rank => <div key={rank}>Adventurers Guild rank: {to_react(render_ssr_rank(rank))}</div>)
			}
		</main>
	)
}

////////////////////////////////////////////////////////////////////////////////////
import { RelationshipLevel, render as render_relationship_level } from '../src/type--relationship-level'

export function TypeꓽRelationshipLevel() {
	return (
		<main>
			{
				Enum.keys(RelationshipLevel).map(lvl => <div key={lvl}>Relationship level: {to_react(render_relationship_level(lvl))}</div>)
			}
		</main>
	)
}

////////////////////////////////////////////////////////////////////////////////////
import { Immutable } from '@offirmo-private/ts-types/src'
import { State } from '../src/state/types'
import { Action } from '../src/state/actions/types'
import { create, randomize_post_create, reduceⵧupdate_to_now } from '../src/state/reducers'
import { create_flux_instance } from '../src/flux/flux'
import { get_available_actions } from '../src/state/actions/selectors'
import { get_lib_SEC } from '../src/flux/sec'
import { reduce_action } from '../src/state/actions/reducers'
import { render as render_state } from '../src/state/selectors--rich-text'
import { render_action } from '../src/state/actions/selectors--rich-text'

export function StateꓽOverall() {
	const state = create()

	return (
		<main>
			{
				to_react(render_state(state))
			}
		</main>
	)
}

export function Game() {
	/*const flux = create_flux_instance({
		SCHEMA_VERSION: 0,
		local_storage: window.localStorage,
		storage_key_radix: 'sandboxⵧstorybook',
		migrate_to_latest: (SEC: any, legacy_state: any) => legacy_state as State,
		create,
		post_create: randomize_post_create,
		reduce_action,
		update_to_now: reduceⵧupdate_to_now,
	})
	const state = flux.get()
	console.log('from flux', {state})*/
	const [ state, dispatch ] = useReducer(reduce_action, randomize_post_create(create()))
	console.log('🔄 Game', { state })

	return (
		<main>
			<h1>Isekai</h1>
			<hr />
			{ to_react(render_state(state)) }
			<hr />
			{ get_available_actions(state).map(action => (
				<button key={action.type} onClick={() => dispatch(action)}>
					{to_react(render_action(action, state))}
				</button>
			)) }
		</main>
	)
}
