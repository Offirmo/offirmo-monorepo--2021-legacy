const termImg = require('term-img')

const {
	BiomeId,
	BACKGROUNDS,
	get_backgrounds_for_biome,
	get_background_url,
	get_background_matching,
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

function display_bg(bg) {
	console.log(termImg(get_background_url(bg), OPTIONS))
}
display_bg(grassland_bgs[0])

console.log('ex. biome1+settlement -> biome1 -> biome1+transition/biome2 -> biome2')
display_bg(get_background_matching({
	biome_id: BiomeId.terrestrialⵧgrassland,
	features_settlement: true,
}))
display_bg(get_background_matching({
	biome_id: BiomeId.terrestrialⵧgrassland,
}))
display_bg(get_background_matching({
	biome_id: BiomeId.terrestrialⵧgrassland,
	transitions_to: BiomeId.terrestrialⵧforestⵧgreen,
}))
display_bg(get_background_matching({
	biome_id: BiomeId.terrestrialⵧforestⵧgreen,
}))
