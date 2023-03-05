export class ChatMessage {
	/**
	 * @public
	 * @param {string} value
	 */
	constructor(value) {
		if (value.length < 1) {
			throw new Error('ChatMessage must be at least 1 character long.')
		}

		/** @private @readonly @type {string} */
		this._value = value
	}

	/**
	 * @public
	 * @returns {string}
	 */
	get value() {
		return this._value
	}
}
