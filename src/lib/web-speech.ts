import type { LocaleCode } from "./value/value_object/string_value_object/locale_code"
import type { Message } from "./value/value_object/string_value_object/text_value_object/message"

export class WebSpeech {
	public static recognition(locale_code: LocaleCode, speech_text_element: HTMLElement, recognizing_message: Message): void {
		if (!('webkitSpeechRecognition' in window)) {
			speech_text_element.textContent = 'Speech Recognition Not Available'
			return
		}

		console.log('element', speech_text_element)
		speech_text_element.textContent = `${recognizing_message}...`

		const speech_recognition = window.SpeechRecognition || window.webkitSpeechRecognition
		const recognition = new speech_recognition()

		recognition.lang = locale_code.string
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

			speech_text_element.textContent = finalTranscript + interimTranscript
		}

		recognition.start()
	}
}
