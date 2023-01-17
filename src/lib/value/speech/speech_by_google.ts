import { Speech } from '$lib/speech'
import text_to_speech from '@google-cloud/text-to-speech'
import { google } from '@google-cloud/text-to-speech/build/protos/protos'
import { GoogleVoice } from '../value_object/string_value_object/google_voice'
import { SpeechSound } from '../value_object/string_value_object/speech_sound'

export class SpeechByGoogle extends Speech {
	public async speak(): Promise<SpeechSound> {
		const microsoft_voice = GoogleVoice.fromLocaleCode(this._locale_code)

		const text = this._speech_text.string
		const languageCode = this._locale_code.string
		const name = microsoft_voice.string

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
