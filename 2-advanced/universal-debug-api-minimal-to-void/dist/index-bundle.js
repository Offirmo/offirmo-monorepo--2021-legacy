parcelRequire = function (e, r, t, n) {
	var i, o = 'function' == typeof parcelRequire && parcelRequire, u = 'function' == typeof require && require

	function f(t, n) {
		if (!r[t]) {
			if (!e[t]) {
				var i = 'function' == typeof parcelRequire && parcelRequire
				if (!n && i) return i(t, !0)
				if (o) return o(t, !0)
				if (u && 'string' == typeof t) return u(t)
				var c = new Error('Cannot find module \'' + t + '\'')
				throw c.code = 'MODULE_NOT_FOUND', c
			}
			p.resolve = function (r) {
				return e[t][1][r] || r
			}, p.cache = {}
			var l = r[t] = new f.Module(t)
			e[t][0].call(l.exports, p, l, l.exports, this)
		}
		return r[t].exports

		function p(e) {
			return f(p.resolve(e))
		}
	}

	f.isParcelRequire = !0, f.Module = function (e) {
		this.id = e, this.bundle = f, this.exports = {}
	}, f.modules = e, f.cache = r, f.parent = o, f.register = function (r, t) {
		e[r] = [function (e, r) {
			r.exports = t
		}, {}]
	}
	for (var c = 0; c < t.length; c++) try {
		f(t[c])
	} catch (e) {
		i || (i = e)
	}
	if (t.length) {
		var l = f(t[t.length - 1])
		'object' == typeof exports && 'undefined' != typeof module ? module.exports = l : 'function' == typeof define && define.amd ? define(function () {
			return l
		}) : n && (this[n] = l)
	}
	if (parcelRequire = f, i) throw i
	return f
}({
	'+CYW': [function (require, module, exports) {
		var global = arguments[3]
		var e = arguments[3]
		Object.defineProperty(exports, '__esModule', {value: !0})
		var o = {}

		function n() {
			return 'undefined' != typeof globalThis ? globalThis : void 0 !== e ? e : 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : o
		}

		exports.getGlobalThis = n
	}, {}], '9pML': [function (require, module, exports) {
		'use strict'
		Object.defineProperty(exports, '__esModule', {value: !0})
		const e = () => {
		}, r = {
			setLevel: e,
			getLevel: () => 'silly',
			addCommonDetails: e,
			fatal: e,
			emerg: e,
			alert: e,
			crit: e,
			error: e,
			warning: e,
			warn: e,
			notice: e,
			info: e,
			verbose: e,
			log: e,
			debug: e,
			trace: e,
			silly: e,
		}

		function t() {
			return r
		}

		exports.createLogger = t
	}, {}], '356W': [function (require, module, exports) {
		'use strict'
		exports.__esModule = !0
		var e = require('@offirmo/practical-logger-minimal-to-void')

		function r() {
			var r = e.createLogger()
			return {
				getLogger: function () {
					return r
				}, addDebugCommand: function () {
				},
			}
		}

		exports.default = r
	}, {'@offirmo/practical-logger-minimal-to-void': '9pML'}], 'sLmB': [function (require, module, exports) {
		'use strict'
		Object.defineProperty(exports, '__esModule', {value: !0})
	}, {}], '7QCb': [function (require, module, exports) {
		'use strict'

		function e(e) {
			for (var r in e) exports.hasOwnProperty(r) || (exports[r] = e[r])
		}

		var r = this && this.__importDefault || function (e) {
			return e && e.__esModule ? e : {default: e}
		}
		exports.__esModule = !0
		var o = require('@offirmo/globalthis-ponyfill'), t = r(require('./v1'))
		exports.createV1 = t.default
		var u = o.getGlobalThis()
		exports.globalThis = u, u._debug = u._debug || {}, u._debug.v1 = u._debug.v1 || t.default()
		var a = u._debug.v1, i = a.getLogger, s = a.addDebugCommand
		exports.getLogger = i, exports.addDebugCommand = s, e(require('@offirmo/universal-debug-api-interface'))
	}, {'@offirmo/globalthis-ponyfill': '+CYW', './v1': '356W', '@offirmo/universal-debug-api-interface': 'sLmB'}],
}, {}, ['7QCb'], null)
