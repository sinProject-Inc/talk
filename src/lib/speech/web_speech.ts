import type { LocaleCode } from "../language/locale_code"
import type { Message } from "../view/message"

export class WebSpeech {
	private _recognition: SpeechRecognition | undefined = undefined

	public constructor(private readonly _speech_text_element: HTMLElement, private readonly _recognizing_message: Message) {}

	public recognition(locale_code: LocaleCode, callback?: () => void, continuous = false): void {
		if (!('webkitSpeechRecognition' in window)) {
			this._speech_text_element.textContent = 'Speech Recognition Not Available'
			return
		}

		this._speech_text_element.textContent = `${this._recognizing_message.text}...`

		const speech_recognition = window.SpeechRecognition || window.webkitSpeechRecognition
		this._recognition = new speech_recognition()
		
		this._recognition.lang = locale_code.code
		this._recognition.interimResults = true
		this._recognition.continuous = continuous

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		// recognition.onresult = (event: any): void => {
		// 	const result = event.results[0][0].transcript
		// 	textarea.value = result
		// }

		let final_transcript = ''

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this._recognition.onresult = (event: any): void => {

			let interim_transcript = ''

			for (let i = event.resultIndex; i < event.results.length; i++) {				
				const transcript = event.results[i][0].transcript

				if (event.results[i].isFinal) {
					final_transcript += transcript
				} else {
					interim_transcript = transcript
				}
			}

			if (this._speech_text_element instanceof HTMLTextAreaElement) {
				this._speech_text_element.value = final_transcript + interim_transcript
			} else {
				this._speech_text_element.textContent = final_transcript + interim_transcript
			}
		}

		if (callback) this._recognition.onend = callback

		this._recognition.start()
	}

	public stop_recognition(): void {
		this._recognition?.stop()
	}
}
