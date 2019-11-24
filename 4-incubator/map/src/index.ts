import { PUBLIC_TRANSPORT } from './public-transport'
import * as xxx from './stops.geo.json'

const map = L.map('mapid').setView([
	-33.8511997,
	151.1450043,
], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	//attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.geoJSON(xxx).addTo(map);

/*
const MAPBOX_TOKEN = 'pk.eyJ1Ijoib2ZmaXJtbyIsImEiOiJjaXprdm10ZXMwMGd6MzJvMXMxYWk3bmN3In0.fcWB3oi-cE0b2g0VvuObFw'
L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`, {
	 //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	 maxZoom: 18,
	 id: 'mapbox.streets',
	 accessToken: MAPBOX_TOKEN
}).addTo(map);*/

console.log(xxx)
