import type { LocaleCode } from '$lib/locale/locale_code'
import type { SpeechElement } from './speech_element'
import { TextContent } from './text_content'

// NOTE: TypeScriptでSpeechRecognitionの型をきちんと書く https://qiita.com/akkadaska/items/9c1781052038db444182

interface ISpeechRecognitionEvent {
	isTrusted?: boolean
	results: {
		isFinal: boolean
		[key: number]:
			| undefined
			| {
					transcript: string
			  }
	}[]
}
interface ISpeechRecognition extends EventTarget {
	lang: string
	continuous: boolean
	onend: (() => void) | undefined
	interimResults: boolean
	onresult: (event: ISpeechRecognitionEvent) => void

	abort(): void
	start(): void
	stop(): void
}

type SpeechRecognitionConstructor = new () => ISpeechRecognition

interface IWindow extends Window {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	SpeechRecognition: SpeechRecognitionConstructor
	webkitSpeechRecognition: SpeechRecognitionConstructor
}

declare const window: IWindow

export class WebSpeechRecognition {
	private readonly _recognition: ISpeechRecognition
	private readonly _is_android: boolean
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
		this._recognition.onend = this._on_end_callback

		this._is_android = window.navigator.userAgent.toLowerCase().includes('android')
		this._recognition.interimResults = !this._is_android
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

				this._speech_element.text_content = new TextContent(
					this._final_transcript + interim_transcript
				)
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
