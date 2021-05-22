/* A polyfill for browsers that don't support ligatures. */
/* The script tag referring to this file must be placed before the ending body tag. */

/* To provide support for elements dynamically added, this script adds
   method 'icomoonLiga' to the window object. You can pass element references to this method.
*/
(function () {
    'use strict';
    function supportsProperty(p) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            i,
            div = document.createElement('div'),
            ret = p in div.style;
        if (!ret) {
            p = p.charAt(0).toUpperCase() + p.substr(1);
            for (i = 0; i < prefixes.length; i += 1) {
                ret = prefixes[i] + p in div.style;
                if (ret) {
                    break;
                }
            }
        }
        return ret;
    }
    var icons;
    if (!supportsProperty('fontFeatureSettings')) {
        icons = {
            'build': '&#xe869;',
            'chat': '&#xe0b7;',
            'color_lens': '&#xe40a;',
            'palette': '&#xe40a;',
            'dehaze': '&#xe3c7;',
            'directions_run': '&#xe566;',
            'directions_walk': '&#xe536;',
            'feedback': '&#xe63f;',
            'sms_failed': '&#xe63f;',
            'flash_on': '&#xe3e7;',
            'forum': '&#xe8af;',
            'question_answer': '&#xe8af;',
            'gps_fixed': '&#xe55c;',
            'my_location': '&#xe55c;',
            'home': '&#xe88a;',
            'import_contacts': '&#xe0e0;',
            'location_on': '&#xe8b4;',
            'place': '&#xe8b4;',
            'room': '&#xe8b4;',
            'menu': '&#xe5d2;',
            'person_pin_circle': '&#xe56a;',
            'security': '&#xe32a;',
            'settings': '&#xe8b8;',
            'thumb_down': '&#xe8db;',
            'thumb_up': '&#xe8dc;',
            'touch_app': '&#xe913;',
            'tune': '&#xe429;',
            'unfold_less': '&#xe5d6;',
            'unfold_more': '&#xe5d7;',
            'volume_off': '&#xe04f;',
            'volume_up': '&#xe050;',
            'home3': '&#xe623;',
            'house3': '&#xe623;',
            'music': '&#xe60e;',
            'song': '&#xe60e;',
            'book': '&#xe62c;',
            'read': '&#xe62c;',
            'qrcode': '&#xe602;',
            'lifebuoy': '&#xe632;',
            'support': '&#xe632;',
            'envelop': '&#xe603;',
            'mail': '&#xe603;',
            'box-add': '&#xe60d;',
            'box3': '&#xe60d;',
            'floppy-disk': '&#xe611;',
            'save2': '&#xe611;',
            'undo2': '&#xe633;',
            'left': '&#xe633;',
            'bubbles4': '&#xe625;',
            'comments4': '&#xe625;',
            'user': '&#xe608;',
            'profile2': '&#xe608;',
            'users': '&#xe609;',
            'group': '&#xe609;',
            'user-plus': '&#xe60a;',
            'user2': '&#xe60a;',
            'user-minus': '&#xe60b;',
            'user3': '&#xe60b;',
            'spinner4': '&#xe60c;',
            'loading5': '&#xe60c;',
            'spinner11': '&#xe616;',
            'loading12': '&#xe616;',
            'wrench': '&#xe635;',
            'tool': '&#xe635;',
            'equalizer2': '&#xe60f;',
            'sliders2': '&#xe60f;',
            'cog': '&#xe610;',
            'gear': '&#xe610;',
            'aid-kit': '&#xe617;',
            'health': '&#xe617;',
            'bug': '&#xe631;',
            'virus': '&#xe631;',
            'stats-dots': '&#xe62e;',
            'stats2': '&#xe62e;',
            'trophy': '&#xe626;',
            'cup': '&#xe626;',
            'gift': '&#xe612;',
            'present': '&#xe612;',
            'fire': '&#xe636;',
            'flame': '&#xe636;',
            'shield': '&#xe637;',
            'security': '&#xe637;',
            'power': '&#xe638;',
            'lightning': '&#xe638;',
            'switch': '&#xe619;',
            'cloud-download': '&#xe613;',
            'cloud2': '&#xe613;',
            'cloud-upload': '&#xe614;',
            'cloud3': '&#xe614;',
            'cloud-check': '&#xe615;',
            'cloud4': '&#xe615;',
            'download2': '&#xe627;',
            'save4': '&#xe627;',
            'upload2': '&#xe628;',
            'load2': '&#xe628;',
            'star-empty': '&#xe63d;',
            'rate': '&#xe63d;',
            'star-half': '&#xe63e;',
            'rate2': '&#xe63e;',
            'star-full': '&#xe618;',
            'rate3': '&#xe618;',
            'point-up': '&#xe639;',
            'finger': '&#xe639;',
            'point-right': '&#xe63a;',
            'finger2': '&#xe63a;',
            'point-down': '&#xe63b;',
            'finger3': '&#xe63b;',
            'point-left': '&#xe63c;',
            'finger4': '&#xe63c;',
            'warning': '&#xe61c;',
            'sign': '&#xe61c;',
            'blocked': '&#xe61a;',
            'forbidden': '&#xe61a;',
            'cross': '&#xe629;',
            'cancel': '&#xe629;',
            'volume-high': '&#xe61d;',
            'volume': '&#xe61d;',
            'volume-low': '&#xe62a;',
            'volume3': '&#xe62a;',
            'volume-mute2': '&#xe61e;',
            'volume5': '&#xe61e;',
            'radio-checked': '&#xe907;',
            'radio-button': '&#xe907;',
            'radio-unchecked': '&#xe908;',
            'radio-button3': '&#xe908;',
            'terminal': '&#xe61b;',
            'console': '&#xe61b;',
            'facebook2': '&#xe62b;',
            'brand7': '&#xe62b;',
            'twitter2': '&#xe62d;',
            'brand12': '&#xe62d;',
            'github': '&#xe61f;',
            'brand40': '&#xe61f;',
            'apple': '&#xe62f;',
            'brand54': '&#xe62f;',
            'android': '&#xe630;',
            'brand56': '&#xe630;',
            'chrome': '&#xe634;',
            'browser': '&#xe634;',
          '0': 0
        };
        delete icons['0'];
        window.icomoonLiga = function (els) {
            var classes,
                el,
                i,
                innerHTML,
                key;
            els = els || document.getElementsByTagName('*');
            if (!els.length) {
                els = [els];
            }
            for (i = 0; ; i += 1) {
                el = els[i];
                if (!el) {
                    break;
                }
                classes = el.className;
                if (/icomoon-/.test(classes)) {
                    innerHTML = el.innerHTML;
                    if (innerHTML && innerHTML.length > 1) {
                        for (key in icons) {
                            if (icons.hasOwnProperty(key)) {
                                innerHTML = innerHTML.replace(new RegExp(key, 'g'), icons[key]);
                            }
                        }
                        el.innerHTML = innerHTML;
                    }
                }
            }
        };
        window.icomoonLiga();
    }
}());
