
const STEP_CONFIRM = normalize_step({
	msg_main: `Are you sure?`,
	msgg_as_user: ok => ok ? 'Yes, I confirm.' : 'No, I changed my mind…',
	choices: [
		{
			msg_cta: 'Yes, confirm',
			value: true,
		},
		{
			msg_cta: 'No, cancel',
			value: false,
		},
	]
})


// TODO maybe?
async function ask_user_for_confirmation(msg) {
	if (DEBUG) console.log(`↘ ask_user_for_confirmation(${msg})`)
	await ui.display_message({
		msg: msg || STEP_CONFIRM.msg_main,
		choices: STEP_CONFIRM.choices
	})
	let ok = await ui.read_answer(STEP_CONFIRM)
	if (!ok)
		await ui.display_message({ msg: 'No worries, let’s try again...' })
	return ok
}
