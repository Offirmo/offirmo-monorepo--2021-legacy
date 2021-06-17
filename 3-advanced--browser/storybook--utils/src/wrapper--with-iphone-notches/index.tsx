import useWindowSize from '../use-window-size'

import './index.css'

export default function WithIphoneNotches({ children, bg_urls = {} }) {
	const { width: viewport_width, height: viewport_height } = useWindowSize()
	const display_mode: 'portrait' | 'landscape' = viewport_width < viewport_height
		? 'portrait'
		: 'landscape'

	const [ viewport_pwidth, viewport_pheight ] = [ viewport_width, viewport_height ].sort()
	const iphone12mini = {
		p_w: 375,
		p_h: 812,
		corner_w: 75, // 46
		home_indicator_w: 134,
		bg_url: bg_urls.iphone12mini,
		inset: {
			notch: 50,
			home_indicator: {
				portrait: 34,
				landscape: 21,
			},
		},
	}
	const iphone12pro = {
		p_w: 390,
		p_h: 844,
		corner_w: 82,
		home_indicator_w: 139,
		bg_url: bg_urls.iphone12pro,
		inset: {
			notch: 47,
			home_indicator: {
				portrait: 34,
				landscape: 21,
			},
		},
	}
	const iphone12promax = {
		p_w: 428,
		p_h: 926,
		corner_w: 90, // 55
		home_indicator_w: 153,
		bg_url: bg_urls.iphone12promax,
		inset: {
			notch: 47,
			home_indicator: {
				portrait: 34,
				landscape: 21,
			},
		},
	}

	const { corner_w, home_indicator_w, bg_url, inset } = (() => {
		function distance(aw, ah, bw, bh) {
			const diag_a = Math.sqrt(aw * aw + ah * ah)
			const diag_b = Math.sqrt(bw * bw + bh * bh)
			return Math.abs(diag_a - diag_b)
		}

		let closest = [iphone12mini, iphone12pro, iphone12promax]
			.reduce((acc, val) => {
				const existing_diff = distance(viewport_width, viewport_height, acc.p_w, acc.p_h)
				const candidate_diff = distance(viewport_width, viewport_height, val.p_w, val.p_h)

				if (candidate_diff < existing_diff)
					return val
				return acc
			}, iphone12pro)

		return closest
	})()
	const corner_bezier = corner_w / 18. * 11.

	console.log({
		display_mode,
		viewport_width, viewport_height,
		viewport_pwidth, viewport_pheight,
		corner_w,
		home_indicator_w,
		bg_url,
		inset,
	})

	document.documentElement.style.setProperty('--safe-area-inset-top', `${display_mode === 'portrait' ? inset.notch : 0}px`)
	document.documentElement.style.setProperty('--safe-area-inset-right', `${display_mode === 'landscape' ? inset.notch : 0}px`)
	document.documentElement.style.setProperty('--safe-area-inset-bottom', `${inset.home_indicator[display_mode]}px`)
	document.documentElement.style.setProperty('--safe-area-inset-left', `${display_mode === 'landscape' ? inset.notch : 0}px`)

	const corner_path = `M 0,0 C 0,0 0,${corner_w + corner_bezier} 0,${corner_w} 0,${corner_w-corner_bezier} ${corner_w-corner_bezier},0 ${corner_w},0 ${corner_w + corner_bezier},0 0,0 0,0 Z`
	const corner_viewbox = `0 0 ${corner_w + corner_bezier} ${corner_w + corner_bezier}`

	return (
		<div className="o⋄top-container">
			<div className="o⋄top-container o⋄bg⁚cover" style={{backgroundImage: `url(x` + bg_url + ')' }}>
				{children}
			</div>

			<svg className="o⋄mobile-design-helper o⋄mobile-design-helper--corner--top-left" xmlns="http://www.w3.org/2000/svg" width={corner_w} height={corner_w} viewBox={corner_viewbox}>
				<path className="o⋄mobile-design-helper--svg-shape" d={corner_path} >╭</path>
			</svg>
			<svg className="o⋄mobile-design-helper o⋄mobile-design-helper--corner--top-right" xmlns="http://www.w3.org/2000/svg" width={corner_w} height={corner_w} viewBox={corner_viewbox}>
				<path className="o⋄mobile-design-helper--svg-shape" d={corner_path} >╮</path>
			</svg>
			<svg className="o⋄mobile-design-helper o⋄mobile-design-helper--corner--bottom-right" xmlns="http://www.w3.org/2000/svg" width={corner_w} height={corner_w} viewBox={corner_viewbox}>
				<path className="o⋄mobile-design-helper--svg-shape" d={corner_path} >╯</path>
			</svg>
			<svg className="o⋄mobile-design-helper o⋄mobile-design-helper--corner--bottom-left" xmlns="http://www.w3.org/2000/svg" width={corner_w} height={corner_w} viewBox={corner_viewbox}>
				<path className="o⋄mobile-design-helper--svg-shape" d={corner_path} >╰</path>
			</svg>

			<div className={`o⋄mobile-design-helper o⋄mobile-design-helper--notch o⋄mobile-design-helper--notch--${display_mode}`}>N</div>
			<div className="o⋄mobile-design-helper o⋄mobile-design-helper--home-indicator" style={{width: home_indicator_w}}>--</div>

		</div>
	)
}
