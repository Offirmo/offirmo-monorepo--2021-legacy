import tiny_singleton from '@offirmo-private/tiny-singleton'
import { Howl } from 'howler'
import sfx_sell_buy from '@oh-my-rpg/rsrc-audio/src/sfx_sell_buy'

const get = tiny_singleton(() => new Howl({
	src: [ sfx_sell_buy ]
}))

export default get
