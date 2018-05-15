import * as RichText from '@offirmo/rich-text-format';
function render_meta_infos(metas) {
    const $doc_list = RichText.unordered_list();
    Object.keys(metas).forEach((prop) => {
        $doc_list.pushRawNode(RichText.span().pushText(prop + ': ' + metas[prop]).done(), prop);
    });
    return $doc_list.done();
}
function render_account_info(m, extra = {}) {
    const meta_infos = extra;
    /* TODO rework
    meta_infos['internal user id'] = m.uuid
    meta_infos['telemetry allowed'] = String(m.allow_telemetry)
    if (m.email) meta_infos['email'] = m.email
    */
    const $doc = RichText.span()
        .pushNode(RichText.heading().pushText('Account infos:').done(), 'header')
        .pushNode(render_meta_infos(meta_infos), 'list')
        .done();
    return $doc;
}
export { render_account_info, };
//# sourceMappingURL=meta.js.map