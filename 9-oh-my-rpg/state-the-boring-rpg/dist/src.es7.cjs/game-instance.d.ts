import { State } from './types';
import { SoftExecutionContext } from './sec';
interface CreateParams {
    SEC: SoftExecutionContext;
    get_latest_state: () => State;
    update_state: (state: State) => void;
    client_state: object;
}
declare function create_game_instance({SEC, get_latest_state, update_state, client_state}: CreateParams): any;
export { CreateParams, create_game_instance };
