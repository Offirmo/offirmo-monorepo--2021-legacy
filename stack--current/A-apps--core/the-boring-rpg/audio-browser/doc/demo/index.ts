import * as audio from '../..'
console.log('this pkg', audio)

import { get_sfx_sell_buy } from '../..'

get_sfx_sell_buy().once('unlock', get_sfx_sell_buy().play)

