const NOT_DEAD = 'not dead'

function merge_browserslist_queries(...queries_to_merge) {
	const result = []
	let has_not_dead = false

	queries_to_merge.forEach(queries => {
		has_not_dead = has_not_dead || queries.includes(NOT_DEAD)
		result.push(...queries.filter(q => q !== NOT_DEAD))
	})

	if (has_not_dead)
		result.push(NOT_DEAD)

	return result
}

module.exports = {
	NOT_DEAD,
	merge_browserslist_queries,
}
