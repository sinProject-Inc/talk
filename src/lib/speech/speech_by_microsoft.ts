import { MICROSOFT_SPEECH_KEY } from '$env/static/private'
import type { LocaleCode } from '$lib/language/locale_code'
import { SpeechSound } from '$lib/speech/sound/speech_sound'
import type { Speech } from '$lib/speech/speech'
import type { SpeechText } from '$lib/speech/speech_text'
import { MicrosoftVoice } from '$lib/speech/voice/microsoft_voice'
import * as MicrosoftSpeechSdk from 'microsoft-cognitiveservices-speech-sdk'

export class SpeechByMicrosoft implements Speech {
	private static readonly _region = 'japanwest'

	public constructor(
		private readonly _speech_text: SpeechText,
		private readonly _locale_code: LocaleCode
	) {}

	public async speak(): Promise<SpeechSound> {
		const microsoft_voice = MicrosoftVoice.from_locale_code(this._locale_code)
		const speech_config = MicrosoftSpeechSdk.SpeechConfig.fromSubscription(
			MICROSOFT_SPEECH_KEY,
			SpeechByMicrosoft._region
		)

		speech_config.speechSynthesisOutputFormat =
			MicrosoftSpeechSdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
		speech_config.speechSynthesisVoiceName = microsoft_voice.name

		const synthesizer = new MicrosoftSpeechSdk.SpeechSynthesizer(speech_config)

		return new Promise((resolve, reject) => {
			synthesizer.speakTextAsync(
				this._speech_text.text,
				(result) => {
					if (result) {
						const audio = result.audioData
						const uint8_array = new Uint8Array(audio)
						const speech_sound = new SpeechSound(uint8_array)
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
