const { Enum } = require('typescript-string-enums')
const { SkinTone, Age, Gender, HairColor, render } = require('..')

Enum.values(SkinTone).slice(2, 7).forEach(skin_tone => {
	let acc = ''
	Enum.values(Age).slice(1).forEach(age => {
		acc += ' '
		Enum.values(Gender).slice(2).forEach(gender => {
			acc += render({
				gender,
				age,
				skin_tone,
				hair: HairColor.blond,
			})[0] + '  '
		})
	})
	console.log(acc)
})
