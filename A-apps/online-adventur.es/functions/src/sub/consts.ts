////////////////////////////////////

export const APP = 'OA∙API' // 'functions'

////////////////////////////////////

export const HTTP_STATUS_CODE = {
	success: {
		ok: 200,
		created: 201,
		accepted: 202,
	},
	error: {
		client: {
			bad_request: 400,
			unauthorized: 401,
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
