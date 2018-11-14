import * as RichText from '@offirmo/rich-text-format';
function render_meta_infos(metas) {
    const $doc_list = RichText.unordered_list();
    Object.keys(metas).forEach((key) => {
        $doc_list.pushRawNode(RichText.inline_fragment().pushText(key + ': ' + metas[key]).done(), { id: key });
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
    const $doc = RichText.block_fragment()
        .pushHeading('Account infos:', { id: 'header' })
        .pushNode(render_meta_infos(meta_infos), { id: 'list' })
        .done();
    return $doc;
}
export { render_account_info, };
//# sourceMappingURL=meta.js.map