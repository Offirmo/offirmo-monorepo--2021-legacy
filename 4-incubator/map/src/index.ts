import NETWORK_RAIL_GEOJSON from './generated/network_rail.json'
import NETWORK_TRAM_GEOJSON from './generated/network_tram.json'

const map = L.map('mapid').setView([
	-33.8511997,
	151.1450043,
], 12)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	//attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

const geojsonMarkerOptions = {
	radius: 7,
	fillColor: '#f5b602',
	color: '#000',
	weight: 1,
	opacity: .7,
	fillOpacity: 0.8,
}

const network_rail = L.geoJSON(NETWORK_RAIL_GEOJSON, {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, geojsonMarkerOptions)
	},
}).addTo(map)


const network_tram = L.geoJSON(NETWORK_TRAM_GEOJSON, {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, geojsonMarkerOptions)
	},
}).addTo(map)


//network_rail.addData(NETWORK_RAIL_GEOJSON)



/*
const MAPBOX_TOKEN = 'pk.eyJ1Ijoib2ZmaXJtbyIsImEiOiJjaXprdm10ZXMwMGd6MzJvMXMxYWk3bmN3In0.fcWB3oi-cE0b2g0VvuObFw'
L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`, {
	 //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	 maxZoom: 18,
	 id: 'mapbox.streets',
	 accessToken: MAPBOX_TOKEN
}).addTo(map);*/

