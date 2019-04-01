/////////////////////

import { I18nMessages } from '@offirmo-private/ts-types'

import { WeaponPartType } from '../types'
import en from './i18n_en'
import { ENTRIES } from './entries'

/////////////////////

const i18n_messages: Readonly<I18nMessages> = {
	en,
}

/////////////////////

const WEAPON_BASES =
	ENTRIES.filter((armor_component: any) => armor_component.type === WeaponPartType.base) as
		{type: 'base', hid: string}[]

const WEAPON_QUALIFIERS1 =
	ENTRIES.filter((armor_component: any) => armor_component.type === WeaponPartType.qualifier1) as
		{type: 'qualifier1', hid: string}[]

const WEAPON_QUALIFIERS2 =
	ENTRIES.filter((armor_component: any) => armor_component.type === WeaponPartType.qualifier2) as
		{type: 'qualifier2', hid: string}[]

/////////////////////

export {
	i18n_messages,

	WEAPON_BASES,
	WEAPON_QUALIFIERS1,
	WEAPON_QUALIFIERS2,
}
