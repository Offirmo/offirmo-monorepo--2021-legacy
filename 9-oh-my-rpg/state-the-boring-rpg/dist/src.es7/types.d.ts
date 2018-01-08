import { Enum } from 'typescript-string-enums';
import { UUID } from '@oh-my-rpg/definitions';
import { Weapon } from '@oh-my-rpg/logic-weapons';
import { Armor } from '@oh-my-rpg/logic-armors';
import { Monster } from '@oh-my-rpg/logic-monsters';
import { State as MetaState } from '@oh-my-rpg/state-meta';
import { State as CharacterState } from '@oh-my-rpg/state-character';
import { State as InventoryState } from '@oh-my-rpg/state-inventory';
import { State as WalletState } from '@oh-my-rpg/state-wallet';
import { State as PRNGState } from '@oh-my-rpg/state-prng';
declare const GainType: {
    weapon: "weapon";
    armor: "armor";
    agility: "agility";
    health: "health";
    level: "level";
    luck: "luck";
    mana: "mana";
    strength: "strength";
    charisma: "charisma";
    wisdom: "wisdom";
    coin: "coin";
    token: "token";
    weapon_improvement: "weapon_improvement";
    armor_improvement: "armor_improvement";
};
declare type GainType = Enum<typeof GainType>;
interface Adventure {
    uuid: UUID;
    hid: string;
    good: boolean;
    encounter?: Monster;
    gains: {
        level: number;
        health: number;
        mana: number;
        strength: number;
        agility: number;
        charisma: number;
        wisdom: number;
        luck: number;
        coin: number;
        token: number;
        weapon: null | Weapon;
        armor: null | Armor;
        weapon_improvement: boolean;
        armor_improvement: boolean;
    };
}
interface State {
    schema_version: number;
    revision: number;
    meta: MetaState;
    avatar: CharacterState;
    inventory: InventoryState;
    wallet: WalletState;
    prng: PRNGState;
    last_adventure: Adventure | null;
    click_count: number;
    good_click_count: number;
    meaningful_interaction_count: number;
}
export { GainType, Adventure, State };
