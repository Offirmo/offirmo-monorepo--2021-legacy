/////////////////////

import { expect } from 'chai'
import { APP } from '../consts'

import {
	DEV_MOCK_NETLIFY_USER,
	get_netlify_user_data,
} from './netlify'
import { NetlifyClientContext, NetlifyContext } from '../types'

////////////////////////////////////

describe(`${APP} - netlify`, function () {

	function get_test_context(): NetlifyContext {

		const clientContext: NetlifyClientContext = {
			client: {} as any,
			"custom": {
				"netlify": "eyJpZGVudGl0eSI6eyJ1cmwiOiJodHRwczovL29mZmlybW8tbW9ub3JlcG8ubmV0bGlmeS5jb20vLm5ldGxpZnkvaWRlbnRpdHkiLCJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpsZUhBaU9qRTFOelV5TnpZMk16SXNJbk4xWWlJNklqQWlmUS5wcnRHeFd3alY2WnVJaWhpRG9Dak9KUGMzWnFuWGtxRUYxaXRJZ3NCUUhrIn0sInVzZXIiOnsiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZ29vZ2xlIn0sImVtYWlsIjoib2ZmaXJtby5uZXRAZ21haWwuY29tIiwiZXhwIjoxNTc1Mjc4MDQzLCJzdWIiOiI1NDZkNzlhYi01MjQwLTRkZDAtYWY2Ni03ODJhZmJjMGEwNDQiLCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoNS5nb29nbGV1c2VyY29udGVudC5jb20vLWdBczBsNnRxemVJL0FBQUFBQUFBQUFJL0FBQUFBQUFBQURNL1M3blNWRmljbGU0L3Bob3RvLmpwZyIsImZ1bGxfbmFtZSI6Ik9mZmlybW8gTmVldCJ9fSwic2l0ZV91cmwiOiJodHRwczovL29mZmlybW8tbW9ub3JlcG8ubmV0bGlmeS5jb20ifQ=="
			},
			"identity": {
				"url": "https://offirmo-monorepo.netlify.app/.netlify/identity",
				"token": "fake-netlify-token-for-test"
			},
			"user": {
				"app_metadata": {
					"provider": "google"
				},
				"email": "offirmo.net@gmail.com",
				"exp": 1575278043,
				"sub": "546d79ab-5240-4dd0-af66-782afbc0a044",
				"user_metadata": {
					"avatar_url": "https://lh5.googleusercontent.com/-gAs0l6tqzeI/AAAAAAAAAAI/AAAAAAAAADM/S7nSVFicle4/photo.jpg",
					"full_name": "Offirmo Neet"
				}
			}
		}

		return {
			clientContext,
		} as any
	}

	describe('get_netlify_user_data', function () {

		it('should work on nominal', () => {
			const user_data = get_netlify_user_data(get_test_context())
			//console.log(user_data)
			expect(user_data).to.deep.equal({
				netlify_id: '546d79ab-5240-4dd0-af66-782afbc0a044',
				email: 'offirmo.net@gmail.com',
				provider: 'google',
				roles: [],
				avatar_url:
					'https://lh5.googleusercontent.com/-gAs0l6tqzeI/AAAAAAAAAAI/AAAAAAAAADM/S7nSVFicle4/photo.jpg',
				full_name: 'Offirmo Neet'
			})
		})
	})
})
