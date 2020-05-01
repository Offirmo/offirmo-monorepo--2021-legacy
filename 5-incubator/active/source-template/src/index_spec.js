const { expect } = require('chai')

const { LIB } = require('./consts')
const { apply } = require('.')


describe(`${LIB}`, function() {

	describe('common behaviour', function() {

		it('should reject when template is empty', () => {
			expect(() => apply({
				template: '',
				existing_target: undefined,
			})).to.throw('template should not be empty')
		})

		it.only('should NOT add extra whitespaces or EOL', () => {

			const template = `// OT⋄GENERATED-FROM-TEMPLATE foo v1.2.3
// OT⋄CUSTOM bar
// OT⋄CUSTOM baz`
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

		it('should preserve whitespaces or EOL if any', () => {

		})
	})

	context('when there is no target', function() {

		it.only('should work with just a string', () => {
			const res = apply({
				template: '\n',
				existing_target: undefined,
			})
			expect(res).to.equal('\n')
		})

		it('should work with just an element of type GENERATED-FROM-TEMPLATE', () => {
			const res = apply({
				template: '// OT⋄GENERATED-FROM-TEMPLATE foo v0.0.0',
				existing_target: undefined,
			})
			expect(res).to.equal('// OT⋄GENERATED-FROM-TEMPLATE foo v0.0.0')
		})

		it('should work with just an element NOT of type GENERATED-FROM-TEMPLATE', () => {
			const res = apply({
				template: '// OT⋄CUSTOM foo bar',
				existing_target: undefined,
			})
			expect(res).to.equal(
`// OT⋄CUSTOM BEGIN foo bar
// OT⋄CUSTOM END foo bar`
)
		})

		context('after the target was generated', function() {

			it('should be stable', () => {
				const template = `
// OT⋄GENERATED-FROM-TEMPLATE foo v1.2.3
	blah blah
	// OT⋄CUSTOM bar baz
	blih blu`
				const expected_stable_final = `
// OT⋄GENERATED-FROM-TEMPLATE foo v1.2.3
	blah blah
	// OT⋄CUSTOM BEGIN bar baz
	// OT⋄CUSTOM END bar baz
	blih blu`
				let existing_target = undefined
				existing_target = apply({ template, existing_target })
				expect(existing_target).to.equal(expected_stable_final)
				existing_target = apply({ template, existing_target })
				expect(existing_target).to.equal(expected_stable_final)
			})
		})
	})

	context('when there is a target', function() {

		it('should work with just a string', () => {
			const res = apply({
				template: 'a',
				existing_target: 'whatever',
			})
			expect(res).to.equal('a')
		})

		it('should work with just an element of type GENERATED-FROM-TEMPLATE', () => {
			const res = apply({
				template: '// OT⋄GENERATED-FROM-TEMPLATE foo v0.0.0',
				existing_target: 'whatever',
			})
			expect(res).to.equal('// OT⋄GENERATED-FROM-TEMPLATE foo v0.0.0')
		})

		it('should work with just an element NOT of type GENERATED-FROM-TEMPLATE', () => {
			const res = apply({
				template: '// OT⋄CUSTOM foo bar',
				existing_target: 'whatever',
			})
			expect(res).to.equal(
				`// OT⋄CUSTOM BEGIN foo bar
// OT⋄CUSTOM END foo bar`
			)
		})

		it('should preserve existing recognized custom content', () => {
			const res = apply({
				template: `
a b c
	// OT⋄CUSTOM foo
d e f
`,
				existing_target: `
whatever
	// OT⋄CUSTOM BEGIN foo
	blah blah
		custom
		  stuff with trailing
	// OT⋄CUSTOM END foo
		whatever`,
			})
			expect(res).to.equal(`
a b c
	// OT⋄CUSTOM BEGIN foo
	blah blah
		custom
		  stuff with trailing
	// OT⋄CUSTOM END foo
d e f
`)
		})

		it('should reject when an unrecognized element is found in the target')

		context('after the target was generated', function() {
			it('should be stable')
		})
	})


})
