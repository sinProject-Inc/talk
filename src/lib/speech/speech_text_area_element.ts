import type { Message } from '$lib/view/message'
import type { SpeechElement } from './speech_element'
import type { TextContent } from './text_content'

export class SpeechTextAreaElement implements SpeechElement {
	public constructor(
		private readonly _element: HTMLTextAreaElement,
		private readonly _hint_message: Message
	) {}

	public show_hint(): void {
		this._element.placeholder = `${this._hint_message.text}`
	}

	public set text_content(text_content: TextContent) {
		this._element.value = text_content.text
	}
}
