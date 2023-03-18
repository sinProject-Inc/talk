import type { Speech } from '$lib/speech/speech'
import text_to_speech from '@google-cloud/text-to-speech'
import protos from '@google-cloud/text-to-speech/build/protos/protos'
import { SpeechSound } from './sound/speech_sound'
import type { SpeechText } from './speech_text'
import type { VoiceLocale } from './voice/voice_repository'

const { google } = protos

export class SpeechByGoogle implements Speech {
	public constructor(
		private readonly _speech_text: SpeechText,
		private readonly _voice_locale: VoiceLocale
	) {}

	public async speak(): Promise<SpeechSound> {
		const text = this._speech_text.text
		const locale_code = this._voice_locale.locale.code
		const name = this._voice_locale.name

		const request = {
			input: { text },
			voice: { languageCode: locale_code, name },
			audioConfig: { audioEncoding: google.cloud.texttospeech.v1.AudioEncoding.MP3 },
		}

		const text_to_speech_client = new text_to_speech.TextToSpeechClient()
		const [response] = await text_to_speech_client.synthesizeSpeech(request)
		const uint8_array = response.audioContent as Uint8Array
		const speech_sound = new SpeechSound(uint8_array)

		return speech_sound
	}
}
