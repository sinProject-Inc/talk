import { OSInfo, OS } from './os_info'

enum ModifierKeySymbols {
	alt = 'Alt',
	shift = '⇧',
	control = 'Ctrl',
	command = '⌘',
}

export class ModifierKey {
	private readonly _os_info = new OSInfo()

	public get_control_or_command_symbol(): ModifierKeySymbols {
		const os = this._os_info.get_os()

		if (os === OS.mac_os || os === OS.ios) return ModifierKeySymbols.command

		return ModifierKeySymbols.control
	}

	public is_alphanumeric(symbol: ModifierKeySymbols): boolean {
		const alphanumeric_regex = /^[a-z0-9]+$/i

		return alphanumeric_regex.test(symbol)
	}
}
