const fs = require('fs')
const assert = require('assert')
const parse = require('csv-parse/lib/sync')
const json = require('../../../../cli-toolbox/fs/json')
const { dump_prettified_any, prettify_json } = require('@offirmo-private/prettify-any')



// raw data
let STOPS
let TRAIN_SEGMENTS
let TRAM_SEGMENTS

// derived data
const STOPS_BY_ID = {}
const STOPS_BY_STOP_I = {}
const RAIL_STOPS_I = new Set()
const TRAM_STOPS_I = new Set()


async function load_stops() {
	console.log('* Reading stops...')
	STOPS = await json.read(__dirname + '/../src2/sydney/STOPS.geojson')

	assert(STOPS.type === 'FeatureCollection')
	//console.log(STOPS.features[0])

	STOPS.features.forEach((feature, index) => {

		try {
			assert(feature.geometry.type === 'Point')
			assert(feature.properties.stop_I)
			STOPS_BY_ID[feature.id] = feature
			STOPS_BY_STOP_I[feature.properties.stop_I] = feature
		}
		catch (err) {
			console.error(`On stop #${index}`, feature)
			throw err
		}
	})
	//dump_prettified_any('data', data)
	//console.log('aa', prettify_json(data))
}

async function extract_network_rail() {
	console.log('* Reading rail network...')
	return new Promise(resolve => {
		fs.readFile('./src2/sydney/network_rail.csv', 'utf8', (err, data) => {
			if (err) throw err

			const records = parse(data, {
				cast: true,
				columns: true,
				delimiter: ';',
				//skip_empty_lines: true
			})
			TRAIN_SEGMENTS = records

			//console.log(records[0])
			records.forEach((segment, index) => {
				try {
					const { from_stop_I, to_stop_I } = segment
					assert(STOPS_BY_STOP_I[from_stop_I])
					assert(STOPS_BY_STOP_I[to_stop_I])
					//console.log(from_stop_I, '->', to_stop_I)
					RAIL_STOPS_I.add(String(from_stop_I))
					RAIL_STOPS_I.add(String(to_stop_I))
				}
				catch (err) {
					console.error(`On rail segment #${index}`, segment)
					throw err
				}
			})
			//console.log(records)

			resolve()
		})
	})
}

async function extract_network_tram() {
	console.log('* Reading tram network...')
	return new Promise(resolve => {
		fs.readFile('./src2/sydney/network_tram.csv', 'utf8', (err, data) => {
			if (err) throw err

			const records = parse(data, {
				cast: true,
				columns: true,
				delimiter: ';',
				//skip_empty_lines: true
			})
			TRAM_SEGMENTS = records

			//console.log(records[0])
			records.forEach((segment, index) => {
				try {
					const { from_stop_I, to_stop_I } = segment
					assert(STOPS_BY_STOP_I[from_stop_I])
					assert(STOPS_BY_STOP_I[to_stop_I])
					//console.log(from_stop_I, '->', to_stop_I)
					TRAM_STOPS_I.add(String(from_stop_I))
					TRAM_STOPS_I.add(String(to_stop_I))
				}
				catch (err) {
					console.error(`On tram segment #${index}`, segment)
					throw err
				}
			})
			//console.log(records)

			resolve()
		})
	})
}

async function export_network_rail() {
	console.log('* exporting rail network...')
	const data = {
		type: 'FeatureCollection',
		features: [],
	}

	//console.log(RAIL_STOPS_I)
	RAIL_STOPS_I.forEach(stop_I => {
		//console.log(stop_I)
		data.features.push(STOPS_BY_STOP_I[stop_I])
	})

	TRAIN_SEGMENTS.forEach((train_segment, index) => {
		try {
			const { from_stop_I, to_stop_I } = train_segment
			data.features.push({
				"type": "Feature",
				//"properties": {"party": "Republican"},
				"geometry": {
					"type": "LineString",
					"coordinates": [
						STOPS_BY_STOP_I[from_stop_I].geometry.coordinates,
						STOPS_BY_STOP_I[to_stop_I].geometry.coordinates,
					]
				}
			})
		}
		catch (err) {
			console.error(`On train segment #${index}`, train_segment)
			throw err
		}
	})


	await json.write(__dirname + '/../src/generated/network_rail.json', data)
}

async function export_network_tram() {
	console.log('* exporting tram network...')
	const data = {
		type: 'FeatureCollection',
		features: [],
	}

	//console.log(RAIL_STOPS_I)
	TRAM_STOPS_I.forEach(stop_I => {
		//console.log(stop_I)
		data.features.push(STOPS_BY_STOP_I[stop_I])
	})

	TRAM_SEGMENTS.forEach((segment, index) => {
		try {
			const { from_stop_I, to_stop_I } = segment
			data.features.push({
				"type": "Feature",
				//"properties": {"party": "Republican"},
				"geometry": {
					"type": "LineString",
					"coordinates": [
						STOPS_BY_STOP_I[from_stop_I].geometry.coordinates,
						STOPS_BY_STOP_I[to_stop_I].geometry.coordinates,
					]
				}
			})
		}
		catch (err) {
			console.error(`On tram segment #${index}`, segment)
			throw err
		}
	})


	await json.write(__dirname + '/../src/generated/network_tram.json', data)
}

load_stops()
	.then(extract_network_rail)
	.then(export_network_rail)
	.then(extract_network_tram)
	.then(export_network_tram)
	.then(() => console.log('* done'))


