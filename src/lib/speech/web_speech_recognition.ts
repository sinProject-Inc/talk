import type { LocaleCode } from '../language/locale_code'
import type { SpeechElement } from './speech_element'
import { TextContent } from './text_content'

export class WebSpeechRecognition {
	private readonly _recognition: SpeechRecognition
	private _final_transcript = ''

	public constructor(
		private readonly _locale_code: LocaleCode,
		private readonly _speech_element: SpeechElement,
		private readonly _on_end_callback?: () => void
	) {
		if (!('webkitSpeechRecognition' in window)) {
			this._speech_element.text_content = new TextContent('Speech Recognition Not Available')
			throw new Error('Speech Recognition Not Available')
		}

		const speech_recognition = window.SpeechRecognition || window.webkitSpeechRecognition
		this._recognition = new speech_recognition()

		this._recognition.lang = this._locale_code.code
		this._recognition.interimResults = true
		this._recognition.onend = this._on_end_callback
	}

	private _set_on_result(): void {
		this._final_transcript = ''

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this._recognition.onresult = (event: any): void => {
			let interim_transcript = ''

			for (let i = event.resultIndex; i < event.results.length; i++) {
				const transcript = event.results[i][0].transcript

				if (event.results[i].isFinal) {
					this._final_transcript += transcript
				} else {
					interim_transcript = transcript
				}

				this._speech_element.text_content = new TextContent(this._final_transcript + interim_transcript)
			}
		}
	}

	private _start(continuous: boolean): void {
		this._set_on_result()

		this._recognition.continuous = continuous

		this._speech_element.show_hint()
		this._recognition.start()
	}

	public start_not_continuous(): void {
		this._start(false)
	}

	public start_continuous(): void {
		this._start(true)
	}

	public stop(): void {
		this._recognition.stop()
	}
}
