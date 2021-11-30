console.log('Hello, world!')


/////////////////////

const WORLD_SIZE = 12 // width of the cube

/////////////////////

function create_grid() {
	const side = WORLD_SIZE
	return Array.from({length: 4 * side}, (item, x) => {
		return Array.from({length: 3 * side}, (item, y) => {
			return `(${x},${y})`
		})
	})
}
//console.log('grid', create_grid())

/////////////////////

function get_euclidian_distance(x1, y1, x2, y2) {
	return Math.sqrt(
		Math.pow(x2 - x1, 2)
		+ Math.pow(y2 - y1, 2)
	)
}

/////////////////////

function get_cell__dev__memory(x, y) {
	const cube_width = WORLD_SIZE

	//   1      <-- north pole
	// 2 3 4 5  <-- equator etc.
	//     6    <-- south pole

	const flattened_cube_x = Math.floor(x / cube_width)
	const flattened_cube_y = Math.floor(y / cube_width)

	if (x % cube_width === 0) {
		console.log(`------- cube face #${flattened_cube_x} -------`)
	}

	const is_in_top_third = (y / cube_width) < 1
	const is_in_bottom_third = (y / cube_width) >= 2

	console.log('get_cell__dev__memory', {
		x,
		y,
		flattened_cube_x,
		flattened_cube_y,
		is_in_top_third,
		is_in_bottom_third,
	})

	let result = null

	if (flattened_cube_y === 0 && flattened_cube_x !== 1) {
		// not on one of the face
	}
	else if (flattened_cube_y === 2 && flattened_cube_x !== 2) {
		// not on one of the face
	}
	else {
		let cube_face_index = is_in_top_third
			? 1
			: is_in_bottom_third
				? 6
				: flattened_cube_x + 2

		const half_section = cube_width / 2
		const north_pole_x = Math.floor(cube_width + half_section)
		const north_pole_y = Math.floor(half_section)
		const south_pole_x = Math.floor(2 * cube_width + half_section)
		const south_pole_y = Math.floor(2 * cube_width + half_section)

		const euclidian_distance_from_north_pole = get_euclidian_distance(x, y, north_pole_x, north_pole_y)
		const euclidian_distance_from_south_pole = get_euclidian_distance(x, y, south_pole_x, south_pole_y)
		const true_distance_from_north_pole = is_in_top_third
			? euclidian_distance_from_north_pole // same square
			: is_in_bottom_third
				? (half_section + cube_width + half_section - euclidian_distance_from_south_pole)
				: get_euclidian_distance(north_pole_x, y, north_pole_x, north_pole_y) // pretend we're adjacent square
		const true_distance_from_south_pole = is_in_bottom_third
			? euclidian_distance_from_south_pole
			: is_in_top_third
				? (half_section + cube_width + half_section - euclidian_distance_from_north_pole)
				: get_euclidian_distance(south_pole_x, y, south_pole_x, south_pole_y)

		const max_distance_to_a_pole = get_euclidian_distance(north_pole_x, Math.floor(cube_width + half_section), north_pole_x, north_pole_y)
		console.log({ cube_width, half_section, max_distance_to_a_pole })

		const biome = (() => {
			const true_distance_to_closest_pole = Math.min(true_distance_from_north_pole, true_distance_from_south_pole)
			if (true_distance_to_closest_pole <= 2)
				return 'polar'

			if (true_distance_from_north_pole === max_distance_to_a_pole)
				return 'barren'

			return 'sea'
		})()

		const emoji = (() => {
			const true_distance_to_closest_pole = Math.min(true_distance_from_north_pole, true_distance_from_south_pole)

			if (is_in_top_third && (y % cube_width) === Math.floor(half_section / 3) && (x % cube_width) === Math.floor(half_section))
				return '🧊'

			if (is_in_bottom_third && (y % cube_width) === Math.floor(half_section / 3) && (x % cube_width) === Math.floor(half_section))
				return '🧊'

			if (true_distance_to_closest_pole === 0)
				return '⛳️'

			return ''
		})()

		result = {
			exists: true,
			discovered: true,
			visible: true,
			biome,
			text: `E.d. = [${euclidian_distance_from_north_pole.toPrecision(2)}:${euclidian_distance_from_south_pole.toPrecision(2)}]
T.d. = {${true_distance_from_north_pole.toPrecision(2)}:${true_distance_from_south_pole.toPrecision(2)}}
cube_face_index = ${cube_face_index}`,
			emoji,
		}
	}

	return result
}

/////////////////////

function _render_td‿inner_html({
		getter,
	},
	x, y
) {
	const classes = []

	const cell = getter(x, y)
	if (!cell)
		classes.push('void')
	else if (!cell.discovered) {
		classes.push('undiscovered')
	}
	else {
		classes.push(`biome--${cell.biome}`)
		if (!cell.visible)
			classes.push('fog')
	}

	let text = `(${x},${y}):
${cell?.text ?? ''}`
	return `
<td class="${classes.join(' ')}" title="${text}">
	${cell?.emoji ?? ''}
</td>
`
}

function _render_tr‿inner_html({
		width,
		getter,
		x_start,
	},
	y) {
	console.group(`row ${y}…`)
	const result = `
<tr>
	<th scope="row">${y}</th>
	${Array.from({length: width})
		.map((_, x) => _render_td‿inner_html({getter}, x_start + x, y))
		.join('')
	}
</tr>
`
	console.groupEnd()
	return result
}

function _render_grid({
	width,
	height,
	getter,
	caption,
	x_start = 0,
	y_start = 0,
}) {
	console.groupCollapsed(`Rendering grid "${caption}"…`)
	console.log('parameters=', {
		width,
		height,
		getter,
		caption,
		x_start,
		y_start,
	})
	const table = document.createElement('table')
	table.classList.add('gridⵧsquare')
	table.innerHTML = `
<caption>${caption}</caption>
<thead>
	<tr>
		<th scope="col">(x, y)</th>
		${Array.from({length: width})
			.map((_, x) => `<th scope="col">${x_start + x}</th>`)
			.join('\n')
		}
</thead>
<tbody>
	${Array.from({length: height})
		.map((_, y) => _render_tr‿inner_html({
				width,
				getter,
				x_start,
			},
			y_start + y,
		))
		.join('')
	}
</tbody>
	`
	console.groupEnd()
	return table
}

function render() {
	document.body.appendChild(_render_grid({
		width: 4 * WORLD_SIZE,
		height: 3 * WORLD_SIZE,
		getter: get_cell__dev__memory,
		caption: 'dev version -- memory',
	}))
	document.body.appendChild(_render_grid({
		width: 4 * WORLD_SIZE,
		height: 3 * WORLD_SIZE,
		getter: get_cell__dev__memory,
		caption: 'dev version -- debug',
	}))
	document.body.appendChild(_render_grid({
		width: 4 * WORLD_SIZE,
		height: 3 * WORLD_SIZE,
		getter: get_cell__dev__memory,
		caption: 'player version -- full planet',
	}))
	document.body.appendChild(_render_grid({
		width: 4 * WORLD_SIZE,
		height: 3 * WORLD_SIZE,
		getter: get_cell__dev__memory,
		caption: 'player version -- current area',
	}))
	document.body.appendChild(_render_grid({
		width: 12,
		height: 12,
		getter: get_cell__dev__memory,
		caption: 'player version -- exploration',
	}))
}

/////////////////////

render()
