import { Basename } from '../../types'
import { Type} from './types'

export const LIB = '📂'

function _get_special_folder_final_base(type: Type): Basename {
	return `- ${type}`
}
export const SPECIAL_FOLDERⵧINBOX__BASENAME = _get_special_folder_final_base(Type.inbox)
export const SPECIAL_FOLDERⵧCANT_AUTOSORT__BASENAME = _get_special_folder_final_base(Type.cant_autosort)
export const SPECIAL_FOLDERⵧCANT_RECOGNIZE__BASENAME = _get_special_folder_final_base(Type.cant_recognize)
export const SPECIAL_FOLDERS_BASENAMES = [
	SPECIAL_FOLDERⵧINBOX__BASENAME,
	SPECIAL_FOLDERⵧCANT_AUTOSORT__BASENAME,
	SPECIAL_FOLDERⵧCANT_RECOGNIZE__BASENAME,
]
