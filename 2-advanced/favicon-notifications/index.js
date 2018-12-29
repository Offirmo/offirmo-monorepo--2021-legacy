import Favico from 'favico.js'

const favicon = new Favico({
    animation:'popFade',
    position : 'up',
})

function set_number_in_favicon(x) {
    console.log({favicon, x})
    favicon.badge(x)
}

export {
    set_number_in_favicon
}
