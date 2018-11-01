import { expect } from 'chai';
import { test_migrations } from '@oh-my-rpg/migration-tester';
import { SCHEMA_VERSION } from '../../consts';
import { migrate_to_latest } from '.';
import { get_lib_SEC } from '../../sec';
import { create } from '..';
import { DEMO_STATE, MIGRATION_HINTS_FOR_TESTS } from '../../examples';
describe('@oh-my-rpg/state-the-boring-rpg - schema migration', function () {
    it('should correctly migrate a fresh state', () => {
        const old_state = create();
        const new_state = migrate_to_latest(get_lib_SEC(), old_state);
        expect(new_state).to.deep.equal(old_state);
    });
    describe('migration of an existing state', function () {
        // TODO ALPHA remove skip
        test_migrations.skip({
            use_hints: true,
            //read_only: false, // XXX
            migration_hints_for_chaining: MIGRATION_HINTS_FOR_TESTS,
            SCHEMA_VERSION,
            LATEST_EXPECTED_DATA: DEMO_STATE,
            migrate_to_latest: migrate_to_latest.bind(null, get_lib_SEC()),
            absolute_dir_path: require('path').join(__dirname, '../../../src/state/migrations/migrations_of_active_state_specs'),
            describe, context, it, expect,
        });
    });
    describe('migration of a new state', function () {
        const new_state = create();
        // alter seed to avoid migration
        new_state.prng.seed = 1234; // should match blank state spec
        // TODO ALPHA remove skip
        test_migrations.skip({
            use_hints: false,
            //read_only: false, // XXX
            SCHEMA_VERSION,
            LATEST_EXPECTED_DATA: new_state,
            migrate_to_latest: migrate_to_latest.bind(null, get_lib_SEC()),
            absolute_dir_path: require('path').join(__dirname, '../../../src/state/migrations/migrations_of_blank_state_specs'),
            describe, context, it, expect,
        });
    });
    describe('migration of known failures', function () {
        it('should migrate v4 -> v6 20181029', () => {
            const old_state = {
                "schema_version": 4,
                "revision": 12,
                "avatar": {
                    "schema_version": 2,
                    "revision": 10,
                    "name": "Pertenax",
                    "klass": "novice",
                    "attributes": {
                        "level": 1,
                        "health": 2,
                        "mana": 4,
                        "strength": 1,
                        "agility": 2,
                        "charisma": 2,
                        "wisdom": 3,
                        "luck": 1
                    }
                },
                "inventory": {
                    "schema_version": 1,
                    "revision": 0,
                    "unslotted_capacity": 20,
                    "slotted": {
                        "weapon": {
                            "slot": "weapon",
                            "base_hid": "spoon",
                            "qualifier1_hid": "used",
                            "qualifier2_hid": "noob",
                            "element_type": "item",
                            "uuid": "uu1d5AmXA6e0LLHYgF7PfWt5",
                            "quality": "common",
                            "base_strength": 1,
                            "enhancement_level": 0
                        },
                        "armor": {
                            "base_hid": "socks",
                            "qualifier1_hid": "used",
                            "qualifier2_hid": "noob",
                            "element_type": "item",
                            "uuid": "uu1gRywpWg9I25_xeQaLTSH6",
                            "slot": "armor",
                            "quality": "common",
                            "base_strength": 1,
                            "enhancement_level": 0
                        }
                    },
                    "unslotted": [
                        {
                            "base_hid": "breastplate",
                            "qualifier1_hid": "holy",
                            "qualifier2_hid": "twink",
                            "element_type": "item",
                            "uuid": "uu1xpmhN5ykqYVFGM_B9tfsi",
                            "slot": "armor",
                            "quality": "common",
                            "base_strength": 3,
                            "enhancement_level": 0
                        }
                    ]
                },
                "wallet": {
                    "schema_version": 1,
                    "revision": 0,
                    "coin_count": 11,
                    "token_count": 2
                },
                "prng": {
                    "schema_version": 2,
                    "revision": 0,
                    "seed": 438136422,
                    "use_count": 66,
                    "recently_encountered_by_id": {
                        "adventure_archetype": [
                            "famous_stone_emerald",
                            "make_friends",
                            "erika",
                            "found_silver_potion",
                            "critters",
                            "refreshing_nap",
                            "fight_won_loot"
                        ]
                    }
                },
                "last_adventure": {
                    "uuid": "uu1jGlwwLwdbkOC3OzfVDdFs",
                    "hid": "fight_won_loot",
                    "good": true,
                    "encounter": {
                        "name": "gorilla",
                        "level": 1,
                        "rank": "common",
                        "possible_emoji": "🦍"
                    },
                    "gains": {
                        "level": 0,
                        "health": 0,
                        "mana": 0,
                        "strength": 0,
                        "agility": 0,
                        "charisma": 0,
                        "wisdom": 0,
                        "luck": 0,
                        "coin": 0,
                        "token": 0,
                        "armor": {
                            "base_hid": "breastplate",
                            "qualifier1_hid": "holy",
                            "qualifier2_hid": "twink",
                            "element_type": "item",
                            "uuid": "uu1xpmhN5ykqYVFGM_B9tfsi",
                            "slot": "armor",
                            "quality": "common",
                            "base_strength": 3,
                            "enhancement_level": 0
                        },
                        "weapon": null,
                        "armor_improvement": false,
                        "weapon_improvement": false
                    }
                },
                "click_count": 11,
                "good_click_count": 11,
                "meaningful_interaction_count": 12
            };
            const new_state = migrate_to_latest(get_lib_SEC(), old_state);
        });
        it.only('should migrate LiidLidd 20181029', () => {
            const old_state = {
                "schema_version": 6,
                "revision": 485,
                "uuid": "uu1EO9VgTjPlR1YPj0yfdWjG",
                "creation_date": "20180813_00h33",
                "avatar": {
                    "schema_version": 2,
                    "revision": 326,
                    "name": "LiddiLidd",
                    "klass": "warrior",
                    "attributes": {
                        "level": 19,
                        "health": 51,
                        "mana": 41,
                        "strength": 83,
                        "agility": 30,
                        "charisma": 30,
                        "wisdom": 46,
                        "luck": 31
                    }
                },
                "inventory": {
                    "schema_version": 1,
                    "revision": 49,
                    "unslotted_capacity": 20,
                    "slotted": {
                        "weapon": {
                            "element_type": "item",
                            "uuid": "uu1G8147IKx7tW_WJ0Lrwx1X",
                            "slot": "weapon",
                            "quality": "rare",
                            "base_hid": "scythe",
                            "qualifier1_hid": "skeleton",
                            "qualifier2_hid": "judgement",
                            "base_strength": 17,
                            "enhancement_level": 2
                        },
                        "armor": {
                            "base_hid": "crown",
                            "qualifier1_hid": "crafted",
                            "qualifier2_hid": "guard",
                            "element_type": "item",
                            "uuid": "uu1A9JfDl62yLMaQv6OPJqDW",
                            "slot": "armor",
                            "quality": "epic",
                            "base_strength": 10,
                            "enhancement_level": 2
                        }
                    },
                    "unslotted": [{
                            "slot": "weapon",
                            "base_hid": "axe",
                            "qualifier1_hid": "heavy",
                            "qualifier2_hid": "judgement",
                            "element_type": "item",
                            "uuid": "uu1ex3Saw65VL511tjj88Rcw",
                            "quality": "rare",
                            "base_strength": 8,
                            "enhancement_level": 3
                        }, {
                            "slot": "weapon",
                            "base_hid": "spoon",
                            "qualifier1_hid": "strange",
                            "qualifier2_hid": "warfield_king",
                            "element_type": "item",
                            "uuid": "uu1pyQZdLSWCobubeQIiq~kM",
                            "quality": "rare",
                            "base_strength": 9,
                            "enhancement_level": 0
                        }, {
                            "element_type": "item",
                            "uuid": "uu1vyfz_cp_QtUBu0pQ7IJJ5",
                            "slot": "weapon",
                            "quality": "uncommon",
                            "base_hid": "spoon",
                            "qualifier1_hid": "cruel",
                            "qualifier2_hid": "expert",
                            "base_strength": 20,
                            "enhancement_level": 0
                        }, {
                            "element_type": "item",
                            "uuid": "uu1xeOJG3VqJA6sfyZCNH4vY",
                            "slot": "weapon",
                            "quality": "uncommon",
                            "base_hid": "longsword",
                            "qualifier1_hid": "solid",
                            "qualifier2_hid": "pirate",
                            "base_strength": 19,
                            "enhancement_level": 0
                        }, {
                            "element_type": "item",
                            "uuid": "uu16x_hLEP~p_ys1RnyH7jO1",
                            "slot": "weapon",
                            "quality": "uncommon",
                            "base_hid": "staff",
                            "qualifier1_hid": "unwavering",
                            "qualifier2_hid": "twink",
                            "base_strength": 14,
                            "enhancement_level": 0
                        }, {
                            "element_type": "item",
                            "uuid": "uu1RW6orqNO2FdLuKuSGw7UW",
                            "slot": "weapon",
                            "quality": "common",
                            "base_hid": "harp",
                            "qualifier1_hid": "used",
                            "qualifier2_hid": "conqueror",
                            "base_strength": 13,
                            "enhancement_level": 0
                        }, {
                            "element_type": "item",
                            "uuid": "uu16zN14nNXA1~i6C8pWmpAS",
                            "slot": "weapon",
                            "quality": "common",
                            "base_hid": "bow",
                            "qualifier1_hid": "simple",
                            "qualifier2_hid": "dwarven",
                            "base_strength": 1,
                            "enhancement_level": 0
                        }, {
                            "slot": "weapon",
                            "base_hid": "spoon",
                            "qualifier1_hid": "used",
                            "qualifier2_hid": "noob",
                            "element_type": "item",
                            "uuid": "uu1eVztoWbAHSjCguNKsXtfr",
                            "quality": "common",
                            "base_strength": 1,
                            "enhancement_level": 0
                        }, {
                            "base_hid": "hat",
                            "qualifier1_hid": "brass",
                            "qualifier2_hid": "twink",
                            "element_type": "item",
                            "uuid": "uu1BtdywUcy0i6NBedHBU_Ub",
                            "slot": "armor",
                            "quality": "rare",
                            "base_strength": 18,
                            "enhancement_level": 0
                        }, {
                            "base_hid": "greaves",
                            "qualifier1_hid": "bone",
                            "qualifier2_hid": "king",
                            "element_type": "item",
                            "uuid": "uu1sWc7Vx54Hx2BdS7TThpjh",
                            "slot": "armor",
                            "quality": "rare",
                            "base_strength": 16,
                            "enhancement_level": 0
                        }, {
                            "base_hid": "shoulders",
                            "qualifier1_hid": "strange",
                            "qualifier2_hid": "training",
                            "element_type": "item",
                            "uuid": "uu1LVfRq7_d9MUWKWCutfG89",
                            "slot": "armor",
                            "quality": "rare",
                            "base_strength": 12,
                            "enhancement_level": 1
                        }, {
                            "base_hid": "socks",
                            "qualifier1_hid": "crafted",
                            "qualifier2_hid": "tormentor",
                            "element_type": "item",
                            "uuid": "uu1Ag386TttTJ1CQZbnWdNnr",
                            "slot": "armor",
                            "quality": "rare",
                            "base_strength": 12,
                            "enhancement_level": 0
                        }, {
                            "base_hid": "shoes",
                            "qualifier1_hid": "silver",
                            "qualifier2_hid": "expert",
                            "element_type": "item",
                            "uuid": "uu1sL8TkQptW2cyIcT2lAalT",
                            "slot": "armor",
                            "quality": "rare",
                            "base_strength": 12,
                            "enhancement_level": 0
                        }, {
                            "base_hid": "crown",
                            "qualifier1_hid": "engraved",
                            "qualifier2_hid": "nightmare",
                            "element_type": "item",
                            "uuid": "uu19okCOMkNIUX6WS8YSfOs5",
                            "slot": "armor",
                            "quality": "rare",
                            "base_strength": 10,
                            "enhancement_level": 0
                        }, {
                            "base_hid": "cloak",
                            "qualifier1_hid": "strange",
                            "qualifier2_hid": "guard",
                            "element_type": "item",
                            "uuid": "uu14oNLRF8NfIdQ9xh1Jdj_~",
                            "slot": "armor",
                            "quality": "uncommon",
                            "base_strength": 6,
                            "enhancement_level": 0
                        }, {
                            "base_hid": "socks",
                            "qualifier1_hid": "cursed",
                            "qualifier2_hid": "mercenary",
                            "element_type": "item",
                            "uuid": "uu1aZCJ7cCVk5Eh4klK27QiY",
                            "slot": "armor",
                            "quality": "uncommon",
                            "base_strength": 4,
                            "enhancement_level": 0
                        }, {
                            "base_hid": "socks",
                            "qualifier1_hid": "used",
                            "qualifier2_hid": "noob",
                            "element_type": "item",
                            "uuid": "uu1qA8wssenna9fO6fjl4p~X",
                            "slot": "armor",
                            "quality": "common",
                            "base_strength": 1,
                            "enhancement_level": 0
                        }]
                },
                "wallet": { "schema_version": 1, "revision": 60, "coin_count": 54260, "token_count": 28 },
                "prng": {
                    "schema_version": 2,
                    "revision": 452,
                    "seed": 1425674993,
                    "use_count": 2867,
                    "recently_encountered_by_id": {
                        "adventure_archetype--good": ["mana_mana", "vampire_castle", "weird_duck", "critters", "useless", "fight_won_coins", "found_green_mushroom", "dragon_kebab", "rachel", "walk_in_mordor", "famous_stone_ruby", "fight_won_loot", "rematch", "ate_zombie", "famous_stone_sapphire", "colossal_cave", "lost", "caravan_failure", "found_yellow_mushroom", "chicken_slayer"],
                        "adventure_archetype--bad": []
                    }
                },
                "energy": {
                    "schema_version": 1,
                    "revision": 433,
                    "max_energy": 7,
                    "base_energy_refilling_rate_per_day": 7,
                    "last_date": "ts1_20181028_21h15:18.995",
                    "last_available_energy_float": 0.020496999999999987
                },
                "last_adventure": {
                    "uuid": "uu1r_Gm~S6w6CyMlSG6p2rJa",
                    "hid": "chicken_slayer",
                    "good": true,
                    "gains": {
                        "level": 0,
                        "health": 0,
                        "mana": 0,
                        "strength": 1,
                        "agility": 0,
                        "charisma": 0,
                        "wisdom": 0,
                        "luck": 0,
                        "coin": 0,
                        "token": 0,
                        "armor": null,
                        "weapon": null,
                        "armor_improvement": false,
                        "weapon_improvement": false
                    }
                },
                "click_count": 433,
                "good_click_count": 429,
                "meaningful_interaction_count": 485
            };
            const new_state = migrate_to_latest(get_lib_SEC(), old_state);
        });
    });
});
//# sourceMappingURL=index_spec.js.map