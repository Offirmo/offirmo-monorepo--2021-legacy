


import SwipeableViews from 'react-swipeable-views'
import { virtualize, bindKeyboard } from 'react-swipeable-views-utils'
import { mod } from 'react-swipeable-views-core';

const VirtualizeSwipeableViews = bindKeyboard(virtualize(SwipeableViews));


/*
function SwipableContent({isBurgerMenuOpen, screenIndex, screens, immersionSlidesRenderer, onScreenIndexChange}) {
	return (
		<VirtualizeSwipeableViews
			enableMouseEvents={true}
			index={screenIndex}
			onChangeIndex={onScreenIndexChange}
			style={{}}
			slideRenderer={immersionSlidesRenderer}
			slideCount={}
		/>
	)
}
*/
