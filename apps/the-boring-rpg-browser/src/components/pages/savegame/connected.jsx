import React, { Component } from 'react'

import C from './component'
import { LS_KEYS } from '../../../services/consts'
import { ROUTES } from '../../../services/routes'


export default class Savegame extends Component {
	render() {
		return <C ls_key={LS_KEYS.savegame} home_url={ROUTES.home} />
	}
}
