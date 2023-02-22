import type { Speech } from '$lib/speech/speech'
import text_to_speech from '@google-cloud/text-to-speech'
import protos from '@google-cloud/text-to-speech/build/protos/protos'
import { GoogleVoice } from './voice/google_voice'
import type { LocaleCode } from '../language/locale_code'
import { SpeechSound } from './sound/speech_sound'
import type { SpeechText } from './speech_text'

const { google } = protos

export class SpeechByGoogle implements Speech {
	public constructor(
		private readonly _speech_text: SpeechText,
		private readonly _locale_code: LocaleCode
	) {}

	public async speak(): Promise<SpeechSound> {
		const google_voice = GoogleVoice.from_locale_code(this._locale_code)

		const text = this._speech_text.text
		const language_code = this._locale_code.code
		const name = google_voice.name

		const request = {
			input: { text },
			voice: { languageCode: language_code, name },
			audioConfig: { audioEncoding: google.cloud.texttospeech.v1.AudioEncoding.MP3 },
		}

		const text_to_speech_client = new text_to_speech.TextToSpeechClient()
		const [response] = await text_to_speech_client.synthesizeSpeech(request)
		const uint8_array = response.audioContent as Uint8Array
		const speech_sound = new SpeechSound(uint8_array)

		return speech_sound
	}
}
