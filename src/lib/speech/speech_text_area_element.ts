import type { Message } from '$lib/view/message'
import type { SpeechElement } from './speech_element'

export class SpeechTextAreaElement implements SpeechElement {
	public constructor(
		private readonly _element: HTMLTextAreaElement,
		private readonly _hint_message: Message
	) {}

	public show_hint(): void {
		this._element.placeholder = `${this._hint_message.text}`
	}

	public set text(text: string) {
		console.log('text', text)
		this._element.value = text
	}
}
