import { expect } from 'chai';
import * as RichText from '@offirmo/rich-text-format';
import { generate_random_demo_weapon, DEMO_WEAPON_1 } from '@oh-my-rpg/logic-weapons';
import { generate_random_demo_armor, DEMO_ARMOR_2 } from '@oh-my-rpg/logic-armors';
import { create as create_inventory, equip_item, add_item, remove_item_from_unslotted, } from '@oh-my-rpg/state-inventory';
import { Currency, create as create_wallet, add_amount, } from '@oh-my-rpg/state-wallet';
const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg-node/src/services/rich_text_to_ansi');
const prettyjson = require('prettyjson');
function prettify_json(data, options = {}) {
    return prettyjson.render(data, options);
}
import { render_backpack, render_equipment, render_full_inventory, } from '.';
describe('🔠  view to @offirmo/rich-text-format', function () {
    describe('📦  backpack rendering', function () {
        context('when empty', function () {
            it('should render properly', () => {
                let inventory = create_inventory();
                const $doc = render_backpack(inventory);
                const str = RichText.to_text($doc);
                expect(str).to.be.a('string');
                expect(str).to.contain('empty');
            });
        });
        context('when not empty', function () {
            // XXX TODO
            it.skip('should render properly', () => {
                let inventory = create_inventory();
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = remove_item_from_unslotted(inventory, inventory.unslotted[4].uuid);
                const $doc = render_backpack(inventory);
                const str = RichText.to_text($doc);
                expect(str).to.be.a('string');
                expect(str).not.to.contain(' 0.');
                expect(str).to.contain(' a.');
                expect(str).to.contain(' e.');
                expect(str).not.to.contain(' f.');
            });
        });
        describe('demo', function () {
            it('shows off', () => {
                let inventory = create_inventory();
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = remove_item_from_unslotted(inventory, inventory.unslotted[4].uuid);
                const $doc = render_backpack(inventory);
                console.log(rich_text_to_ansi($doc));
            });
        });
    });
    describe('⚔ 🛡  active equipment rendering', function () {
        context('when empty', function () {
            it('should render properly', () => {
                let inventory = create_inventory();
                const $doc = render_equipment(inventory);
                const str = RichText.to_text($doc);
                expect(str).to.be.a('string');
                expect(str).to.contain('armor : -');
                expect(str).to.contain('weapon: -');
            });
        });
        context('when not empty', function () {
            it('should render properly', () => {
                let inventory = create_inventory();
                inventory = add_item(inventory, DEMO_WEAPON_1);
                inventory = add_item(inventory, DEMO_ARMOR_2);
                inventory = equip_item(inventory, DEMO_WEAPON_1.uuid);
                inventory = equip_item(inventory, DEMO_ARMOR_2.uuid);
                const $doc = render_equipment(inventory);
                const str = RichText.to_text($doc);
                expect(str).to.be.a('string');
                expect(str).to.contain('armor : legendary Apprentice’s Brass Belt +8');
                expect(str).to.contain('weapon: uncommon Adjudicator’s Admirable Axe');
            });
        });
        describe('demo', function () {
            it('shows off', () => {
                let inventory = create_inventory();
                inventory = add_item(inventory, DEMO_WEAPON_1);
                inventory = add_item(inventory, DEMO_ARMOR_2);
                inventory = equip_item(inventory, DEMO_WEAPON_1.uuid);
                inventory = equip_item(inventory, DEMO_ARMOR_2.uuid);
                const $doc = render_equipment(inventory);
                console.log(rich_text_to_ansi($doc));
            });
        });
    });
    describe('⚔ 🛡 💰 📦  full inventory rendering', function () {
        describe('demo', function () {
            it('shows off', () => {
                let inventory = create_inventory();
                inventory = add_item(inventory, DEMO_WEAPON_1);
                inventory = add_item(inventory, DEMO_ARMOR_2);
                inventory = equip_item(inventory, DEMO_WEAPON_1.uuid);
                inventory = equip_item(inventory, DEMO_ARMOR_2.uuid);
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = add_item(inventory, generate_random_demo_weapon());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = add_item(inventory, generate_random_demo_armor());
                inventory = remove_item_from_unslotted(inventory, inventory.unslotted[4].uuid);
                let wallet = create_wallet();
                wallet = add_amount(wallet, Currency.coin, 12345);
                wallet = add_amount(wallet, Currency.token, 67);
                const $doc = render_full_inventory(inventory, wallet);
                console.log(rich_text_to_ansi($doc));
            });
        });
    });
});
//# sourceMappingURL=inventory_spec.js.map