export class EventKey {

	public constructor(private readonly _event: KeyboardEvent) {}

	private get _is_composing(): boolean {
		return this._event.isComposing
	}

	public get is_enter(): boolean {
		if (this._is_composing) return false
		if (this._event.shiftKey) return false
		if (this._event.ctrlKey) return false
		
		return this._event.key === 'Enter'
	}
}