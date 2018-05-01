"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const state_inventory_1 = require("@oh-my-rpg/state-inventory");
const state_wallet_1 = require("@oh-my-rpg/state-wallet");
const { rich_text_to_ansi } = require('../../../../apps/the-npm-rpg/src/utils/rich_text_to_ansi');
const prettyjson = require('prettyjson');
function prettify_json(data, options = {}) {
    return prettyjson.render(data, options);
}
const _1 = require(".");
describe('🔠  view to @offirmo/rich-text-format', function () {
    describe('📦  backpack rendering', function () {
        context('when empty', function () {
            it('should render properly', () => {
                let inventory = state_inventory_1.create();
                const $doc = _1.render_backpack(inventory);
                const str = RichText.to_text($doc);
                chai_1.expect(str).to.be.a('string');
                chai_1.expect(str).to.contain('empty');
            });
        });
        context('when not empty', function () {
            it('should render properly', () => {
                let inventory = state_inventory_1.create();
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.remove_item_from_unslotted(inventory, inventory.unslotted[4].uuid);
                const $doc = _1.render_backpack(inventory);
                const str = RichText.to_text($doc);
                chai_1.expect(str).to.be.a('string');
                chai_1.expect(str).not.to.contain(' 0.');
                chai_1.expect(str).to.contain(' a.');
                chai_1.expect(str).to.contain(' e.');
                chai_1.expect(str).not.to.contain(' f.');
            });
        });
        describe('demo', function () {
            it('shows off', () => {
                let inventory = state_inventory_1.create();
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.remove_item_from_unslotted(inventory, inventory.unslotted[4].uuid);
                const $doc = _1.render_backpack(inventory);
                console.log(rich_text_to_ansi($doc));
            });
        });
    });
    describe('⚔ 🛡  active equipment rendering', function () {
        context('when empty', function () {
            it('should render properly', () => {
                let inventory = state_inventory_1.create();
                const $doc = _1.render_equipment(inventory);
                const str = RichText.to_text($doc);
                chai_1.expect(str).to.be.a('string');
                chai_1.expect(str).to.contain('armor : -');
                chai_1.expect(str).to.contain('weapon: -');
            });
        });
        context('when not empty', function () {
            it('should render properly', () => {
                let inventory = state_inventory_1.create();
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.DEMO_WEAPON_1);
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.DEMO_ARMOR_2);
                inventory = state_inventory_1.equip_item(inventory, logic_weapons_1.DEMO_WEAPON_1.uuid);
                inventory = state_inventory_1.equip_item(inventory, logic_armors_1.DEMO_ARMOR_2.uuid);
                const $doc = _1.render_equipment(inventory);
                const str = RichText.to_text($doc);
                chai_1.expect(str).to.be.a('string');
                chai_1.expect(str).to.contain('armor : legendary Apprentice’s Brass Belt +8 [4022 ↔ 4732]');
                chai_1.expect(str).to.contain('weapon: uncommon Adjudicator’s Admirable Axe [19 ↔ 133]');
            });
        });
        describe('demo', function () {
            it('shows off', () => {
                let inventory = state_inventory_1.create();
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.DEMO_WEAPON_1);
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.DEMO_ARMOR_2);
                inventory = state_inventory_1.equip_item(inventory, logic_weapons_1.DEMO_WEAPON_1.uuid);
                inventory = state_inventory_1.equip_item(inventory, logic_armors_1.DEMO_ARMOR_2.uuid);
                const $doc = _1.render_equipment(inventory);
                console.log(rich_text_to_ansi($doc));
            });
        });
    });
    describe('⚔ 🛡 💰 📦  full inventory rendering', function () {
        describe('demo', function () {
            it('shows off', () => {
                let inventory = state_inventory_1.create();
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.DEMO_WEAPON_1);
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.DEMO_ARMOR_2);
                inventory = state_inventory_1.equip_item(inventory, logic_weapons_1.DEMO_WEAPON_1.uuid);
                inventory = state_inventory_1.equip_item(inventory, logic_armors_1.DEMO_ARMOR_2.uuid);
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.add_item(inventory, logic_weapons_1.generate_random_demo_weapon());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.add_item(inventory, logic_armors_1.generate_random_demo_armor());
                inventory = state_inventory_1.remove_item_from_unslotted(inventory, inventory.unslotted[4].uuid);
                let wallet = state_wallet_1.create();
                wallet = state_wallet_1.add_amount(wallet, state_wallet_1.Currency.coin, 12345);
                wallet = state_wallet_1.add_amount(wallet, state_wallet_1.Currency.token, 67);
                const $doc = _1.render_full_inventory(inventory, wallet);
                console.log(rich_text_to_ansi($doc));
            });
        });
    });
});
//# sourceMappingURL=inventory_spec.js.map