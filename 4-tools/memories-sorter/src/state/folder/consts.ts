import { Basename } from '../../types'
import { Type} from './types'

export const LIB = '📂'

function _get_special_folder_final_base(type: Type): Basename {
	return `- ${type}`
}
export const SPECIAL_FOLDER__INBOX__BASENAME = _get_special_folder_final_base(Type.inbox)
export const SPECIAL_FOLDER__CANT_AUTOSORT__BASENAME = _get_special_folder_final_base(Type.cant_autosort)
export const SPECIAL_FOLDER__CANT_RECOGNIZE__BASENAME = _get_special_folder_final_base(Type.cant_recognize)
export const SPECIAL_FOLDERS__BASENAMES = [
	SPECIAL_FOLDER__INBOX__BASENAME,
	SPECIAL_FOLDER__CANT_AUTOSORT__BASENAME,
	SPECIAL_FOLDER__CANT_RECOGNIZE__BASENAME,
]
