import { PrismaClient } from '@prisma/client'

// NOTE: 世界の言語ランキング: https://japan.wipgroup.com/media/language-population
// NOTE: language: https://cloud.google.com/text-to-speech?hl=ja#section-2
// NOTE: EMOJI: https://lets-emoji.com/national-flag-emoji/
// NOTE: アラブ連盟 https://emojipedia.org/flag-saudi-arabia/

type LocaleSeed = {
	code: string
	language: string
	country: string
	emoji: string
}

export class LocaleSeeder {
	private static readonly _seeds: LocaleSeed[] = [
		{ code: 'af-ZA', language: 'Afrikaans', country: 'Suid-Afrika', emoji: '🇿🇦' },
		{ code: 'id-ID', language: 'Bahasa Indonesia', country: 'Indonesia', emoji: '🇮🇩' },
		{ code: 'ms-MY', language: 'Bahasa Melayu', country: 'Malaysia', emoji: '🇲🇾' },
		{ code: 'ca-ES', language: 'Català', country: 'Espanya', emoji: '🇪🇸' },
		{ code: 'da-DK', language: 'Dansk', country: 'Danmark', emoji: '🇩🇰' },
		{ code: 'de-DE', language: 'Deutsch', country: 'Deutschland', emoji: '🇩🇪' },

		{ code: 'en-AU', language: 'English', country: 'Australia', emoji: '🇦🇺' },
		{ code: 'en-GB', language: 'English', country: 'Great Britain', emoji: '🇬🇧' },
		{ code: 'en-IN', language: 'English', country: 'India', emoji: '🇮🇳' },
		{ code: 'en-US', language: 'English', country: 'United States', emoji: '🇺🇸' },

		{ code: 'es-ES', language: 'Español', country: 'España', emoji: '🇪🇸' },
		{ code: 'es-US', language: 'Español', country: 'Estados Unidos', emoji: '🇺🇸' },
		{ code: 'eu-ES', language: 'Euskara', country: 'Espainia', emoji: '🇪🇸' },

		{ code: 'fil-PH', language: 'Filipino', country: 'Pilipinas', emoji: '🇵🇭' },

		{ code: 'fr-CA', language: 'Français', country: 'Canada', emoji: '🇨🇦' },
		{ code: 'fr-FR', language: 'Français', country: 'France', emoji: '🇫🇷' },

		{ code: 'it-IT', language: 'Italiano', country: 'Italia', emoji: '🇮🇹' },
		{ code: 'pl-PL', language: 'Polski', country: 'Polska', emoji: '🇵🇱' },
		{ code: 'pt-PT', language: 'Português', country: 'Portugal', emoji: '🇵🇹' },
		{ code: 'vi-VN', language: 'Tiếng Việt', country: 'Việt Nam', emoji: '🇻🇳' },
		{ code: 'tr-TR', language: 'Türkçe', country: 'Türkiye', emoji: '🇹🇷' },
		{ code: 'ru-RU', language: 'Русский', country: 'Россия', emoji: '🇷🇺' },
		{ code: 'uk-UA', language: 'Українська', country: 'Україна', emoji: '🇺🇦' },
		{ code: 'ar-XA', language: 'العربية', country: 'متعدد المناطق', emoji: '🇸🇦' },

		{ code: 'mr-IN', language: 'मराठी', country: 'भारत', emoji: '🇮🇳' },
		{ code: 'hi-IN', language: 'हिन्दी', country: 'भारत', emoji: '🇮🇳' },
		{ code: 'bn-IN', language: 'বাংলা', country: 'ভারত', emoji: '🇮🇳' },
		{ code: 'pa-IN', language: 'ਪੁਨਸ਼ਾਬੀ', country: 'ਭਾਰਤ', emoji: '🇮🇳' },
		{ code: 'gu-IN', language: 'ગુજરાતી', country: 'ભારત', emoji: '🇮🇳' },
		{ code: 'ta-IN', language: 'தமிழ்', country: 'இந்தியா', emoji: '🇮🇳' },
		{ code: 'te-IN', language: 'తెలుగు', country: 'భారతదేశం', emoji: '🇮🇳' },
		{ code: 'kn-IN', language: 'ಕನ್ನಡ', country: 'ಭಾರತ', emoji: '🇮🇳' },
		{ code: 'ml-IN', language: 'മലയാളം', country: 'ഇന്ത്യ', emoji: '🇮🇳' },

		{ code: 'th-TH', language: 'ไทย', country: 'ประเทศไทย', emoji: '🇹🇭' },
		{ code: 'km-KH', language: 'ខ្មែរ', country: 'កម្ពុជា', emoji: '🇰🇭' },

		{ code: 'cmn-TW', language: '國語', country: '台灣', emoji: '🇹🇼' },
		{ code: 'yue-HK', language: '廣東話', country: '香港', emoji: '🇭🇰' },
		{ code: 'ja-JP', language: '日本語', country: '日本', emoji: '🇯🇵' },
		{ code: 'cmn-CN', language: '普通话', country: '中国大陆', emoji: '🇨🇳' },
		{ code: 'ko-KR', language: '한국어', country: '대한민국', emoji: '🇰🇷' },
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
