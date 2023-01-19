import type { LocaleCode } from "./string/locale_code"
import type { Message } from "./string/valid_text/message"

export class WebSpeech {
	public constructor(private readonly _speech_text_element: HTMLElement, private readonly _recognizing_message: Message) {}

	public recognition(locale_code: LocaleCode,): void {
		if (!('webkitSpeechRecognition' in window)) {
			this._speech_text_element.textContent = 'Speech Recognition Not Available'
			return
		}

		console.log('element', this._speech_text_element)
		this._speech_text_element.textContent = `${this._recognizing_message.text}...`

		const speech_recognition = window.SpeechRecognition || window.webkitSpeechRecognition
		const recognition = new speech_recognition()

		recognition.lang = locale_code.code
		recognition.interimResults = true
		// recognition.continuous = true;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		// recognition.onresult = (event: any): void => {
		// 	const result = event.results[0][0].transcript
		// 	textarea.value = result
		// }

		let finalTranscript = ''

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		recognition.onresult = (event: any): void => {
			let interimTranscript = ''

			for (let i = event.resultIndex; i < event.results.length; i++) {
				const transcript = event.results[i][0].transcript

				if (event.results[i].isFinal) {
					finalTranscript += transcript
				} else {
					interimTranscript = transcript
				}
			}

			this._speech_text_element.textContent = finalTranscript + interimTranscript
		}

		recognition.start()
	}
}
