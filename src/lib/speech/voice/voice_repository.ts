import type { LocaleCode } from '$lib/locale/locale_code'
import type { Locale, Voice } from '@prisma/client'

export type VoiceLocale = Voice & {
	locale: Locale
}

export interface VoiceRepository {
	find_first_by_locale_code(locale_code: LocaleCode): Promise<VoiceLocale | null>
}
