export enum ModifierKeySymbols {
	alt = 'Alt',
	shift = '⇧',
	control = 'Ctrl',
	command = '⌘',
}

export class ModifierKeySymbol {
	public constructor(private _symbol: ModifierKeySymbols) {}

	public get symbol(): ModifierKeySymbols {
		return this._symbol
	}

	public get is_alphanumeric(): boolean {
		const alphanumeric_regex = /^[a-z0-9]+$/i

		return alphanumeric_regex.test(this._symbol)
	}
}
