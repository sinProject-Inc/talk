import type { Locale } from '@prisma/client'
import type { LocaleCode } from './locale_code'

export interface LocaleRepository {
	find_many(): Promise<Locale[]>
	find_unique(locale_code: LocaleCode): Promise<Locale | null>
}
