import text_to_speech from '@google-cloud/text-to-speech'
import { google } from '@google-cloud/text-to-speech/build/protos/protos'
import { LocaleCode } from './value/value_object/string_value_object/locale_code'
import { SpeechSound } from './value/value_object/string_value_object/speech_sound'
import type { SpeechText } from './value/value_object/string_value_object/speech_text'

export class SpeechByGoogle {
	private static _get_voice_name(locale_code: LocaleCode): string {
		if (locale_code.equals(LocaleCode.english_united_states)) return 'en-US-Neural2-J'
		if (locale_code.equals(LocaleCode.english_great_britain)) return 'en-GB-Neural2-B'
		if (locale_code.equals(LocaleCode.japanese_japan)) return 'ja-JP-Wavenet-D'
		if (locale_code.equals(LocaleCode.cantonese_hongkong)) return 'yue-HK-Standard-B'
		if (locale_code.equals(LocaleCode.korean_korea)) return 'ko-KR-Wavenet-C'

		return 'en-US-Neural2-J'
	}

	public static async synthesize_speech(speech_text: SpeechText, locale_code: LocaleCode): Promise<SpeechSound> {
		const languageCode = locale_code.toString()
		const name = this._get_voice_name(locale_code)

		const request = {
			input: { text: speech_text.toString() },
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
