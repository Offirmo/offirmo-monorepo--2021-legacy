import { I18nMessages } from '@offirmo-private/ts-types'

import { ArmorPartType } from '../types'
import en from './i18n_en'
import { ENTRIES } from './entries'

/////////////////////

const i18n_messages: Readonly<I18nMessages> = {
	en,
}

const ARMOR_BASES =
	ENTRIES.filter((armor_component: any) => armor_component.type === ArmorPartType.base) as
		Readonly<{type: 'base', hid: string}>[]
const ARMOR_QUALIFIERS1 =
	ENTRIES.filter((armor_component: any) => armor_component.type === ArmorPartType.qualifier1) as
		Readonly<{type: 'qualifier1', hid: string}>[]
const ARMOR_QUALIFIERS2 =
	ENTRIES.filter((armor_component: any) => armor_component.type === ArmorPartType.qualifier2) as
		Readonly<{type: 'qualifier2', hid: string}>[]


export {
	i18n_messages,

	ARMOR_BASES,
	ARMOR_QUALIFIERS1,
	ARMOR_QUALIFIERS2,
}
