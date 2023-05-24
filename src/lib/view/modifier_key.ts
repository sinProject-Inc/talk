import { browser } from '$app/environment'
import { OSInfo } from './os_info'

enum ModifierKeySymbol {
	alt = 'Alt',
	shift = '⇧',
	control = 'Ctrl',
	command = '⌘',
	unknown = '',
}

export class CommandOrControlShortcut {
	private _modifier_key_symbol: ModifierKeySymbol

	public constructor() {
		this._modifier_key_symbol = this._get_symbol()
	}

	private _get_symbol(): ModifierKeySymbol {
		const is_mac_or_ios = OSInfo.is_mac_or_ios()
		const modifier_key = is_mac_or_ios ? ModifierKeySymbol.command : ModifierKeySymbol.control

		return modifier_key
	}

	public get is_alphanumeric(): boolean {
		const alphanumeric_regex = /^[a-z0-9]+$/i

		return alphanumeric_regex.test(this._modifier_key_symbol)
	}

	public static generate(key: string): string {
		if (!browser) return ''

		const control_or_command = new CommandOrControlShortcut()
		const spacer = control_or_command.is_alphanumeric ? ' ' : ''

		return `${control_or_command._modifier_key_symbol}${spacer}${key.toUpperCase()}`
	}
}
