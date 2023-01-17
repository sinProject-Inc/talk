import text_to_speech from '@google-cloud/text-to-speech'
import { google } from '@google-cloud/text-to-speech/build/protos/protos'
import { GoogleVoice } from './value/value_object/string_value_object/google_voice'
import type { LocaleCode } from './value/value_object/string_value_object/locale_code'
import { SpeechSound } from './value/value_object/string_value_object/speech_sound'
import type { SpeechText } from './value/value_object/string_value_object/text_value_object/speech_text'

export class SpeechByGoogle {
	public static async synthesize_speech(speech_text: SpeechText, locale_code: LocaleCode): Promise<SpeechSound> {
		const microsoft_voice = GoogleVoice.fromLocaleCode(locale_code)

		const languageCode = locale_code.string
		const name = microsoft_voice.string

		// console.log('languageCode', languageCode)
		// console.log('name', name)

		const request = {
			input: { text: speech_text.string },
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
