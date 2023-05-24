import { OSInfo, OS } from './os_info'
import { ModifierKeySymbol, ModifierKeySymbols } from './modifier_key_symbol'

export class ModifierKey {
	private readonly _os_info = new OSInfo()

	public get_control_or_command_symbol(): ModifierKeySymbol {
		const os = this._os_info.get_os()

		if (os === OS.mac_os || os === OS.ios) return new ModifierKeySymbol(ModifierKeySymbols.command)

		return new ModifierKeySymbol(ModifierKeySymbols.control)
	}
}
