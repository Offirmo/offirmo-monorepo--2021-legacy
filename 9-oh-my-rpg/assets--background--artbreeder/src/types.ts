import { Enum } from 'typescript-string-enums'

////////////////////////////////////////////////////////////////////////////////////
// We settle on a mix of scientific / common language

// tslint:disable-next-line: variable-name
export const BiomeId = Enum(
	// Terrestrial vs marine
	// https://www.earthrangers.com/our-faves/types-of-biomes-2/
	// - Freshwater, Marine, Desert, Forest, Grassland and Tundra
	// https://en.wikipedia.org/wiki/Biome
	// Temperate deciduous forest, Coniferous forest, Woodland, Chaparral, Tundra, Grassland, Desert, Tropical savanna, Tropical forest
	// boreal, polar

	// We settle on a mix of scientific / common language
	//'terrestrialⵧbarren',
	'terrestrialⵧcave',
	//'terrestrialⵧcoastal',
	'terrestrialⵧforestⵧdark',
	'terrestrialⵧforestⵧgreen',
	'terrestrialⵧforestⵧsnowy',
	'terrestrialⵧforestⵧswamp',
	'terrestrialⵧgrassland',
	'terrestrialⵧmountainⵧgreen',
	'terrestrialⵧmountainⵧsnowy',

	// TODO future
	// https://en.wikipedia.org/wiki/Marine_habitats
	// Littoral, Pelagic, Abyssal
)
export type BiomeId = Enum<typeof BiomeId> // eslint-disable-line no-redeclare

export interface Biome {
	id: BiomeId
	// todo properties
}

export interface Background {
	biome_id: BiomeId
	basename: string
	subfolder?: string // for technical reasons, ex. future transition not yet declared as a BiomeId
	features_settlement: boolean,
	transitions_to: BiomeId | null
}
