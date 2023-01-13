import text_to_speech from '@google-cloud/text-to-speech'
import { google } from '@google-cloud/text-to-speech/build/protos/protos'
import { LocaleCode } from './value/value_object/string_value_object/locale_code'

export class SpeechByGoogle {
	private static _get_voice_name(locale_code: LocaleCode): string {
		if (locale_code.equals(LocaleCode.english_united_states)) return 'en-US-Neural2-J'
		if (locale_code.equals(LocaleCode.english_great_britain)) return 'en-GB-Neural2-B'
		if (locale_code.equals(LocaleCode.japanese_japan)) return 'ja-JP-Wavenet-D'
		if (locale_code.equals(LocaleCode.cantonese_hongkong)) return 'yue-HK-Standard-B'
		if (locale_code.equals(LocaleCode.korean_korea)) return 'ko-KR-Wavenet-C'

		return 'en-US-Neural2-J'
	}

	public static async synthesize_speech(text: string, locale_code: LocaleCode): Promise<Uint8Array> {
		const languageCode = locale_code.toString()
		const name = this._get_voice_name(locale_code)

		const request = {
			input: { text },
			voice: { languageCode, name },
			audioConfig: { audioEncoding: google.cloud.texttospeech.v1.AudioEncoding.MP3 },
		}
		const text_to_speech_client = new text_to_speech.TextToSpeechClient()
		const [response] = await text_to_speech_client.synthesizeSpeech(request)
		const uint8array = response.audioContent as Uint8Array

		return uint8array
	}
}
