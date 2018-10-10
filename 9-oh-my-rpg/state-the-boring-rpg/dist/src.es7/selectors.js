import { is_full } from '@oh-my-rpg/state-inventory';
/////////////////////
function is_inventory_full(state) {
    return is_full(state.inventory);
}
/////////////////////
export { is_inventory_full, };
/////////////////////
//# sourceMappingURL=selectors.js.map