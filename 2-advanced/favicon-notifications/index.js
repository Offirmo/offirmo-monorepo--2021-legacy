import Piecon from 'piecon'
import Favico from 'favico.js'


Piecon.setOptions({
    color: '#ff0084', // Pie chart color
    background: '#bbb', // Empty pie chart color
    shadow: '#fff', // Outer ring color
    fallback: false // Toggles displaying percentage in the title bar (possible values - true, false, 'force')
})

function create_favicon() {
    return new Favico({
        //animation:'popFade',
        animation: 'none',
        position : 'up',
    })
}
let favicon = create_favicon()

// experimentally needed...
Piecon.setProgress(0.0001)

let piecon_on = true
let favicon_on = false
let last_favicon_number = NaN

const DEBUG = false
function set_number_in_favicon(x) {
    if (DEBUG) console.log('set_number_in_favicon', x)

    x = Number(x)

    if (x < 0 || Number.isNaN(x)) {
        throw new Error('bad number')
    }


    if (x === 0 || x >= 1) {
        x = Math.trunc(x)

        if (piecon_on) {
            Piecon.reset()
            if (DEBUG) console.log('Piecon.reset')

            // experimentally needed...
            favicon = create_favicon()
            if (DEBUG) console.log('new favicon')

            piecon_on = false
        }
        
        // avoid unneeded animation if we are setting the same number
        if (x !== last_favicon_number) {
            favicon.badge(x)
            last_favicon_number = x
        }
        favicon_on = true

        if (DEBUG) console.log('favicon.badge', x)
    }
    else {
        x = Math.trunc(x * 100)
        // constraint for clarity of display on limits
        x = Math.min(95, x)
        x = Math.max(3, x)

        if (favicon_on) {
            favicon.reset()
            favicon_on = false
            last_favicon_number = NaN
            if (DEBUG) console.log('favicon.reset')
        }
        
        Piecon.setProgress(x)
        piecon_on = true

        if (DEBUG) console.log('piecon.setProgress', x)
    }
}

export {
    set_number_in_favicon
}
