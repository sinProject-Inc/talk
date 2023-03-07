// import type { Message } from '$lib/view/message'
import type { SpeechElement } from './speech_element'
import type { TextContent } from './text_content'

export class SpeechDivElement implements SpeechElement {
	public constructor(
		private readonly _element: HTMLDivElement,
		// private readonly _hint_message: Message
	) {}

	public show_hint(): void {
		// DO NOT USE placeholder
		// this._element.placeholder = `${this._hint_message.text}`
	}

	public set text_content(text_content: TextContent) {
		this._element.innerText = text_content.text
	}
}
