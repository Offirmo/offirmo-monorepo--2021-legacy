



const MANY_SPACES = '                                                                                                                                                      '








console.log(
	boxify(''
		+ ('You continue your adventures...' + MANY_SPACES).slice(0, MINIMAL_TERMINAL_WIDTH - 4) + '\n\n'
		+ wrapLines(MINIMAL_TERMINAL_WIDTH - 4)(''
			//+ `Click #${state.good_click_count}\n\n`
			+ stylizeString.bold(render_adventure(state.last_adventure, rendering_options))
		),
		{
			padding: 1,
			borderStyle: 'double',
			borderColor: 'red'
		}
	)
)

function boxifyAlt(position, s) {
	const lines = s.split('\n')
	lines[0] = (lines[0] + MANY_SPACES).slice(0, MINIMAL_TERMINAL_WIDTH - 2)
	const boxified = boxify(lines.join('\n'))
	const boxified_lines = boxified.split('\n').slice(
		(position !== 'top') ? 1 : 0
	)
	if (position !== 'bottom')
		boxified_lines[boxified_lines.length - 1] =
			boxified_lines[boxified_lines.length - 1]
				.replace('└', '├')
				.replace('┘', '┤')

	return boxified_lines.join('\n')
}

/*
console.log(boxifyAlt('top',
	//stylizeString.bold('🙂  CHARACTERISTICS 💗\n')
	stylizeString.bold('CHARACTERISTICS:\n')
	+ render_characteristics(state.avatar, rendering_options),
	{borderStyle: 'single'}
))
