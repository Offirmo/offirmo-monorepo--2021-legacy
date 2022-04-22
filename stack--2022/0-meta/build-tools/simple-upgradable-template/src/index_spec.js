const { expect } = require('chai')

const { LIB } = require('./consts')
const { apply } = require('.')


describe(`${LIB}`, function() {

	describe('common behaviour', function() {

		it('should reject when the template is empty', () => {
			expect(() => apply({
				template: '',
				existing_target: undefined,
			})).to.throw('template should not be empty')
		})

		it('should not rely on EOL when using templates with a end - case #1', () => {
			const template =
	`<!-- OT⋄GENERATED-FROM-TEMPLATE foo v1.2.3 -->/* OT⋄CUSTOM bar *//* OT⋄CUSTOM BEGIN baz *//* OT⋄CUSTOM END baz */`
			const expected_stable_final = ''
				+ '<!-- OT⋄GENERATED-FROM-TEMPLATE foo v1.2.3 -->'
				+ '/* OT⋄CUSTOM BEGIN bar */'
				+ '\n'
				+ '/* OT⋄CUSTOM END bar */'
				+ '/* OT⋄CUSTOM BEGIN baz */'
				+ '\n'
				+ '/* OT⋄CUSTOM END baz */'
			let existing_target = undefined
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should not rely on EOL when using templates with a end - case #2', () => {
			const template =
				`a<!-- OT⋄GENERATED-FROM-TEMPLATE foo v1.2.34 -->b/* OT⋄CUSTOM bar */c/* OT⋄CUSTOM BEGIN baz */d/* OT⋄CUSTOM END baz */e`
			const expected_stable_final = ''
				+ 'a<!-- OT⋄GENERATED-FROM-TEMPLATE foo v1.2.34 -->'
				+ 'b/* OT⋄CUSTOM BEGIN bar */'
				+ '\n'
				+ '/* OT⋄CUSTOM END bar */'
				+ 'c/* OT⋄CUSTOM BEGIN baz */d/* OT⋄CUSTOM END baz */'
				+ 'e'
			let existing_target = undefined
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should NOT add extra whitespaces or EOL', () => {
			const template = `// OT⋄GENERATED-FROM-TEMPLATE foo v1.2.3
// OT⋄CUSTOM bar
// OT⋄CUSTOM BEGIN baz
// OT⋄CUSTOM END baz`
			const expected_stable_final = `// OT⋄GENERATED-FROM-TEMPLATE foo v1.2.3
// OT⋄CUSTOM BEGIN bar
// OT⋄CUSTOM END bar
// OT⋄CUSTOM BEGIN baz
// OT⋄CUSTOM END baz`
			let existing_target = undefined
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should preserve whitespaces or EOL if any (no whitespace)', () => {
			const template = `
// OT⋄GENERATED-FROM-TEMPLATE foo v1.2.3

// OT⋄CUSTOM bar

// OT⋄CUSTOM BEGIN baz

// OT⋄CUSTOM END baz
`
			const expected_stable_final = `
// OT⋄GENERATED-FROM-TEMPLATE foo v1.2.3

// OT⋄CUSTOM BEGIN bar
// OT⋄CUSTOM END bar

// OT⋄CUSTOM BEGIN baz

// OT⋄CUSTOM END baz
`
			let existing_target = undefined
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})
	})

	context('when there is no target', function() {

		it('should work with just a string', () => {
			const template = '\n'
			const expected_stable_final = '\n'
			let existing_target = undefined
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should work with just an element of type GENERATED-FROM-TEMPLATE', () => {
			const template = '// OT⋄GENERATED-FROM-TEMPLATE foo v0.0.0'
			const expected_stable_final = '// OT⋄GENERATED-FROM-TEMPLATE foo v0.0.0'
			let existing_target = undefined
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should work with just an element NOT of type GENERATED-FROM-TEMPLATE', () => {
			const template = '// OT⋄CUSTOM foo bar'
			const expected_stable_final = `// OT⋄CUSTOM BEGIN foo bar
// OT⋄CUSTOM END foo bar`
			let existing_target = undefined
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should suggest a default when there is a default an no existing customisation', () => {
			const template = `
a b c
	// OT⋄CUSTOM BEGIN foo
	example…
	// OT⋄CUSTOM END foo
d e f
`
			let existing_target = undefined
			const expected_stable_final = `
a b c
	// OT⋄CUSTOM BEGIN foo
	example…
	// OT⋄CUSTOM END foo
d e f
`

			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should work with this example', () => {
			const template = `
// OT⋄GENERATED-FROM-TEMPLATE foo v1.2.3
	blah blah
	// OT⋄CUSTOM bar baz
	blih blu`
			let existing_target = undefined
			const expected_stable_final = `
// OT⋄GENERATED-FROM-TEMPLATE foo v1.2.3
	blah blah
	// OT⋄CUSTOM BEGIN bar baz
	// OT⋄CUSTOM END bar baz
	blih blu`
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})
	})

	context('when there is a target', function() {

		it('should work with just a string', () => {
			const template = 'a'
			let existing_target = 'whatever'
			const expected_stable_final = 'a'

			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should work with just an element of type GENERATED-FROM-TEMPLATE', () => {
			const template = '// OT⋄GENERATED-FROM-TEMPLATE foo v0.0.0'
			let existing_target = 'whatever'
			const expected_stable_final = '// OT⋄GENERATED-FROM-TEMPLATE foo v0.0.0'

			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should correctly update GENERATED-FROM-TEMPLATE', () => {
			const template = '// OT⋄GENERATED-FROM-TEMPLATE foo v1.2.0'
			let existing_target = `// OT⋄GENERATED-FROM-TEMPLATE foo v1.0.0
whatever`
			const expected_stable_final = `// OT⋄GENERATED-FROM-TEMPLATE foo v1.2.0`

			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should work with just an element NOT of type GENERATED-FROM-TEMPLATE', () => {
			const template = '// OT⋄CUSTOM foo bar'
			let existing_target = 'whatever'
			const expected_stable_final = `// OT⋄CUSTOM BEGIN foo bar
// OT⋄CUSTOM END foo bar`

			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should correctly discard unrecognized custom content', () => {
			const template = `
a b c
	// OT⋄CUSTOM foo
d e f
`
			let existing_target = `
unrecognized
	// OT⋄CUSTOM BEGIN foo
	recognized
	// OT⋄CUSTOM END foo
	unrecognized`
			const expected_stable_final = `
a b c
	// OT⋄CUSTOM BEGIN foo
	recognized
	// OT⋄CUSTOM END foo
d e f
`

			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should preserve existing recognized custom content - when no default', () => {
			const template = `
a b c
	// OT⋄CUSTOM foo
d e f
`
			let existing_target = `
whatever
	// OT⋄CUSTOM BEGIN foo
	blah blah
		custom
		  stuff with trailing
	// OT⋄CUSTOM END foo
		whatever`
			const expected_stable_final = `
a b c
	// OT⋄CUSTOM BEGIN foo
	blah blah
		custom
		  stuff with trailing
	// OT⋄CUSTOM END foo
d e f
`

			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should preserve existing recognized custom content - when there is a default', () => {
			const template = `
a b c
	// OT⋄CUSTOM BEGIN foo
	example…
	// OT⋄CUSTOM END foo
d e f
`
			let existing_target = `
whatever
	// OT⋄CUSTOM BEGIN foo
	customization
	// OT⋄CUSTOM END foo
		whatever`
			const expected_stable_final = `
a b c
	// OT⋄CUSTOM BEGIN foo
	customization
	// OT⋄CUSTOM END foo
d e f
`

			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should reject when an unrecognized element is found in the target', () => {
			const template = `
a b c
	// OT⋄CUSTOM foo
d e f
`
			let existing_target = `
whatever
	// OT⋄CUSTOM BEGIN bar
	hi wurld!
	// OT⋄CUSTOM END bar
		whatever`

			expect(
				() => existing_target = apply({ template, existing_target })
			).to.throw(
				'are not in the template'
			)
		})

		it('should work with this example', () => {
			const template = `
// OT⋄GENERATED-FROM-TEMPLATE foo v1.2.3
	blah blah
	// OT⋄CUSTOM bar baz
	blih blu`
			let existing_target = `
// OT⋄GENERATED-FROM-TEMPLATE foo v1.2.0
	old old
	// OT⋄CUSTOM BEGIN bar baz
	hello, world!
	// OT⋄CUSTOM END bar baz
	old old`
			const expected_stable_final = `
// OT⋄GENERATED-FROM-TEMPLATE foo v1.2.3
	blah blah
	// OT⋄CUSTOM BEGIN bar baz
	hello, world!
	// OT⋄CUSTOM END bar baz
	blih blu`
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
			existing_target = apply({ template, existing_target })
			expect(existing_target).to.equal(expected_stable_final)
		})

		it('should reject if the version changed with semver major')
	})

})
