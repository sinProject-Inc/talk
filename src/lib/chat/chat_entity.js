/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import { ChatMessage } from './chat_message'
import { ChatName } from './chat_name'

export class ChatEntity {
	/**
	 * @public
	 * @param {string} name
	 * @param {string} message
	 */
	constructor(name, message) {
		/** @private @readonly @type {ChatName} */
		this._name = new ChatName(name)

		/** @private @readonly @type {ChatMessage} */
		this._message = new ChatMessage(message)
	}

	/**
	 * @public
	 * @returns {ChatName}
	 */
	get name() {
		return this._name
	}

	/**
	 * @public
	 * @returns {ChatMessage}
	 */
	get message() {
		return this._message
	}
}
