import { MICROSOFT_SPEECH_KEY } from '$env/static/private'
import { SpeechSound } from '$lib/speech/sound/speech_sound'
import type { Speech } from '$lib/speech/speech'
import type { SpeechText } from '$lib/speech/speech_text'
import * as MicrosoftSpeechSdk from 'microsoft-cognitiveservices-speech-sdk'
import type { VoiceLocale } from './voice/voice_repository'

export class SpeechByMicrosoft implements Speech {
	private static readonly _region = 'japanwest'

	public constructor(
		private readonly _speech_text: SpeechText,
		private readonly _voice_locale: VoiceLocale
	) {}

	public async speak(): Promise<SpeechSound> {
		const speech_config = MicrosoftSpeechSdk.SpeechConfig.fromSubscription(
			MICROSOFT_SPEECH_KEY,
			SpeechByMicrosoft._region
		)

		speech_config.speechSynthesisOutputFormat =
			MicrosoftSpeechSdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
		speech_config.speechSynthesisVoiceName = this._voice_locale.name

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
