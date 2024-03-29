import { PrismaClient } from '@prisma/client'

type VoiceSeed = {
	locale_code: string
	name: string
	target: string
}

export class VoiceSeeder {
	private static readonly _seeds: VoiceSeed[] = [
		// NOTE: https://cloud.google.com/text-to-speech/docs/voices?hl=ja
		// NOTE: https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support?tabs=stt

		{ locale_code: 'af-ZA', name: 'af-ZA-Standard-A', target: 'google' },
		{ locale_code: 'id-ID', name: 'id-ID-Wavenet-B', target: 'google' },
		{ locale_code: 'ms-MY', name: 'ms-MY-Wavenet-B', target: 'google' },
		{ locale_code: 'ca-ES', name: 'ca-ES-Standard-A', target: 'google' },
		{ locale_code: 'da-DK', name: 'da-DK-Wavenet-C', target: 'google' },
		{ locale_code: 'de-DE', name: 'de-DE-Neural2-B', target: 'google' },

		{ locale_code: 'en-AU', name: 'en-AU-Neural2-B', target: 'google' },
		{ locale_code: 'en-GB', name: 'en-GB-Neural2-B', target: 'google' },
		{ locale_code: 'en-IN', name: 'en-IN-Wavenet-B', target: 'google' },
		{ locale_code: 'en-US', name: 'en-US-Neural2-J', target: 'google' },

		{ locale_code: 'es-ES', name: 'es-ES-Neural2-F', target: 'google' },
		{ locale_code: 'es-US', name: 'es-US-Neural2-B', target: 'google' },
		{ locale_code: 'eu-ES', name: 'eu-ES-Standard-A', target: 'google' },

		{ locale_code: 'fil-PH', name: 'fil-PH-Wavenet-C', target: 'google' },

		{ locale_code: 'fr-CA', name: 'fr-CA-Neural2-B', target: 'google' },
		{ locale_code: 'fr-FR', name: 'fr-FR-Neural2-B', target: 'google' },

		{ locale_code: 'gl-ES', name: 'gl-ES-Standard-A', target: 'google' },
		{ locale_code: 'it-IT', name: 'it-IT-Neural2-C', target: 'google' },
		{ locale_code: 'lv-LV', name: 'lv-LV-Standard-A', target: 'google' },
		{ locale_code: 'lt-LT', name: 'lt-LT-Standard-A', target: 'google' },
		{ locale_code: 'hu-HU', name: 'hu-HU-Wavenet-A', target: 'google' },
		{ locale_code: 'nl-NL', name: 'nl-NL-Wavenet-B', target: 'google' },
		{ locale_code: 'nb-NO', name: 'nb-NO-Wavenet-B', target: 'google' },
		{ locale_code: 'pl-PL', name: 'pl-PL-Wavenet-B', target: 'google' },

		{ locale_code: 'pt-BR', name: 'pt-BR-Wavenet-B', target: 'google' },
		{ locale_code: 'pt-PT', name: 'pt-PT-Wavenet-B', target: 'google' },

		{ locale_code: 'ro-RO', name: 'ro-RO-Wavenet-A', target: 'google' },
		{ locale_code: 'sk-SK', name: 'sk-SK-Wavenet-A', target: 'google' },
		{ locale_code: 'fi-FI', name: 'fi-FI-Wavenet-A', target: 'google' },
		{ locale_code: 'sv-SE', name: 'sv-SE-Wavenet-C', target: 'google' },
		{ locale_code: 'vi-VN', name: 'vi-VN-Wavenet-D', target: 'google' },
		{ locale_code: 'tr-TR', name: 'tr-TR-Wavenet-B', target: 'google' },

		{ locale_code: 'is-IS', name: 'is-IS-Standard-A', target: 'google' },
		{ locale_code: 'cs-CZ', name: 'cs-CZ-Wavenet-A', target: 'google' },
		{ locale_code: 'el-GR', name: 'el-GR-Wavenet-A', target: 'google' },
		{ locale_code: 'bg-BG', name: 'bg-BG-Standard-A', target: 'google' },

		{ locale_code: 'ru-RU', name: 'ru-RU-Standard-B', target: 'google' },
		{ locale_code: 'sr-RS', name: 'sr-RS-Standard-A', target: 'google' },
		{ locale_code: 'uk-UA', name: 'uk-UA-Wavenet-A', target: 'google' },

		{ locale_code: 'he-IL', name: 'he-IL-Wavenet-B', target: 'google' },
		{ locale_code: 'ar-XA', name: 'ar-XA-Wavenet-B', target: 'google' },

		{ locale_code: 'mr-IN', name: 'mr-IN-Wavenet-B', target: 'google' },
		{ locale_code: 'hi-IN', name: 'hi-IN-Neural2-B', target: 'google' },
		{ locale_code: 'bn-IN', name: 'bn-IN-Wavenet-B', target: 'google' },
		{ locale_code: 'pa-IN', name: 'pa-IN-Wavenet-B', target: 'google' },
		{ locale_code: 'gu-IN', name: 'gu-IN-Wavenet-B', target: 'google' },
		{ locale_code: 'ta-IN', name: 'ta-IN-Wavenet-B', target: 'google' },
		{ locale_code: 'te-IN', name: 'te-IN-Standard-B', target: 'google' },
		{ locale_code: 'kn-IN', name: 'kn-IN-Wavenet-B', target: 'google' },
		{ locale_code: 'ml-IN', name: 'ml-IN-Standard-B', target: 'google' },

		{ locale_code: 'th-TH', name: 'th-TH-Standard-A', target: 'google' },
		{ locale_code: 'km-KH', name: 'km-KH-PisethNeural', target: 'microsoft' },

		{ locale_code: 'cmn-TW', name: 'cmn-TW-Wavenet-B', target: 'google' },
		{ locale_code: 'yue-HK', name: 'yue-HK-Standard-B', target: 'google' },
		{ locale_code: 'ja-JP', name: 'ja-JP-Neural2-C', target: 'google' },
		{ locale_code: 'cmn-CN', name: 'cmn-CN-Wavenet-C', target: 'google' },
		{ locale_code: 'ko-KR', name: 'ko-KR-Wavenet-C', target: 'google' },
	]

	// eslint-disable-next-line @typescript-eslint/naming-convention
	public constructor(private readonly _prisma_client: PrismaClient) {}

	private async _get_locale_id(locale_code: string): Promise<number> {
		const locale = await this._prisma_client.locale.findUnique({
			where: { code: locale_code },
		})

		if (!locale) throw new Error(`Locale not found: ${locale_code}`)

		return locale.id
	}

	public async execute(): Promise<void> {
		for (const seed of VoiceSeeder._seeds) {
			const locale_code = seed.locale_code

			const name = seed.name
			const locale_id = await this._get_locale_id(locale_code)
			const target = seed.target

			await this._prisma_client.voice.upsert({
				where: { name },
				update: {},
				create: { name, locale_id, target },
			})
		}
	}
}
