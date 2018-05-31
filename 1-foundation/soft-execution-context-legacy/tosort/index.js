function callProtected(func, tag) {
    try {
        return func();
    } catch (error) {
        try {
            const e = error || new Error("Flag Error");
            e.tag = tag;
            return onError(e);
        } catch (ee) {
            _EVENT("copyPaste.flag.error.unexpected", {type: ee && ee.name, inline: false});
        }
    }
}
