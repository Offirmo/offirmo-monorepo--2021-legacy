import memoize_one from 'memoize-one'
import { Howl } from 'howler'
import sfx_sell_buy from '@oh-my-rpg/rsrc-audio/src/sfx_sell_buy'

// lazy-load + no duplication
const get = memoize_one(() => new Howl({
	src: [ sfx_sell_buy ],
}))

export default get

// TODO add to credits
// TODO add to being shown
