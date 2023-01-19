import type { Speech } from '$lib/speech/speech'
import text_to_speech from '@google-cloud/text-to-speech'
import { google } from '@google-cloud/text-to-speech/build/protos/protos'
import { GoogleVoice } from './voice/google_voice'
import type { LocaleCode } from '../language/locale_code'
import { SpeechSound } from './sound/speech_sound'
import type { SpeechText } from './speech_text'

export class SpeechByGoogle implements Speech {
	public constructor(
		protected readonly _speech_text: SpeechText,
		protected readonly _locale_code: LocaleCode
	) {}

	public async speak(): Promise<SpeechSound> {
		const microsoft_voice = GoogleVoice.fromLocaleCode(this._locale_code)

		const text = this._speech_text.text
		const languageCode = this._locale_code.code
		const name = microsoft_voice.name

		// console.log('languageCode', languageCode)
		// console.log('name', name)

		const request = {
			input: { text },
			voice: { languageCode, name },
			audioConfig: { audioEncoding: google.cloud.texttospeech.v1.AudioEncoding.MP3 },
		}

		const text_to_speech_client = new text_to_speech.TextToSpeechClient()
		const [response] = await text_to_speech_client.synthesizeSpeech(request)
		const uint8_array = response.audioContent as Uint8Array
		const speech_sound = new SpeechSound(uint8_array)

		return speech_sound
	}
}
