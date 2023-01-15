import * as microsoft_speech_sdk from 'microsoft-cognitiveservices-speech-sdk'
import { MICROSOFT_SPEECH_KEY } from '$env/static/private'
import type { LocaleCode } from './value/value_object/string_value_object/locale_code'
import type { SpeechText } from './value/value_object/string_value_object/text_value_object/speech_text'
import { SpeechSound } from './value/value_object/string_value_object/speech_sound'
import { MicrosoftVoice } from './value/value_object/string_value_object/microsoft_voice'

export class SpeechByMicrosoft {
	public static async speak_text(speech_text: SpeechText, locale_code: LocaleCode): Promise<SpeechSound> {
		const microsoft_voice = MicrosoftVoice.fromLocaleCode(locale_code)
		const speech_config = microsoft_speech_sdk.SpeechConfig.fromSubscription(
			MICROSOFT_SPEECH_KEY,
			'japanwest'
		)

		speech_config.speechSynthesisOutputFormat =
			microsoft_speech_sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
		speech_config.speechSynthesisVoiceName = microsoft_voice.string

		const synthesizer = new microsoft_speech_sdk.SpeechSynthesizer(speech_config)

		return new Promise((resolve, reject) => {
			synthesizer.speakTextAsync(
				speech_text.string,
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
