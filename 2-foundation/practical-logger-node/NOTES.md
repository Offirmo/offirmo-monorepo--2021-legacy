
https://github.com/sindresorhus/boxen/commit/8881426c677a0fd0201807c467d6eb5589407673
const terminalColumns = () => {
const {env, stdout, stderr} = process;

	if (stdout && stdout.columns) {
		return stdout.columns;
	}

	if (stderr && stderr.columns) {
		return stderr.columns;
	}

	if (env.COLUMNS) {
		return Number.parseInt(env.COLUMNS, 10);
	}

	return 80;
};



TODO review
https://www.npmjs.com/package/console-probe


https://github.com/nuxt/consola


https://github.com/zeeshanu/dumper.js

TODO intelligently compute max line and stringify on 1 line if possible


TRACE  › OA∙API› [MR2] FYI The middleware "_handler(in)" set the body: {"body":{"1-netlify_client_context":{"user":{"email":"dev@online-adventur.es","sub":"fake-netlify-id","app_metadata":{"provider":"test","roles":["test"]},"user_metadata":{"full_name":"Fake User For Dev"},"exp":-1},"xxx":"WAS FAKED FOR DEV!"},"2-extracted_from_context":{"netlify_id":"fake-netlify-id","email":"dev@online-adventur.es","provider":"test","roles":["test"],"full_name":"Fake User For Dev"},"3-DB_result":{"created_at":"2020-07-18T06:02:51.965Z","updated_at":"2020-07-18T06:02:51.965Z","id":0,"called":"Admin","raw_email":"offirmo.net@gmail.com","normalized_email":"offirmonet@gmail.com","roles":["admin","tbrpg:admin"]},"4-final_result":{"called":"Admin","raw_email":"offirmo.net@gmail.com","normalized_email":"offirmonet@gmail.com","avatar_url":"https://unavatar.now.sh/offirmo.net@gmail.com","roles":["admin","tbrpg:admin"]}}}

