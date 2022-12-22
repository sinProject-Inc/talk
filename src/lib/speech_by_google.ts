import text_to_speech from '@google-cloud/text-to-speech'
import { google } from '@google-cloud/text-to-speech/build/protos/protos'

export class SpeechByGoogle {
	private static _get_voice_name(locale_code: string): string {
		switch (locale_code) {
			case 'en-US':
				return 'en-US-Neural2-J'
			case 'en-GB':
				return 'en-GB-Neural2-B'
			case 'ja-JP':
				return 'ja-JP-Wavenet-D'
			case 'yue-HK':
				return 'yue-HK-Standard-B'
			case 'ko-KR':
				return 'ko-KR-Wavenet-C'
		}

		return 'en-US-Neural2-J'
	}

	public static async synthesize_speech(text: string, locale_code: string): Promise<Uint8Array> {
		const languageCode = locale_code
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
