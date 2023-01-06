import * as microsoft_speech_sdk from 'microsoft-cognitiveservices-speech-sdk'
import { MICROSOFT_SPEECH_KEY } from '$env/static/private'

export class SpeechByMicrosoft {
	// Language and voice support for the Speech service
	// https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support?tabs=stt-tts
	private static _get_voice_name(locale_code: string): string {
		switch (locale_code) {
			case 'en-US':
				return 'en-US-AriaNeural'
			case 'en-GB':
				return 'en-GB-AlfieNeural'
			case 'ja-JP':
				return 'ja-JP-KeitaNeural'
			case 'yue-HK':
				return 'yue-CN-XiaoMinNeural'
			case 'ko-KR':
				return 'ko-KR-BongJinNeural'
			case 'km-KH':
				return 'km-KH-PisethNeural'
		}

		return 'en-US-AriaNeural'
	}

	public static async speak_text(text: string, locale_code: string): Promise<Uint8Array> {
		const speech_config = microsoft_speech_sdk.SpeechConfig.fromSubscription(
			MICROSOFT_SPEECH_KEY,
			'japanwest'
		)

		speech_config.speechSynthesisOutputFormat =
			microsoft_speech_sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
		speech_config.speechSynthesisVoiceName = this._get_voice_name(locale_code)

		const synthesizer = new microsoft_speech_sdk.SpeechSynthesizer(speech_config)

		return new Promise((resolve, reject) => {
			synthesizer.speakTextAsync(
				text,
				(result) => {
					if (result) {
						// console.log('result', result)
						const audio = result.audioData
						const uint8Array = new Uint8Array(audio)
						// console.log('audio', audio)
						resolve(uint8Array)
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
