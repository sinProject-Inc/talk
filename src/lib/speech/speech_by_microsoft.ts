import { MICROSOFT_SPEECH_KEY } from '$env/static/private'
import type { Speech } from '$lib/speech/speech'
import * as microsoft_speech_sdk from 'microsoft-cognitiveservices-speech-sdk'
import type { LocaleCode } from '../language/locale_code'
import { MicrosoftVoice } from './voice/microsoft_voice'
import { SpeechSound } from './sound/speech_sound'
import type { SpeechText } from './speech_text'

export class SpeechByMicrosoft implements Speech {
	public constructor(
		protected readonly _speech_text: SpeechText,
		protected readonly _locale_code: LocaleCode
	) {}

	public async speak(): Promise<SpeechSound> {
		const microsoft_voice = MicrosoftVoice.from_locale_code(this._locale_code)
		const speech_config = microsoft_speech_sdk.SpeechConfig.fromSubscription(
			MICROSOFT_SPEECH_KEY,
			'japanwest'
		)

		speech_config.speechSynthesisOutputFormat =
			microsoft_speech_sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
		speech_config.speechSynthesisVoiceName = microsoft_voice.name

		const synthesizer = new microsoft_speech_sdk.SpeechSynthesizer(speech_config)

		return new Promise((resolve, reject) => {
			synthesizer.speakTextAsync(
				this._speech_text.text,
				(result) => {
					if (result) {
						// console.log('result', result)
						const audio = result.audioData
						const uint8_array = new Uint8Array(audio)
						const speech_sound = new SpeechSound(uint8_array)
						// console.log('audio', audio)
						resolve(speech_sound)
					} else {
						reject('No result')
					}
				},
				(error) => {
					console.error(error)
					reject(error)
				}
			)
		})
	}
}
