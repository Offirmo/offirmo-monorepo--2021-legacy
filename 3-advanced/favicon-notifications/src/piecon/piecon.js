//
// piecon.js
//
// https://github.com/lipka/piecon
//
// Copyright (c) 2015 Lukas Lipka <lukaslipka@gmail.com>. All rights reserved.
//

(function () {
	var Piecon = {}

	var currentFavicon = null
	var originalFavicon = null
	var originalTitle = null
	var canvas = null
	var options = {}
	const own_window = window
	var defaults = {
		color: '#ff0084',
		background: '#bbb',
		shadow: '#fff',
		fallback: false,
		target_window: own_window.parent
	}

	var isRetina = own_window.devicePixelRatio > 1

	var ua = (function () {
		var agent = own_window.navigator.userAgent.toLowerCase()
		return function (browser) {
			return agent.indexOf(browser) !== -1
		}
	}())

	var browser = {
		ie: ua('msie'),
		chrome: ua('chrome'),
		webkit: ua('chrome') || ua('safari'),
		safari: ua('safari') && !ua('chrome'),
		mozilla: ua('mozilla') && !ua('chrome') && !ua('safari'),
	}

	var getFaviconTag = function () {
		var links = options.target_window.document.getElementsByTagName('link')

		for (var i = 0, l = links.length; i < l; i++) {
			if (links[i].getAttribute('rel') === 'icon' || links[i].getAttribute('rel') === 'shortcut icon') {
				return links[i]
			}
		}

		return false
	}

	var removeFaviconTag = function () {
		var links = Array.prototype.slice.call(options.target_window.document.getElementsByTagName('link'), 0)
		var head = options.target_window.document.getElementsByTagName('head')[0]

		for (var i = 0, l = links.length; i < l; i++) {
			if (links[i].getAttribute('rel') === 'icon' || links[i].getAttribute('rel') === 'shortcut icon') {
				head.removeChild(links[i])
			}
		}
	}

	var setFaviconTag = function (url) {
		removeFaviconTag()

		var link = options.target_window.document.createElement('link')
		link.type = 'image/x-icon'
		link.rel = 'icon'
		link.href = url

		options.target_window.document.getElementsByTagName('head')[0].appendChild(link)
	}

	var getCanvas = function () {
		if (!canvas) {
			canvas = own_window.document.createElement('canvas')
			if (isRetina) {
				canvas.width = 32
				canvas.height = 32
			} else {
				canvas.width = 16
				canvas.height = 16
			}
		}

		return canvas
	}

	var drawFavicon = function (percentage) {
		var canvas = getCanvas()
		var context = canvas.getContext('2d')

		percentage = percentage || 0

		if (context) {
			context.clearRect(0, 0, canvas.width, canvas.height)

			// Draw shadow
			context.beginPath()
			context.moveTo(canvas.width / 2, canvas.height / 2)
			context.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width / 2, canvas.height / 2), 0, Math.PI * 2, false)
			context.fillStyle = options.shadow
			context.fill()

			// Draw background
			context.beginPath()
			context.moveTo(canvas.width / 2, canvas.height / 2)
			context.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width / 2, canvas.height / 2) - 2, 0, Math.PI * 2, false)
			context.fillStyle = options.background
			context.fill()

			// Draw pie
			if (percentage > 0) {
				context.beginPath()
				context.moveTo(canvas.width / 2, canvas.height / 2)
				context.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width / 2, canvas.height / 2) - 2, (-0.5) * Math.PI, (-0.5 + 2 * percentage / 100) * Math.PI, false)
				context.lineTo(canvas.width / 2, canvas.height / 2)
				context.fillStyle = options.color
				context.fill()
			}

			setFaviconTag(canvas.toDataURL())
		}
	}

	var updateTitle = function (percentage) {
		if (percentage > 0) {
			options.target_window.document.title = '(' + percentage + '%) ' + originalTitle
		} else {
			options.target_window.document.title = originalTitle
		}
	}

	Piecon.setOptions = function (custom) {
		options = {}

		for (var key in defaults) {
			options[key] = custom.hasOwnProperty(key) ? custom[key] : defaults[key]
		}

		return this
	}

	Piecon.setProgress = function (percentage) {
		if (!originalTitle) {
			originalTitle = options.target_window.document.title
		}

		if (!originalFavicon || !currentFavicon) {
			var tag = getFaviconTag()
			originalFavicon = currentFavicon = tag ? tag.getAttribute('href') : '/favicon.ico'
		}

		if (!isNaN(parseFloat(percentage)) && isFinite(percentage)) {
			if (!getCanvas().getContext || browser.ie || browser.safari || options.fallback === true) {
				// Fallback to updating the browser title if unsupported
				return updateTitle(percentage)
			} else if (options.fallback === 'force') {
				updateTitle(percentage)
			}

			return drawFavicon(percentage)
		}

		return false
	}

	Piecon.reset = function () {
		if (originalTitle) {
			options.target_window.document.title = originalTitle
		}

		if (originalFavicon) {
			currentFavicon = originalFavicon
			setFaviconTag(currentFavicon)
		}
	}

	Piecon.setOptions(defaults)

	if (typeof define === 'function' && define.amd) {
		define(Piecon)
	} else if (typeof module !== 'undefined') {
		module.exports = Piecon
	} else {
		own_window.Piecon = Piecon
	}
})()
