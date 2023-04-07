import { PrismaClient } from '@prisma/client'

// NOTE: language: https://cloud.google.com/text-to-speech?hl=ja#section-2
// NOTE: EMOJI: https://lets-emoji.com/national-flag-emoji/

type LocaleSeed = {
	code: string
	language: string
	country: string
	emoji: string
}

export class LocaleSeeder {
	private static readonly _seeds: LocaleSeed[] = [
		{ code: 'en-US', language: 'English', country: 'United States', emoji: '🇺🇸' },
		{ code: 'en-GB', language: 'English', country: 'Great Britain', emoji: '🇬🇧' },
		{ code: 'ja-JP', language: '日本語', country: '日本', emoji: '🇯🇵' },
		{ code: 'cmn-CN', language: '普通话', country: '中国大陆', emoji: '🇨🇳' },
		{ code: 'cmn-TW', language: '國語', country: '台灣', emoji: '🇹🇼' },
		{ code: 'yue-HK', language: '廣東話', country: '香港', emoji: '🇭🇰' },
		{ code: 'ko-KR', language: '한국어', country: '대한민국', emoji: '🇰🇷' },
		{ code: 'es-ES', language: 'Español', country: 'España', emoji: '🇪🇸' },

		// NOTE: アラブ連盟 https://emojipedia.org/flag-saudi-arabia/
		{ code: 'ar-XA', language: 'العربية', country: 'متعدد المناطق', emoji: '🇸🇦' },
		{ code: 'it-IT', language: 'Italiano', country: 'Italia', emoji: '🇮🇹' },
		{ code: 'de-DE', language: 'Deutsch', country: 'Deutschland', emoji: '🇩🇪' },
		{ code: 'fil-PH', language: 'Filipino', country: 'Pilipinas', emoji: '🇵🇭' },
		{ code: 'fr-FR', language: 'Français', country: 'France', emoji: '🇫🇷' },
		{ code: 'vi-VN', language: 'Tiếng Việt', country: 'Việt Nam', emoji: '🇻🇳' },
		{ code: 'ru-RU', language: 'Русский', country: 'Россия', emoji: '🇷🇺' },
		{ code: 'th-TH', language: 'ไทย', country: 'ประเทศไทย', emoji: '🇹🇭' },
		{ code: 'km-KH', language: 'ខ្មែរ', country: 'កម្ពុជា', emoji: '🇰🇭' },
		{ code: 'hi-IN', language: 'हिन्दी', country: 'भारत', emoji: '🇮🇳' },
		{ code: 'id-ID', language: 'Bahasa Indonesia', country: 'Indonesia', emoji: '🇮🇩' },
		{ code: 'pt-PT', language: 'Português', country: 'Portugal', emoji: '🇵🇹' },
		{ code: 'en-AU', language: 'English', country: 'Australia', emoji: '🇦🇺' },
		{ code: 'en-IN', language: 'English', country: 'India', emoji: '🇮🇳' },
		{ code: 'bn-IN', language: 'বাংলা', country: 'ভারত', emoji: '🇮🇳' },
		{ code: 'pa-IN', language: 'ਪੁਨਸ਼ਾਬੀ', country: 'ਭਾਰਤ', emoji: '🇮🇳' },
		{ code: 'ta-IN', language: 'தமிழ்', country: 'இந்தியா', emoji: '🇮🇳' },
		{ code: 'te-IN', language: 'తెలుగు', country: 'భారతదేశం', emoji: '🇮🇳' },
		{ code: 'mr-IN', language: 'मराठी', country: 'भारत', emoji: '🇮🇳' },
	]

	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async execute(): Promise<void> {
		for (const seed of LocaleSeeder._seeds) {
			const code = seed.code
			const language = seed.language
			const country = seed.country
			const emoji = seed.emoji

			await this._prisma_client.locale.upsert({
				where: { code },
				update: {},
				create: { code, language, country, emoji },
			})
		}
	}
}
