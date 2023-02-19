import type { Message } from '$lib/view/message'
import type { SpeechElement } from './speech_element'

export class SpeechTextElement implements SpeechElement {
	public constructor(
		private readonly _element: HTMLElement,
		private readonly _hint_message: Message
	) {}

	public show_hint(): void {
		this._element.textContent = `${this._hint_message.text}`
	}

	public set text_content(text: string) {
		this._element.textContent = text
	}
}
