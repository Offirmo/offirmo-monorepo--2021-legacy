import SwipeableViews from 'react-swipeable-views'
import { virtualize, SlideRendererCallback, SlideRenderProps } from 'react-swipeable-views-utils'
import { mod } from 'react-swipeable-views-core'

const VirtualizeSwipeableViews = virtualize(SwipeableViews)

const styles = {
	slide: {
		padding: 15,
		minHeight: 100,
		color: '#fff',
	},
	slide1: {
		backgroundColor: '#FEA900',
	},
	slide2: {
		backgroundColor: '#B3DC4A',
	},
	slide3: {
		backgroundColor: '#6AC0FF',
	},
}

export interface Props {
	index: number
	key: string
}
export const SlideRenderer: SlideRendererCallback = ({ index, key }: SlideRenderProps) => {
	console.log('XXX', { index, mod: mod(index, 3) })

	switch (mod(index, 3)) {
		case 0:
			return (
				<div key={key} style={Object.assign({}, styles.slide, styles.slide1)}>
					slide n°1
				</div>
			);

		case 1:
			return (
				<div key={key} style={Object.assign({}, styles.slide, styles.slide2)}>
					slide n°2
				</div>
			);

		case 2:
			return (
				<div key={key} style={Object.assign({}, styles.slide, styles.slide3)}>
					slide n°3
				</div>
			);

		default:
			console.error('XXX', { index, mod: mod(index, 3) })
			return null;
	}
}

export function DemoSimple() {
	return <VirtualizeSwipeableViews
		enableMouseEvents
		slideRenderer={SlideRenderer}
		index={0}
		onChangeIndex={() => {}}
	/>;
}

////////////////////////////////////

export default DemoSimple
