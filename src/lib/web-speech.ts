export class WebSpeech {
	public static recognition(lang: string, speech_text_element: HTMLElement, recognizing_text: string): void {
		if (!('webkitSpeechRecognition' in window)) {
			speech_text_element.textContent = 'Speech Recognition Not Available'
			return
		}

		console.log('element', speech_text_element)
		speech_text_element.textContent = `${recognizing_text}...`

		const speech_recognition = window.SpeechRecognition || window.webkitSpeechRecognition
		const recognition = new speech_recognition()

		recognition.lang = lang
		recognition.interimResults = true
		// recognition.continuous = true;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		// recognition.onresult = (event: any): void => {
		// 	const result = event.results[0][0].transcript
		// 	textarea.value = result
		// }

		let finalTranscript = ''

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
