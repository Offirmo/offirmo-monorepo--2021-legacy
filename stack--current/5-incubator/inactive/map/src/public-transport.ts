export const PUBLIC_TRANSPORT: GeoJSON.FeatureCollection = {
	type: 'FeatureCollection',
	features: [
		{
			id: 1234,
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [102.0, 0.5],
			},
			properties: {
				prop0: 'value0',
			},
		},
		{
			id: 'stringid',
			type: 'Feature',
			geometry: {
				type: 'LineString',
				coordinates: [
					[102.0, 0.0],
					[103.0, 1.0],
					[104.0, 0.0],
					[105.0, 1.0],
				],
			},
			properties: {
				prop0: 'value0',
				prop1: 0.0,
			},
		},
		{
			type: 'Feature',
			geometry: {
				type: 'Polygon',
				coordinates: [
					[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
				],
			},
			properties: {
				prop0: 'value0',
				prop1: {
					that: 'this',
				},
			},
		},
	],
}

export default PUBLIC_TRANSPORT
