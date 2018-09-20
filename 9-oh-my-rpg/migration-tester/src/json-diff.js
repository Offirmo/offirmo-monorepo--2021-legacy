
function is_uuid_valid(uuid) {
	return (typeof uuid === 'string') && uuid.length === 24
}

const jsondiffpatch = require('jsondiffpatch').create({
	// used to match objects when diffing arrays, by default only === operator is used
	objectHash: function(obj) {
		return JSON.stringify(obj)
	},
	propertyFilter: function(name, context) {
		// this optional function can be specified to ignore object properties (eg. volatile data)
		// name: property name, present in either context.left or context.right objects
		// context: the diff context (has context.left and context.right objects)
		if (name === 'uuid' && is_uuid_valid(context.right.uuid) && is_uuid_valid(context.left.uuid)) {
			// ignore
			return false
		}

		return true
	},
	cloneDiffValues: true /* default false. if true, values in the obtained delta will be cloned
      (using jsondiffpatch.clone by default), to ensure delta keeps no references to left or right objects.
      This becomes useful if you're diffing and patching the same objects multiple times without serializing deltas.
      instead of true, a function can be specified here to provide a custom clone(value)
      */
})

const diff = jsondiffpatch.diff.bind(jsondiffpatch)

module.exports = diff
