////////////////////////////////////

export const APP = 'OA∙API' // 'functions'

////////////////////////////////////

export const HTTP_STATUS_CODE = {
	success: {
		ok: 200,
		created: 201,
		accepted: 202,
		no_content: 204, // https://benramsey.com/blog/2008/05/http-status-204-no-content-and-205-reset-content/
		reset_content: 205,
	},
	error: {
		client: {
			bad_request: 400,
			unauthorized: 401, // https://stackoverflow.com/questions/50143518/401-unauthorized-vs-403-forbidden-which-is-the-right-status-code-for-when-the-u
			forbidden: 403,
			not_found: 404,
			method_not_allowed: 405,
			unprocessable_entity: 422,
		},
		server: {
			internal: 500,
			not_implemented: 501,
		}
	}
}
