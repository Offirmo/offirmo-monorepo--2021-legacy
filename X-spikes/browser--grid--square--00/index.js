console.log('Hello, world!')


/////////////////////

const WORLD_SIZE = 7 // width of the cube

/////////////////////

function create_grid() {
	const side = WORLD_SIZE
	return Array.from({length: 4 * side}, (item, x) => {
		return Array.from({length: 3 * side}, (item, y) => {
			return `(${x},${y})`
		})
	})
}

console.log('grid', create_grid())

/////////////////////

function get_euclidian_distance(x1, y1, x2, y2) {
	return Math.sqrt(
		Math.pow(x2 - x1, 2)
		+ Math.pow(y2 - y1, 2)
	)
}

/////////////////////

function get_dev_cell(x, y) {
	const cube_width = WORLD_SIZE

	//  1    <-- north pole
	// 2345  <-- equator etc.
	//  6    <-- south pole

	const flattened_cube_x = Math.floor(x / cube_width)
	const flattened_cube_y = Math.floor(y / cube_width)

	const is_in_top_third = (y / cube_width) < 1
	const is_in_bottom_third = (y / cube_width) >= 2

	console.log({
		x,
		y,
		flattened_cube_x,
		flattened_cube_y,
		is_in_top_third,
		is_in_bottom_third,
	})

	if (flattened_cube_y === 0 && flattened_cube_x !== 1)
		return null // not on one of the face
	if (flattened_cube_y === 2 && flattened_cube_x !== 1)
		return null // not on one of the face



	/*const is_in_left_quarter = (x / cube_width) < 1
	const is_in_right_third = (x / cube_width) >= 2
	if ((is_in_top_third || is_in_bottom_third) && (is_in_left_quarter || is_in_right_third))
		return null // not on the projection*/

	const half_section = cube_width / 2
	const north_pole_x = Math.floor(cube_width + half_section)
	const north_pole_y = Math.floor(half_section)
	const south_pole_x = Math.floor(cube_width + half_section)
	const south_pole_y = Math.floor(2 * cube_width + half_section)

	const grid_distance_from_north_pole = get_euclidian_distance(x, y, north_pole_x, north_pole_y)
	const grid_distance_from_south_pole = get_euclidian_distance(x, y, south_pole_x, south_pole_y)
	const true_distance_from_north_pole = is_in_top_third
		? grid_distance_from_north_pole
		: is_in_bottom_third
			? (half_section + cube_width + half_section - grid_distance_from_south_pole)
			: get_euclidian_distance(north_pole_x, y, north_pole_x, north_pole_y)
	const true_distance_from_south_pole = is_in_bottom_third
		? grid_distance_from_south_pole
		: is_in_top_third
			? (half_section + cube_width + half_section - grid_distance_from_north_pole)
			: get_euclidian_distance(south_pole_x, y, south_pole_x, south_pole_y)

	const biome = (() => {
		if (true_distance_from_north_pole < 1)
			return 'polar'
		if (true_distance_from_south_pole < 1)
			return 'polar'

		return 'sea'
	})()

	return {
		exists: true,
		discovered: true,
		visible: true,
		biome,
		text: `[${grid_distance_from_north_pole.toPrecision(2)}:${grid_distance_from_south_pole.toPrecision(2)}]
		{${true_distance_from_north_pole.toPrecision(2)}:${true_distance_from_south_pole.toPrecision(2)}}`
	}
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

	return `
<td class="${classes.join(' ')}">
	(${x},${y})<br>${cell?.text ?? ''}
</td>
`
}

function _render_tr‿inner_html({
		width,
		getter,
		x_start,
	},
	y) {
	console.groupCollapsed(`row ${y}…`)
	const result = `
<tr>
	<th scope="row">y=${y}</th>
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
			.map((_, x) => `<th scope="col">x=${x_start + x}</th>`)
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
		getter: get_dev_cell,
		caption: 'dev version',
	}))
}

/////////////////////

render()
