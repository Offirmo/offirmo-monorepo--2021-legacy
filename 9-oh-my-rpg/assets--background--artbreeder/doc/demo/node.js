const termImg = require('term-img')

const {
	BiomeId,
	BACKGROUNDS,
	get_backgrounds_for_biome,
	get_background_url,
} = require('../..')

console.log(`- ${BACKGROUNDS.length} backgrounds`)
console.log(`- ${Object.keys(BiomeId).length} biomes:`)
Object.keys(BiomeId).forEach(biome_id => {
	console.log(`  - ${biome_id}: ${get_backgrounds_for_biome(biome_id).length}`)
})

//console.log(BiomeId)
const grassland_bgs = get_backgrounds_for_biome(BiomeId.terrestrialⵧgrassland)
//console.log(grassland_bgs)

function fallback() {
	// Return something else when not supported
	return "FALLBACK"
}
const OPTIONS = {
	width: '30%',
	height: '30%',
	fallback,
}

console.log(termImg(get_background_url(grassland_bgs[0]), OPTIONS))
/*console.log(termImg(get_background_url(get_backgrounds_matching({
	//biome_id,
	features_settlement: ,
	transitions_to,
	excluding_those_basenames,
})), OPTIONS))
*/
