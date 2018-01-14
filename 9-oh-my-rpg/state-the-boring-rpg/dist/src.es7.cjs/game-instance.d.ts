import { State } from './types';
import { SoftExecutionContext } from './sec';
interface CreateParams {
    SEC: SoftExecutionContext;
    get_latest_state: () => State;
    update_state: (state: State) => void;
}
declare function create_game_instance({SEC, get_latest_state, update_state}: CreateParams): any;
export { CreateParams, create_game_instance };
