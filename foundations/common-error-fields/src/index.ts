
function create(): Set<string> {
    return new Set<string>([
        // standard fields
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
        'name',
        'message',
        // quasi-standard
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
        'stack',
        // non standard but widely used
        // ?
    ])
}

const default_instance = create()
const ERROR_FIELDS = default_instance

export {
    ERROR_FIELDS,
    create,
}
